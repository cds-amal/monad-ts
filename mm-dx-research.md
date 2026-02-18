# Evidence Journal: Functional vs Imperative DX Study

> **Looking for the takeaway?** See [What We Learned](./mm-dx-findings.md) for the distilled findings and recommendations. This document is the evidence journal: per-task implementation details, code samples, architecture deep-dives, and raw data tables.

---

## What This Is About

So, we wanted to figure out which approach works better for building apps on top of an enterprise design system: the "functional/monadic" style (lots of adapters, dependency injection, composition) or the "imperative" style (just use the components directly, inline the logic).

The short version? Imperative is faster out of the gate, but functional pays off in ways that really matter: cross-platform support, testability, and not wanting to throw your laptop out the window when you need to add feature flags.

**The headline finding:** The functional approach needed about 2.6x more code upfront. But here's the thing: it was the *only* approach that could ship iOS support without a major rewrite. The imperative branch? We documented what it would take to get there and then didn't do it, because it would've meant starting over.

The findings doc distills the thesis and key insights; what follows here is the evidence.

---

## How We Set This Up

### The Baseline

Both approaches use the same MetaMask Design System (MDS) packages:

| Package | What It Does |
|---------|--------------|
| `@metamask/design-system-react` | The component library (Box, Text, Button, etc.) |
| `@metamask/design-system-tailwind-preset` | Tailwind theme config |
| `@metamask/design-tokens` | Design tokens for colors, typography, spacing |

### The Branches

| Branch | Pattern | What's In It |
|--------|---------|--------------|
| `mm-imperative_01` | Imperative | Direct MDS usage, platform logic sprinkled inline |
| `mm-monad_01` | Functional | MDS wrapped in adapters, logic abstracted out |
| `mm-monad_02` | Functional | Same, but with code review feedback for larger teams |
| `mm-monad_03` | Functional | Feature flags, environment context |

### The Tasks

| Task | How Hard | What We're Testing |
|------|----------|-------------------|
| A: Input Component | Low | Can we reuse validation logic? |
| B: AddressSelect Refactor | Medium | Can we extract reusable primitives? |
| C: Dark Mode | Medium | Can we separate pure logic from side effects? |
| D: Cross-Platform (iOS) | High | Does the architecture extend, or do we start over? |
| E: Feature Flags | High | Runtime config, platform-specific UI |
| F: UI Config System | High | What happens when you bypass the adapter layer? |
| G: Close Adapter Gaps | Medium | Can a design directive propagate through layers without rewrites? |

---

## The Results (TL;DR)

### By the Numbers

| Metric | Functional | Imperative | Ratio |
|--------|------------|------------|-------|
| Total lines of code (Tasks A-D) | 864 | 327 | 2.6x |
| Reusable primitives created | 7 | 1 | 7x |
| Platforms supported | 2 (Web, iOS) | 1 (Web) | 2x |
| Files with platform conditionals | 0 | N/A | — |
| Files changed for design directive (Task G) | 15 (3 logic, 12 mechanical) | N/A (no centralized layer) | — |

### Cost Per Task (Functional)

This tells the compounding story. The infrastructure gets built once; each subsequent feature pays less for cross-platform support.

| Task | New Lines | Shared | Web-Only | Native-Only | Modified Files | New Deps |
|------|-----------|--------|----------|-------------|----------------|----------|
| A: Input Component | 147 | 147 | 0 | 0 | 1 | 0 |
| B: AddressSelect Refactor | 65 | 65 | 0 | 0 | 1 | 0 |
| C: Dark Mode | 85 | 85 | 0 | 0 | 2 | 0 |
| D: Cross-Platform (iOS) | 567 | 45 | 287 | 235 | 3 | 5 |
| E: Feature Flags | 318 | 70 | 108 | 175 | 4 | 0 |
| F: UI Config System | 849 | 215 | 351 | 283 | 6 | 1 |
| G: Close Adapter Gaps | 140 | 55 | 60 | 45 | 15 | 0 |

> For analysis of these numbers (compounding costs, shared code ratios, velocity crossover chart), see [Findings: The Numbers](./mm-dx-findings.md#the-numbers) and [Findings: The Velocity Crossover](./mm-dx-findings.md#the-velocity-crossover).

---

## The Details

### Task A: Input Component

**The problem:** MDS doesn't ship an Input component, so we had to build one.

| Metric | Functional | Imperative |
|--------|------------|------------|
| Lines of code | 147 | 76 |
| Validation approach | Composable `ValidationResult.chain()` | Inline `getAmountError()` function |
| Reusability | Works in any form | Single-use |

**What the functional version looks like:**
```typescript
const validator = ValidationResult.chain(
  Validators.numeric('Invalid'),
  Validators.positive('Must be > 0'),
  Validators.max(balance, 'Exceeds balance')
)
<Input validate={validator} />
```

**What the imperative version looks like:**
```typescript
const getError = () => {
  if (isNaN(num)) return 'Invalid'
  if (num <= 0) return 'Must be > 0'
  if (num > balance) return 'Exceeds balance'
}
<Input error={getError()} />
```

**What we learned:** The functional version creates testable, composable primitives. The imperative version is simpler, but you end up copy-pasting that validation logic into every form. (We've all been there.)

---

### Task B: AddressSelect Refactor

**The problem:** The AddressSelect component was 133 lines and needed to be simplified.

| Metric | Functional | Imperative |
|--------|------------|------------|
| Final lines | 65 | 108 |
| New primitives | Dropdown, groupBy, style functors | Just an AccountBadge |
| Reuse potential | Any dropdown (tokens, networks, etc.) | Nope |

**What we learned:** The functional approach extracted a generic `Dropdown` primitive we can reuse for token selects, network selects, you name it. The imperative approach kept everything inline.

---

### Task C: Dark Mode

**The problem:** Implement theme switching using MDS tokens.

| Metric | Functional | Imperative |
|--------|------------|------------|
| Hook lines | 85 | 23 |
| Pure functions | ThemeOps module | None |
| System preference handling | Reactive (updates when OS changes) | Init only (set once and forget) |

**What we learned:** The functional approach separates pure operations (easy to test!) from effects (the React stuff). The imperative approach is way more concise, but the logic is coupled to the React lifecycle. Testing it means mocking hooks, which... nobody enjoys.

---

### Task D: Cross-Platform (iOS)

> **Key finding:** [Cross-platform comes free or requires a rewrite](./mm-dx-findings.md#1-cross-platform-comes-free-or-requires-a-rewrite)

**The problem:** Get the app running on iOS simulator.

| Metric | Functional | Imperative |
|--------|------------|------------|
| Deliverable | Working iOS app | A document explaining why we couldn't |
| Architecture change | None needed | Would require a rewrite |
| New abstractions | Platform-specific files (`.native.tsx`) | N/A |

**This is the big one.** Task D is where the imperative approach hit a wall. It couldn't achieve iOS support without basically adopting the functional patterns anyway (adapters, dependency injection, the whole thing).

**How the functional architecture handles it:**
```console
src/adapters/
  types.ts              # UIAdapter interface
  web.tsx               # MDS wrapper
  native.tsx            # React Native implementation
  AdapterContext.tsx    # Web context
  AdapterContext.native.tsx  # Native context (avoids web imports)
```

Components just consume adapters without knowing what platform they're on:
```typescript
const { Box, Text, Button } = usePrimitives()
```

That's it. The bundler picks the right file based on platform.

---

### Task E: Feature Flags + Environment Context

**The problem:** Add feature-flagged UI that looks different on each platform.

| Metric | Functional | Imperative (Hypothetical) |
|--------|------------|---------------------------|
| Flag infrastructure | 35 lines in a context | Retrofit a library or use localStorage |
| Platform-specific UI | `.native.tsx` files | `Platform.OS` conditionals everywhere |
| Environment detection | Single entry point definition | Scattered `__DEV__` / `import.meta.env` checks |
| Disable a feature | 1 line change | Find and remove all the conditionals |

**How we built it:**

1. **EnvironmentContext**: Defines `{ mode, platform, isDev }` once at the entry point
2. **FeatureFlagsContext**: Provides `useFeatureFlag('name')` hook
3. **Platform-specific components:**
   - `FlaggedAddressTooltip.tsx` (Web: click to show a tooltip)
   - `FlaggedAddressTooltip.native.tsx` (iOS: modal card slides from top)

**What we learned:** The functional architecture's existing patterns (contexts, adapters) made this feature almost trivial to add. For the imperative approach, we would've had to retrofit all that infrastructure first.

---

### Task F: UI Config System (Long-Press Configuration Dialog)

> **Key finding:** [Architecture only works if you use it](./mm-dx-findings.md#2-architecture-only-works-if-you-use-it)

**The problem:** Add a runtime UI configuration system: long-press any configurable component to reveal a dialog for adjusting its properties (variant, size, density, visibility). Changes persist across sessions.

| Metric | Value |
|--------|-------|
| New lines (total) | 849 |
| New lines (shared) | 215 (types, context, hook, barrel) |
| New lines (web-only) | 351 (persistence, long-press, dialog) |
| New lines (native-only) | 283 (persistence, long-press, dialog) |
| Modified lines (insertions/deletions) | +170 / -78 across 6 files |
| New files | 11 (4 shared, 4 web-only, 3 native-only) |
| Modified files | 6 |
| Platform-specific files | `ConfigDialog.native.tsx`, `LongPressWrapper.native.tsx`, `persistence.native.ts` |
| Feature-flagged | Yes (`enableUIConfig`) |
| Reusable hooks created | 3 (`useConfigurable`, `useLongPress`, `useUIConfig`) |
| New dependency | `@react-native-async-storage/async-storage` (native only) |

**This is the interesting one.** Not because it's hard, but because the first implementation got it wrong, and the failure mode is instructive.

#### What Went Wrong (And What It Teaches)

The initial implementation bypassed the adapter layer. The `ConfigDialog` used raw HTML elements (`<div>`, `<input type="range">`, `<input type="color">`, `<button>`) instead of going through `usePrimitives()`. The `LongPressWrapper` was a raw `<div>` with mouse/touch event handlers. The persistence layer used `localStorage` directly.

The result? Web worked great. Native crashed immediately with `View config getter callback for component 'div' must be a function`. The monadic architecture went from supporting both platforms to only supporting one.

**This is the key finding from Task F: a good architecture can still produce a bad outcome if you don't use it.** The adapter layer was right there. The patterns were established. The developer (in this case, an AI) just... went around them, because raw HTML was faster to type.

#### The Three Bypass Points

**1. Modal/overlay pattern (no adapter primitive)**

The adapter provides `Box`, `Text`, `Button`, `Pressable`, `TextInput`, `ScrollView`, `IconButton`. It doesn't have a `Modal` or `Overlay`. So the dialog reached for `<div style={{ position: 'fixed' }}>` on web, which has no native equivalent.

The fix: platform-specific files. `ConfigDialog.tsx` uses a `<div>` overlay on web. `ConfigDialog.native.tsx` uses React Native's `Modal`. The dialog *content* (labels, chips, buttons) goes through the adapter on both platforms.

This is the same pattern we used for `FlaggedAddressTooltip` in Task E. The precedent existed; it just wasn't followed.

**2. Specialized inputs (`<input type="range">`, `<input type="color">`)**

The adapter's `TextInput` covers text/number/password. It doesn't cover range sliders or color pickers. The web dialog used browser-native inputs that don't exist on React Native.

The fix on native: `+`/`-` stepper buttons for the slider type (built from `Pressable` + `Text`), plain `TextInput` for color values. Different interaction pattern, same data flow. This is the adapter model working correctly: the interaction may be platform-specific, but the state management and data types are shared.

**3. Persistence (`localStorage` vs `AsyncStorage`)**

`localStorage` is synchronous and web-only. React Native doesn't have it. The original persistence module used it directly, which silently failed on native (the try/catch returned `{}`; configs worked in-session but never persisted).

The fix: `persistence.ts` wraps `localStorage` in async functions. `persistence.native.ts` uses `@react-native-async-storage/async-storage`. The context loads overrides asynchronously on mount, starting with empty state. Same interface, platform-appropriate implementation. The bundler (Vite vs Metro) picks the right file automatically.

#### Why This Happened

It's tempting to say "just follow the adapter pattern" and leave it at that. But there's a structural reason the adapter got bypassed: **the adapter didn't cover the use case**.

The adapter's primitive set was designed for content layout (Box, Text, Pressable, Button, TextInput). The ConfigDialog needed an *overlay* pattern (modal backdrop, positioned container, specialized inputs). When the primitives don't cover what you need, the path of least resistance is to drop down to the platform directly, which means you silently break cross-platform support.

This suggests a design principle: **the adapter layer should have a clear policy for when it's OK to go platform-specific, and the mechanism for doing so (`.native.tsx` files) should be the obvious choice, not an afterthought.** In this codebase, the `.native.tsx` pattern was established (Task D, Task E), but it wasn't the reflex. The reflex was to use `<div>`.

#### The Architecture Held Up (Where It Was Used)

The parts of the UI config system that went through the adapter worked on both platforms immediately:

- `useConfigurable` hook: shared, works everywhere
- `UIConfigContext` + `UIConfigProvider`: shared, works everywhere
- `LongPressWrapper.native.tsx`: uses RN's `Pressable` with `onLongPress`
- `LongPressWrapper.tsx`: uses `<div>` with mouse/touch timer
- Dialog content (labels, chip buttons, reset button): adapter primitives on both platforms
- Feature flag gating: `useFeatureFlag('enableUIConfig')`, same pattern as Task E

The lesson isn't that the architecture failed. It's that the architecture only works if you actually use it, and the failure mode when you don't is a silent regression from cross-platform to single-platform.

#### Storage: The Platform Split Done Right

Worth calling out how persistence ended up, because it's a good example of the monadic split working as intended:

```
persistence.ts          → localStorage (sync, wrapped in async)
persistence.native.ts   → AsyncStorage (truly async)
```

Both export the same async interface: `loadOverrides()`, `saveOverrides()`, `clearOverrides()`. The `UIConfigContext` calls `loadOverrides().then(setOverrides)` on mount. On web, the Promise resolves immediately (it's just wrapping sync localStorage). On native, it resolves after the real async read. Same consumer code, platform-appropriate storage.

This is the "overhead" from Tasks A through D paying off: the `.native.ts` file pattern, the async-compatible context initialization, the bundler resolution. All infrastructure that was already in place.

#### Tooling Gotcha: Metro Cache and `.native` File Resolution

One more friction point worth documenting. After creating the `.native.tsx` files, the iOS build still crashed with the same `div` error. Turns out Metro (React Native's bundler) caches module resolution. When `ConfigDialog.native.tsx` was created while Metro was already running, Metro had already resolved `./ConfigDialog` to `ConfigDialog.tsx` (the web version) and cached that mapping. Hot reload picks up file *changes*, but it doesn't re-evaluate which file an import should resolve to when a new platform-specific variant appears.

The fix: restart Metro with `--clear` to flush the module resolution cache. We ended up adding `--clear` to the `ios` and `android` scripts in `package.json` as a default, because this gotcha bites you every time you add a new `.native` file mid-session.

This is a tooling cost of the `.native.tsx` convention. The pattern itself is correct (zero-config platform splitting, tree-shakeable, bundler handles routing), but the build tool has a sharp edge: its cache doesn't expect new files to change how an existing import resolves. In practice this means the first time you add a `.native` variant of an existing module, you need to restart the bundler. Not a dealbreaker, but surprising enough to burn 10 minutes the first time you hit it.

#### Updated Provider Stack

```typescript
<EnvironmentProvider>      // Platform + mode detection
  <ThemeProvider>          // Theme state
    <FeatureFlagsProvider> // Feature toggles
      <ServicesProvider>   // Business logic injection
        <AdapterProvider>  // UI primitive injection
          <UIConfigProvider>  // Runtime UI configuration
            <App />
            <ConfigDialog />
          </UIConfigProvider>
        </AdapterProvider>
      </ServicesProvider>
    </FeatureFlagsProvider>
  </ThemeProvider>
</EnvironmentProvider>
```

`UIConfigProvider` sits inside `AdapterProvider` (it needs primitives for the dialog) and inside `FeatureFlagsProvider` (it's gated behind `enableUIConfig`).

---

### Task G: Close Adapter Gaps (Design System Compliance)

> **Key findings:** [Adapter surface width determines guideline enforceability](./mm-dx-findings.md#3-adapter-surface-width-determines-guideline-enforceability) and [Design directives propagate structurally, not socially](./mm-dx-findings.md#4-design-directives-propagate-structurally-not-socially)

**The problem:** After Task F, an audit found that 12 of 25 source files had `style` escape hatches: inline `style` props for layout properties (`position`, `flex`, `overflow`, `opacity`, sizing), hex colors in the ConfigDialog sub-editors, and raw `<button>` / `<input>` elements where adapter primitives should be. The design team directive: eliminate the escape hatches by expanding the adapter surface so components don't need to drop down to raw styles for common layout operations.

| Metric | Value |
|--------|-------|
| New logic (adapter layer) | ~140 lines across 3 files |
| Consumer files changed | 12 (all mechanical substitutions) |
| Hex colors eliminated | 5 (`#0376c9`, `#e7f0f9`, `#bbc0c5`, `#fdf2f2`, `#dc2626` in components; 2 `#121314`/`#f3f5f9` in entry point) |
| Raw HTML elements replaced | 4 (`<button>` in BooleanEditor, SelectEditor; `<input type="text">` in TextEditor, ColorEditor) |
| Behavioral changes | 0 (app looks and works identically) |
| New dependencies | 0 |

**This is the most architecturally revealing task in the study.** Not because it's hard (it's genuinely easy), but because it demonstrates what "centralized change" actually looks like in practice, and what the imperative alternative would cost.

#### What Happened

The adapter's `BoxProps` didn't cover common layout properties: `position`, `flex`, `overflow`, `opacity`, sizing (`width`, `height`, `maxWidth`, etc.), directional borders (`borderBottomWidth`, `borderBottomColor`). So components used `style={{ position: 'relative' }}` as an escape hatch. The design team says: close those gaps.

The fix landed in three layers:

1. **`types.ts`** (+35 lines): Added 23 new props to `BoxProps` and `textAlign` to `TextProps`
2. **`web.tsx`** (+60 lines): New props pass through to CSS style. Added a `borderColorCSSMap` to resolve semantic border names to CSS custom properties for directional borders
3. **`native.tsx`** (+45 lines): New props added to `computedStyle`. Directional border colors resolve through the existing `getBorderColor()` helper

After that, every component change was mechanical:

```
// Before
<Box style={{ position: 'relative' }}>
<Box style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50 }}>
<Box style={{ flex: 1 }}>
<Text style={{ textAlign: 'center' }}>
<Box style={{ height: 1 }} backgroundColor="muted" />

// After
<Box position="relative">
<Box position="absolute" top="100%" left={0} zIndex={50}>
<Box flex={1}>
<Text textAlign="center">
<Box height={1} backgroundColor="muted" />
```

The ConfigDialog sub-editors got a bigger cleanup: `<button onClick>` became `<Pressable onPress>` wrapping a `<Box>` with semantic border/background colors. Five hex color literals (chip selected/unselected states) became `borderColor="primary"`, `backgroundColor="primaryMuted"`, `borderColor="default"`. Two `<input type="text">` elements became `<TextInput>` from the adapter.

#### Why This Matters for the Problem Statement

The original problem statement (`PROBLEM_STATEMENT.md`) identifies the core issue: AI tools generate `<div style={{ backgroundColor: '#3b82f6' }}>` instead of `<Box backgroundColor="primary">`. Task G demonstrates that the functional/adapter architecture provides a structural remedy for this problem, not just a stylistic preference.

Here's the thing. The problem statement frames this as a documentation gap: "AI tools default to imperative patterns because they lack design system context." That's true, and `agents.md` addresses it (the AI guidelines doc). But Task G reveals something deeper: **even when the guidelines exist and the AI follows them, the adapter surface determines the boundary between "correct" and "escape hatch."**

Before Task G, an AI following `agents.md` perfectly would still produce `style={{ position: 'relative' }}` because `BoxProps` didn't have a `position` prop. The guidelines say "no inline styles," but the adapter didn't offer a semantic alternative. The AI had two choices: violate the guidelines, or don't build the feature. That's not a documentation problem; it's an architecture problem.

After Task G, the adapter covers the common layout surface. An AI following the guidelines can now express `position`, `flex`, `overflow`, `opacity`, and sizing without ever reaching for `style`. The remaining `style` usages are genuinely platform-specific (shadows, transforms, `position: 'fixed'`, animation), and `agents.md` now documents exactly which escape hatches are acceptable and why.

So, then, what did expanding the adapter surface actually do? It moved the line between "the guidelines are enforceable" and "the guidelines are aspirational." Before: ~60% of layout operations required escape hatches. After: escape hatches are the exception (7 documented cases), not the norm.

The problem statement's "Desired State" table says: "Design team updates brand colors: Design tokens update, all components update automatically." Task G demonstrates the broader version of this: "Design team says 'stop using inline styles for layout': Expand adapter types, all components update mechanically."

#### The Imperative Counterfactual

What would this task look like on the imperative branch? Turns out there's nothing to do, and that's the problem.

In an imperative codebase, there's no adapter layer. Components use MDS `<MDSBox>` directly (or worse, raw `<div>`). The directive "stop using inline styles for layout properties" has no single place to land. It becomes:

1. A code review comment that gets applied inconsistently across PRs
2. A lint rule that flags violations but can't auto-fix (the "correct" replacement depends on context)
3. A refactoring sprint that touches the same 12 files but without the guarantee that the changes are mechanical

The functional approach turns a social directive ("please stop doing this") into a structural one ("the type system now supports this; use it"). The social version has a half-life measured in sprints. The structural version is permanent.

#### Effort Distribution: The 3/12 Split

This is the number that matters: **3 files needed new logic, 12 files needed only mechanical substitutions.** That 20/80 split is the adapter architecture doing exactly what it's designed to do. The logic changes (how to map semantic prop names to platform implementations) are centralized. The consumption changes (swap `style` for props) are rote.

In a codebase without adapters, the ratio inverts. Every file's changes require understanding how that component's layout interacts with the platform. There's no single "truth" to update; there are 15 independent decisions about how to express layout intent.

#### What Still Uses `style` (And Why That's Fine)

After Task G, seven categories of `style` usage remain:

| Usage | Why |
|-------|-----|
| `position: 'fixed'` (ConfigDialog.tsx overlay) | Not supported in React Native |
| `boxShadow` / `shadowColor` / `elevation` | Different API on web vs native |
| `transform: [{ translateY }]` (Input.tsx) | Complex, rare |
| `marginHorizontal: 'auto'` (App.tsx) | Web centering trick; no RN equivalent |
| `display: 'inline-flex'` (FlaggedAddressTooltip.tsx) | Web-only concept |
| `fontSize: 48` on emoji (App.tsx) | One-off sizing, not a text variant |
| `Animated.View` styles (FlaggedAddressTooltip.native.tsx) | RN animation API |

These are genuinely platform-specific or one-off cases. The `style` prop isn't going away; it's becoming what it should be: an escape hatch for the 5% of cases where semantic props can't express the intent, not a crutch for the 95% where they can.

---

## Architecture Comparison

### What the Functional Structure Looks Like (mm-monad_03)

```console
src/
├── environment/           # Cross-platform environment detection
│   ├── types.ts          # Environment interface
│   ├── EnvironmentContext.tsx
│   └── index.ts
├── features/             # Feature flag system
│   ├── types.ts          # FeatureFlags interface
│   ├── FeatureFlagsContext.tsx
│   └── index.ts
├── services/             # Dependency injection
│   ├── types.ts          # Services interface
│   ├── ServicesContext.tsx
│   └── defaultServices.ts
├── adapters/             # Platform abstraction
│   ├── types.ts          # UIAdapter interface
│   ├── web.tsx           # Web implementation
│   ├── native.tsx        # Native implementation
│   └── tokens.native.ts  # Generated from MDS
├── config/               # Runtime UI configuration (Task F)
│   ├── types.ts          # ConfigProperty, UIElementConfig
│   ├── persistence.ts    # localStorage (web)
│   ├── persistence.native.ts  # AsyncStorage (native)
│   ├── useLongPress.ts   # Web gesture hook
│   ├── LongPressWrapper.tsx        # Web: <div> + timer
│   ├── LongPressWrapper.native.tsx # Native: RN Pressable
│   ├── UIConfigContext.tsx    # Provider + hook (shared)
│   ├── useConfigurable.ts    # Integration hook (shared)
│   ├── ConfigDialog.tsx       # Web dialog (HTML overlay)
│   ├── ConfigDialog.native.tsx # Native dialog (RN Modal)
│   └── index.ts
├── validation/           # Composable validation
│   ├── index.ts          # ValidationResult monad
│   └── addressValidation.ts
├── theme/
│   └── useTheme.tsx      # Theme context
└── components/
    ├── Component.tsx         # Shared components
    └── Component.native.tsx  # Platform-specific overrides
```

### The Provider Stack

```typescript
<EnvironmentProvider>      // Platform + mode detection
  <ThemeProvider>          // Theme state
    <FeatureFlagsProvider> // Feature toggles
      <ServicesProvider>   // Business logic injection
        <AdapterProvider>  // UI primitive injection
          <UIConfigProvider>  // Runtime UI configuration
            <App />
            <ConfigDialog />
          </UIConfigProvider>
        </AdapterProvider>
      </ServicesProvider>
    </FeatureFlagsProvider>
  </ThemeProvider>
</EnvironmentProvider>
```

Yeah, it's a lot of providers. But each one does exactly one thing, and you only pay for what you use.

---

## Code Samples: Overhead vs Payoff

Okay, let's get concrete. What does the overhead actually look like, and what do you get for it?

### The Overhead: Entry Point Setup

**Functional (main.tsx): 33 lines**
```typescript
import { EnvironmentProvider, createEnvironment } from './environment'
import { ThemeProvider } from './theme/useTheme'
import { FeatureFlagsProvider } from './features'
import { ServicesProvider } from './services/ServicesContext'
import { AdapterProvider } from './adapters'

const environment = createEnvironment(
  import.meta.env.DEV ? 'development' : 'production',
  'web'
)

createRoot(document.getElementById('root')!).render(
  <EnvironmentProvider environment={environment}>
    <ThemeProvider>
      <FeatureFlagsProvider>
        <ServicesProvider services={defaultServices}>
          <AdapterProvider adapter={webAdapter}>
            <App />
          </AdapterProvider>
        </ServicesProvider>
      </FeatureFlagsProvider>
    </ThemeProvider>
  </EnvironmentProvider>
)
```

**Imperative (hypothetical): 8 lines**
```typescript
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
```

**The cost:** +25 lines at the entry point, 5 context providers to understand.

But wait. What's up with all those providers? Let's see what they buy you.

---

### The Payoff: Component Consumption

**Functional component hooks:**
```typescript
export function FlaggedAddressTooltip({ address }: Props) {
  // 4 hooks provide all dependencies: mockable, swappable, testable
  const { Box, Text, Pressable } = usePrimitives()      // UI primitives
  const { getFlagDetails } = useServices()              // Business logic
  const enabled = useFeatureFlag('enableFlaggedAddressExplanation')  // Feature toggle
  const { isDev } = useEnvironment()                    // Environment info

  if (!enabled) return null
  // ... render using injected dependencies
}
```

**Imperative equivalent:**
```typescript
export function FlaggedAddressTooltip({ address }: Props) {
  // Direct imports: hardcoded, can't mock without jest.mock()
  import { Box, Text } from '@metamask/design-system-react'
  import { getFlagDetails } from '../services/mockAccounts'

  // Scattered environment checks
  const enabled = localStorage.getItem('enableFlaggedAddressExplanation') !== 'false'
  const isDev = process.env.NODE_ENV !== 'production'  // or import.meta.env.DEV?

  if (!enabled) return null
  // ... render with hardcoded dependencies
}
```

**The payoff:** Functional components are pure functions of their injected dependencies. Testing just means wrapping in providers with mock values. No module mocking required.

---

### The Payoff: Platform-Specific Implementation

Both files export the same interface but implement platform-appropriate UX:

**Web (FlaggedAddressTooltip.tsx): 108 lines**
```typescript
// Click to reveal tooltip positioned below trigger
export function FlaggedAddressTooltip({ address, onDismiss }: Props) {
  const { Box, Text, Pressable } = usePrimitives()
  const { getFlagDetails } = useServices()
  const enabled = useFeatureFlag('enableFlaggedAddressExplanation')
  const [showDetails, setShowDetails] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Click-outside handling for web
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowDetails(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDetails])

  if (!enabled) return null

  return (
    <Box style={{ position: 'relative' }}>
      <Pressable onPress={() => setShowDetails(!showDetails)}>
        <Text>ⓘ</Text>
      </Pressable>
      {showDetails && (
        <div ref={tooltipRef}>
          <Box style={{ position: 'absolute', top: '100%' }}>
            {/* Tooltip content */}
          </Box>
        </div>
      )}
    </Box>
  )
}
```

**iOS (FlaggedAddressTooltip.native.tsx): 175 lines**
```typescript
// Tap to reveal modal card sliding from top, swipe to dismiss
export function FlaggedAddressTooltip({ address, onDismiss }: Props) {
  const { Box, Text, Pressable } = usePrimitives()  // Same hooks!
  const { getFlagDetails } = useServices()           // Same hooks!
  const enabled = useFeatureFlag('enableFlaggedAddressExplanation')  // Same hooks!

  const slideAnim = useRef(new Animated.Value(-CARD_HEIGHT)).current
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -10,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -30) hideCard()
    },
  })).current

  if (!enabled) return null

  return (
    <>
      <Pressable onPress={showCard} onLongPress={dismiss}>
        <Text>⚠</Text>
      </Pressable>
      <Modal visible={showCard} transparent>
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY: slideAnim }] }}
        >
          {/* Card content */}
        </Animated.View>
      </Modal>
    </>
  )
}
```

**The key observation:** The component interface is identical. The consuming code (`AddressSelect.tsx`) imports `FlaggedAddressTooltip` without knowing which implementation it gets. Metro bundles `.native.tsx`, Vite bundles `.tsx`. The component just works.

---

### What Imperative Cross-Platform Would Look Like

If we'd tried to do this imperatively:

```typescript
// Inline platform conditionals everywhere
export function FlaggedAddressTooltip({ address }: Props) {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android'

  // Can't use MDS components on native: they're web-only
  const Box = isNative ? View : MDSBox
  const Text = isNative ? RNText : MDSText

  // Different interaction patterns
  if (isNative) {
    return (
      <TouchableOpacity onPress={showModal} onLongPress={dismiss}>
        {/* Native modal implementation */}
      </TouchableOpacity>
    )
  }

  return (
    <div onClick={toggleTooltip}>
      {/* Web tooltip implementation */}
    </div>
  )
}
```

**Why this is a nightmare:**
1. Single file becomes unmaintainable with both implementations
2. Platform checks scattered throughout render logic
3. Can't tree-shake unused platform code
4. MDS imports break the native bundle (crypto dependencies)
5. Testing requires mocking `Platform.OS`

---

### The Payoff: Feature Flags

**Functional: Define a flag (types.ts)**
```typescript
export interface FeatureFlags {
  enableFlaggedAddressExplanation: boolean
  // Adding a new flag = 1 line here
  enableNewFeature: boolean
}

export const defaultFlags: FeatureFlags = {
  enableFlaggedAddressExplanation: true,
  // + 1 line here
  enableNewFeature: false,
}
```

**Functional: Use it in a component**
```typescript
function MyComponent() {
  const enabled = useFeatureFlag('enableFlaggedAddressExplanation')
  //                             ^ TypeScript autocomplete, typos = compile error

  if (!enabled) return null
  return <FeatureUI />
}
```

**Functional: Override for testing or A/B**
```typescript
// Test file
render(
  <FeatureFlagsProvider flags={{ enableFlaggedAddressExplanation: false }}>
    <MyComponent />
  </FeatureFlagsProvider>
)

// A/B test in production
const flags = getUserABTestFlags(userId)  // from backend
<FeatureFlagsProvider flags={flags}>
  <App />
</FeatureFlagsProvider>
```

**Functional: Disable a feature globally**
```typescript
// Change ONE line in defaults:
export const defaultFlags: FeatureFlags = {
  enableFlaggedAddressExplanation: false,  // Done.
}
```

---

**Now here's the imperative version. No infrastructure, scattered checks:**

```typescript
// Component A
function AddressSelect() {
  const enabled = localStorage.getItem('enableFlaggedAddressExplanation') !== 'false'
  //              ^ No TypeScript safety, string typos fail silently
  if (enabled) {
    // show feature
  }
}

// Component B: same check, possibly different key name?
function TransferForm() {
  const flag = localStorage.getItem('flaggedAddressExplanation')  // Typo!
  if (flag === 'true') {  // Different truthy check!
    // show feature
  }
}

// Component C: yet another variation
function Sidebar() {
  if (window.FEATURE_FLAGS?.enableFlaggedExplanation) {  // Global object now?
    // show feature
  }
}
```

**Imperative: Disable a feature**
```bash
# Find all localStorage.getItem calls for this flag
grep -r "enableFlaggedAddressExplanation" src/
# Manually update each, hope you found them all
# Or leave dead code with flag always false
```

**Imperative: Testing**
```typescript
// Must mock localStorage globally
beforeEach(() => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'enableFlaggedAddressExplanation') return 'false'
    return null
  })
})
// Mocking affects ALL tests in file unless carefully reset
```

---

**Feature Flags Comparison:**

| Aspect | Functional | Imperative |
|--------|------------|------------|
| Add new flag | 2 lines (interface + default) | N/A (no system) |
| Type safety | ✅ Compile-time autocomplete | ❌ String keys, silent failures |
| Use in component | `useFeatureFlag('name')` | `localStorage.getItem('name')` |
| Override for test | Wrap in provider | Mock global Storage |
| A/B testing | Pass flags from backend | Build custom solution |
| Disable feature | Change 1 default value | Find/update all usages |
| Find all usages | Search `useFeatureFlag('name')` | Search string literal (may vary) |

---

### Summary: What Does the Overhead Buy You?

| Infrastructure | Lines | Purpose |
|----------------|-------|---------|
| EnvironmentContext | 35 | Cross-platform `isDev`, `platform` |
| FeatureFlagsContext | 35 | Runtime feature toggles |
| ServicesContext | 40 | Dependency injection |
| AdapterContext | 45 | UI primitive abstraction |
| **Total overhead** | **~155** | **Enables everything below** |

| Payoff | Functional | Imperative |
|--------|------------|------------|
| Add iOS support | Create `.native.tsx` files | Rewrite with Platform.OS conditionals |
| Add feature flag | 1 line in interface + default | Retrofit localStorage or library |
| Mock for testing | Wrap in provider | jest.mock() each import |
| Swap service impl | Change provider value | Find/replace imports |
| Environment check | `useEnvironment().isDev` | `__DEV__` or `import.meta.env.DEV` (platform-specific) |

The 155 lines of infrastructure investment enables capabilities that would require 500+ lines of scattered conditionals and architectural rework in the imperative approach.

---

## So, Does This Actually Align With Good Testing Practices?

The previous sections show *what* each approach enables. This section is about *why* those differences matter. We're measuring alignment with four properties that characterize effective testing at scale.

### The Framework

| Property | What It Means | Why Enterprises Care |
|----------|---------------|---------------------|
| **Fast** | Tests execute quickly | Tight feedback loops enable continuous deployment |
| **Predictive** | Test results signal production behavior | Fewer escaped bugs, more deployment confidence |
| **Low Cost** | Minimal time, money, cognitive overhead | Sustainable velocity over years, not weeks |
| **Velocity-Enabling** | Fail fast, document the domain | Teams can iterate toward product-market fit with guardrails |

When an architecture aligns with these, you can ship frequently with confidence, onboard engineers who contribute quickly, and pivot features without archaeological rewrites.

When it doesn't? Slow CI pipelines that developers learn to circumvent. Flaky tests that erode trust. Tribal knowledge that leaves when people do. Feature flags implemented three different ways.

### Breaking It Down

#### Fast (Test Execution Speed)

| Aspect | Functional | Imperative | Who Wins? |
|--------|------------|------------|-----------|
| Test setup overhead | Provider wrapping | `jest.mock()` + reset | ✅ Functional |
| State isolation | Pure functions, no shared state | Lifecycle coupling, global mocks | ✅ Functional |
| Parallelization | Stateless tests run in parallel | Mock pollution risks race conditions | ✅ Functional |

**What we found:** Functional's pure functions and dependency injection produce tests that are inherently faster to set up and safer to parallelize. Imperative's reliance on module mocking introduces setup/teardown overhead that compounds across test suites.

#### Predictive (Does It Reflect Production?)

| Aspect | Functional | Imperative | Who Wins? |
|--------|------------|------------|-----------|
| Type safety | Compile-time flag validation | String literals fail silently | ✅ Functional |
| Consistency | Single `useFeatureFlag` pattern | Scattered `localStorage`, `window`, `env` | ✅ Functional |
| Mock fidelity | Providers mirror production DI | Module mocks diverge from runtime | ✅ Functional |

**What we found:** The imperative feature flag example (where each component checks flags differently) demonstrates how scattered implementations create false confidence. Tests pass, but production behavior varies by component. Functional's single source of truth means test mocks actually match production behavior.

#### Low Cost (Time, Money, Cognitive Load)

| Aspect | Functional | Imperative | Who Wins? |
|--------|------------|------------|-----------|
| Initial investment | 155 lines of infrastructure | ~0 | ❌ Imperative (short-term) |
| Marginal feature cost | +1 line for new flag | grep + manual updates | ✅ Functional (long-term) |
| Cognitive patterns | 4 consistent hooks | N patterns (grows with codebase) | ✅ Functional |
| Onboarding | Learn 4 hooks, apply everywhere | Learn codebase-specific conventions | ✅ Functional |

**What we found:** The crossover point (~4 feature commits in our study) determines alignment. For enterprise timescales (years, not weeks), functional's higher initial cost amortizes to lower total cost. The 4-hook pattern (`usePrimitives`, `useServices`, `useFeatureFlag`, `useEnvironment`) becomes institutional knowledge that transfers across teams.

#### Velocity-Enabling (Fail Fast, Document Domain)

| Aspect | Functional | Imperative | Who Wins? |
|--------|------------|------------|-----------|
| Domain documentation | Type interfaces are contracts | Comments drift from implementation | ✅ Functional |
| Failure detection | Compile errors on flag typos | Runtime `undefined` or silent fallback | ✅ Functional |
| Refactoring safety | Types enforce consistency | Find/replace + hope | ✅ Functional |
| Platform extension | Add `.native.tsx`, types guide impl | Architectural rewrite | ✅ Functional |

**What we found:** The `FeatureFlags` interface is executable documentation:

```typescript
interface FeatureFlags {
  enableFlaggedAddressExplanation: boolean  // Existence = documented
  enableNewFeature: boolean                  // Type = contract
}
```

Adding a flag documents it. Removing a flag produces compile errors at every usage. The domain is encoded in types that the compiler enforces.

> For the scorecard summary, "The Trap" narrative, and conclusions, see [Findings: Testing Alignment Scorecard](./mm-dx-findings.md#6-testing-alignment-scorecard) and [Findings: When to Use Which](./mm-dx-findings.md#when-to-use-which).

---

## Conclusions

> This evidence journal reports; it doesn't conclude. For the distilled findings, recommendations, and "when to use which" guidance, see [What We Learned](./mm-dx-findings.md).

---

## Appendix: Branch History

### mm-monad_05 (Current)
- Expanded adapter type surface: 23 new BoxProps, textAlign on TextProps
- Eliminated style escape hatches across 12 consumer files
- Replaced raw HTML elements in ConfigDialog sub-editors with adapter primitives
- Replaced hex colors with semantic tokens (components and entry point)
- Updated agents.md with expanded props and documented acceptable escape hatches
- Lesson learned: adapter surface width determines whether guidelines are enforceable or aspirational

### mm-monad_04
- AI agent guidelines (`agents.md`) for design system and adapter architecture
- Chart legend with descriptive labels for velocity comparison

### mm-monad_03
- Feature flags infrastructure
- Environment context for cross-platform mode detection
- Platform-specific flagged address explanation UI
- Runtime UI configuration system with long-press dialog (Task F)
- AsyncStorage persistence for native, localStorage for web
- Lesson learned: adapter bypass causes silent cross-platform regression

### mm-monad_02
- Code review mitigations for 100+ person team scale
- Unified validation system
- Service injection via context
- Automated token sync from MDS

### mm-monad_01
- Initial functional implementation
- Adapter system for cross-platform
- iOS simulator working

### mm-imperative_01
- Baseline imperative implementation
- Web-only, documented cross-platform challenges
