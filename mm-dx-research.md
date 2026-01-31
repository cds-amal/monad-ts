# DX Research: MetaMask Design System Approaches

This document tracks developer experience findings comparing imperative vs monadic patterns **on top of the MetaMask Design System baseline**.

---

## Baseline: MetaMask Design System

All comparison branches share this foundation:

| Package | Purpose |
|---------|---------|
| `@metamask/design-system-react` | Component library (Box, Text, Button, etc.) |
| `@metamask/design-system-tailwind-preset` | Tailwind theme configuration |
| `@metamask/design-tokens` | Design tokens (colors, typography, spacing) |

### What MDS Provides
- `Box` - Layout primitive with semantic props (`backgroundColor`, `padding`, `gap`)
- `Text` - Typography with variants (`HeadingLg`, `BodyMd`, etc.)
- `Button` - Interactive element with variants and states
- `ButtonIcon` - Icon-only buttons
- `Avatars` - Account, Network, Token, Favicon variants
- `Badges` - Status, Count, Icon, Network variants
- `Checkbox` - Boolean input
- `asChild` prop - Enables semantic HTML while using DS styling

### What MDS Lacks
- **Input** - No text input component
- **Select/Dropdown** - No dropdown component
- **Modal/Dialog** - No overlay components
- **Form utilities** - No form state management

### Dark Mode Support
MDS includes light/dark tokens via CSS variables:
- `:root, [data-theme=light]` - Light theme
- `[data-theme=dark]` - Dark theme

---

## Comparison Branches

| Branch | Approach | Description |
|--------|----------|-------------|
| `mm-imperative_01` | Direct DS usage | Components use MetaMask DS directly, platform-specific code inline |
| `mm-monad_01` | Adapter pattern | DS wrapped in adapters, platform logic abstracted |

---

## Task A: Create Input Component

Build a reusable Input component (MDS doesn't provide one).

### Results

| Metric | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| Input.tsx LOC | 147 | 76 |
| New files | 1 | 1 |
| Validation approach | Composable `ValidationResult.chain()` | Inline `getAmountError()` function |
| Reusability | Validators are reusable building blocks | Validation tied to component |

### Code Comparison

**mm-monad_01** - Composable validation:
```tsx
// Validators can be combined
const amountValidator = ValidationResult.chain(
  Validators.numeric('Enter a valid amount'),
  Validators.positive('Amount must be greater than 0'),
  (value) => parseFloat(value) <= maxBalance
    ? ValidationResult.ok()
    : ValidationResult.err(`Exceeds balance`)
)

<Input validate={amountValidator} />
```

**mm-imperative_01** - Inline validation:
```tsx
const getAmountError = (): string | undefined => {
  if (!amountTouched || !amount) return undefined
  const num = parseFloat(amount)
  if (isNaN(num)) return 'Enter a valid amount'
  if (num <= 0) return 'Amount must be greater than 0'
  if (token && num > parseFloat(token.balance)) {
    return `Exceeds balance of ${token.balance} ${token.symbol}`
  }
  return undefined
}

<Input error={amountError} onBlur={() => setAmountTouched(true)} />
```

### Finding
Monad approach creates testable, composable validation primitives that can be reused across forms. Imperative is simpler initially but validation logic is duplicated.

---

## Task B: Refactor AddressSelect

Simplify the most complex component (133 lines, dropdown + TYPE_COLORS mapping).

### Results

| Metric | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| AddressSelect LOC | 65 (was 133) | 108 (was 133) |
| New files | 3 | 1 |
| Reusable primitives | Dropdown, groupBy, style functors | AccountBadge only |

### New Files

**mm-monad_01:**
- `src/components/Dropdown.tsx` - Generic dropdown primitive with `Dropdown.Group` and `Dropdown.Item`
- `src/components/AccountBadge.tsx` - Badge using style functor
- `src/styles/accountStyles.ts` - Pure functions: `accountTypeStyle`, `accountTypeLabel`, `groupBy`

**mm-imperative_01:**
- `src/components/AccountBadge.tsx` - Badge with inline TYPE_COLORS

### Finding
Monad approach creates generic Dropdown primitive reusable for any dropdown (token select, network select, etc.). Imperative extracts component but keeps dropdown logic inline in AddressSelect.

---

## Task C: Add Dark Mode

MDS has light/dark tokens via `[data-theme]` attribute.

### Results

| Metric | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| Hook LOC | 85 | 23 |
| Pure functions | ThemeOps module | Inline in hook |
| System preference | Reactive listener | Init only |
| Preference types | light/dark/system | light/dark |

### Code Comparison

**mm-monad_01** - Separated pure operations:
```tsx
// Pure functions (testable)
export const ThemeOps = {
  getSystemTheme: (): Theme => ...,
  resolve: (preference: ThemePreference): Theme => ...,
  toggle: (current: Theme): Theme => ...,
  save: (preference: ThemePreference): void => ...,
  load: (): ThemePreference => ...,
  apply: (theme: Theme): void => ...,
}

// Hook composes operations
export function useTheme() {
  // ... uses ThemeOps
}
```

**mm-imperative_01** - All inline:
```tsx
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(current => current === 'light' ? 'dark' : 'light')

  return { theme, toggle, isDark: theme === 'dark' }
}
```

### Finding
Monad separates pure theme operations from effects, making them unit testable. More code but each function is isolated. Imperative is concise but logic is coupled.

---

## Task D: Cross-Platform (React Native)

### Results

| Metric | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| Deliverable | Working iOS simulator app | Documentation only |
| New files | 8 | 1 (CROSS_PLATFORM.md) |
| Lines added | ~400 | 120 |
| Architecture change | None needed | Would require new abstraction layer |

### mm-monad_01 Adapter System

```
src/adapters/
  index.ts           # Re-exports
  platform.ts        # Platform detection
  types.ts           # UIAdapter interface
  AdapterContext.tsx # React context + hooks
  web.tsx            # Web adapter (wraps MDS)
  native.tsx         # Native adapter (uses MDS tokens)
src/main.native.tsx  # React Native entry point
app.json             # Expo configuration
```

**Usage:**
```tsx
import { useAdapter } from './adapters'

function MyComponent() {
  const { Box, Text, Pressable } = useAdapter()
  // Components resolve to platform-appropriate implementations
}
```

### mm-imperative_01 Challenges (from CROSS_PLATFORM.md)

1. **DOM Elements** - Would need View/Text/Pressable wrappers
2. **Tailwind Classes** - Would need StyleSheet conversion
3. **MDS Components** - Web-only, needs abstraction
4. **Event Handlers** - onClick→onPress, onChange→onChangeText
5. **Platform APIs** - localStorage→AsyncStorage, matchMedia→Appearance

**Conclusion:** Imperative approach would need to adopt adapter patterns (similar to monad) to support React Native.

### iOS Implementation: Root Causes & Fixes

Getting the mm-monad_01 adapter system working on iOS required solving several technical challenges:

#### 1. React Version Mismatch
**Problem:** React Native 0.81 requires React 19, but project had React 18.
**Symptom:** `Cannot read property 'S' of undefined` during module load.
**Fix:** Upgrade to React 19 (`pnpm add react@19 react-dom@19`).

#### 2. Node.js Polyfills for React Native
**Problem:** MDS dependency chain pulls in Node.js modules (`crypto`, `buffer`, `stream`).
**Root cause:** `@metamask/design-system-react` → `@metamask/utils` → `ethereum-cryptography` → `@noble/hashes`.
**Fix:** Metro config with polyfills:
```javascript
config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process'),
  // Stub unused modules
  fs: require.resolve('empty-module'),
  // ...
}
```

#### 3. WebCrypto Polyfill
**Problem:** `@noble/hashes` requires `globalThis.crypto.getRandomValues`.
**Fix:** Import `react-native-get-random-values` as first import in entry point.

#### 4. Platform-Specific Files
**Problem:** Web adapter imports MDS which has crypto deps; can't bundle in native.
**Fix:** Platform-specific file extensions:
```
AdapterContext.tsx        # Web version (imports webAdapter)
AdapterContext.native.tsx # Native version (imports nativeAdapter only)
index.ts                  # Web exports
index.native.ts           # Native exports
```

#### 5. localStorage Not Available
**Problem:** `useTheme` hook used `localStorage` which doesn't exist in RN.
**Fix:** ThemeContext with React state instead of browser APIs.

#### 6. iOS Safe Area
**Problem:** Content overlapped with notch/status bar.
**Fix:** Wrap app in `SafeAreaView`.

#### 7. Dark Mode Not Updating
**Problem:** Native adapter read theme from `Appearance.getColorScheme()` at render time.
**Fix:** ThemeContext provides theme state; components re-render on context change.

### Key Architectural Insight

The MDS dependency chain creates a "layering violation" where UI packages depend on protocol/crypto code:
```
@metamask/design-system-react
  → @metamask/utils (has address checksum functions)
    → ethereum-cryptography
      → @noble/hashes (requires WebCrypto)
```

This forces React Native apps to ship crypto polyfills they'll never execute. The monad/adapter approach isolates this by:
1. Hardcoding MDS color tokens in native adapter (avoids importing `@metamask/design-tokens`)
2. Using platform-specific files to prevent web adapter from being bundled in native

---

## Team Velocity Impact

### Engineering Team Velocity

| Factor | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| **Time to first feature** | Slower (abstractions upfront) | Faster (direct implementation) |
| **Time to add similar feature** | Faster (reuse primitives) | Same (duplicate patterns) |
| **Onboarding new devs** | Steeper curve (learn patterns) | Easier (familiar React) |
| **Code review speed** | Faster (isolated units) | Slower (larger PRs) |
| **Debugging time** | Easier (pure functions) | Harder (stateful logic) |
| **Cross-team handoffs** | Smoother (clear contracts) | Friction (implicit assumptions) |

The velocity difference is most visible in Task D: monad delivered a working cross-platform adapter system while imperative produced documentation only.

### Design Team Velocity

| Factor | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| **Component consistency** | High (primitives enforce patterns) | Medium (varies by developer) |
| **Design token usage** | Centralized via adapters | Scattered inline references |
| **Theme implementation** | Pure operations, easily verified | Coupled to React lifecycle |
| **New variant creation** | Add to style functors | Copy-paste existing styles |
| **Design system updates** | Single adapter change | Hunt for all usages |

### Velocity Trade-offs

**mm-monad_01 velocity pattern:**
- Day 1-5: Slower (building primitives)
- Day 5-15: Matching velocity (using primitives)
- Day 15+: Faster velocity (compounding reuse)

**mm-imperative_01 velocity pattern:**
- Day 1-5: Faster (shipping directly)
- Day 5-15: Matching velocity (some duplication)
- Day 15+: Slower velocity (tech debt accumulates)

### Time to Working Implementation

| Task | mm-monad_01 | mm-imperative_01 |
|------|-------------|------------------|
| A: Input | Working | Working |
| B: AddressSelect | Working + reusable Dropdown | Working |
| C: Dark Mode | Working + system preference | Working |
| D: Cross-Platform | **Tested on iOS simulator** | **Cannot achieve without rewrite** |

The cross-platform task demonstrates the velocity cliff: imperative approach hits a wall requiring architectural rewrite, while monadic approach extends naturally with MDS token integration.

---

## Summary: Key Questions Answered

### 1. Does the DS itself provide enough abstraction?
**No.** MDS is web-only and lacks Input, Select, Modal. Both approaches needed to fill gaps, but monad created reusable primitives while imperative created one-off solutions.

### 2. How do imperative overrides affect maintainability?
Inline `className` strings work fine for simple cases, but as complexity grows (AddressSelect), the lack of abstraction leads to larger, harder-to-test components.

### 3. What's the cost/benefit of wrapping DS in adapters?
- **Cost:** More initial code (adapter system = 324 LOC)
- **Benefit:** Cross-platform support, testability, swappable implementations

### 4. How does each approach handle platform-specific needs?
- **Monad:** Platform detection + adapter swap. Components unchanged.
- **Imperative:** Would require architectural rewrite to support new platforms.

---

## Final Metrics

| Task | mm-monad_01 | mm-imperative_01 |
|------|-------------|------------------|
| A: Input | 147 LOC | 76 LOC |
| B: AddressSelect | 65 LOC + 3 files | 108 LOC + 1 file |
| C: Dark Mode | 52 LOC (ThemeContext) | 23 LOC |
| D: Cross-Platform | ~600 LOC (iOS working) | 120 LOC (docs only) |
| **Total new code** | ~864 LOC | ~327 LOC |

### Files Added for Cross-Platform (mm-monad_01)
| File | Purpose |
|------|---------|
| `src/adapters/AdapterContext.native.tsx` | Native-specific context (avoids web imports) |
| `src/adapters/index.native.ts` | Native-specific exports |
| `src/main.native.tsx` | React Native entry point with polyfills |
| `src/theme/useTheme.tsx` | ThemeContext for cross-platform theming |
| `metro.config.js` | Metro bundler configuration |
| `app.json` | Expo configuration |
| `shims/globals.js` | Buffer/process polyfills |
| `shims/noble-hashes.js` | Crypto stub (unused in UI) |

### When to Use Each

**Monad approach wins when:**
- Cross-platform support needed
- Extensive unit testing required
- Building reusable component libraries
- Long-term maintainability is priority
- Team is comfortable with functional patterns

**Imperative approach wins when:**
- Web-only application
- Rapid prototyping / MVP
- Smaller team / solo developer
- Simpler requirements
- Faster time-to-first-feature

---

## Branch Commits

### mm-monad_01
| Commit | Description |
|--------|-------------|
| `28afbed` | Add Input component with composable validation monad |
| `a7a11a7` | Refactor AddressSelect with composable Dropdown and style functor |
| `50f5040` | Add dark mode with functional theme operations |
| `225a646` | Add cross-platform adapter system for React Native support |
| `4b6be04` | Fix iOS: React 19, polyfills, ThemeContext, SafeAreaView |

### mm-monad_02
| Commit | Description |
|--------|-------------|
| `ae200b0` | Fix iOS simulator: React 19, Node polyfills, ThemeContext |
| `fe9345f` | Mitigate code review findings (Phase 1-4) |

### mm-imperative_01
| Commit | Description |
|--------|-------------|
| `97f81c9` | Add Input component with inline validation |
| `efef499` | Refactor AddressSelect: extract AccountBadge and utilities |
| `80fd6e6` | Add dark mode with simple useTheme hook |
| `ceb4886` | Document cross-platform challenges and required abstractions |

---

## Code Review: Scaling for 100+ Person Team

The following section documents findings from a code review of `mm-monad_01` focusing on architectural issues that would create friction at scale with a 100+ person engineering team.

### Executive Summary

The codebase demonstrates solid engineering fundamentals—strong typing, functional patterns, and a well-conceived adapter abstraction. However, several architectural decisions would create friction at scale.

---

### High Impact Issues Identified

#### 1. Design Token Duplication

**Problem:** MDS design tokens were hardcoded in `native.tsx` because importing `@metamask/design-tokens` brings crypto dependencies:

```typescript
// 25+ hardcoded values that can drift from MDS updates
const lightTheme = {
  colors: {
    text: { default: '#121314', alternative: '#686e7d', muted: '#b7bbc8' },
    // ...
  }
}
```

**Impact:** Two sources of truth. When MetaMask updates their design system, web gets it automatically via MDS components, but native falls out of sync.

#### 2. Validation System Split

**Problem:** Two validation systems coexisted:
- `ValidationResult` monad in `Input.tsx` (excellent composable pattern)
- `validateAddress()` in `mockAccounts.ts` returning `{ valid: boolean; error?: string }`

These weren't compatible, forcing manual bridging in components.

#### 3. Service Coupling

**Problem:** Components directly imported service implementations:
```typescript
import { web3Service } from '../services/mockWeb3'
import { validateAddress, getAccountByAddress } from '../services/mockAccounts'
```

This creates testing friction, prevents team parallelization, and makes it impossible to swap implementations per environment.

#### 4. Code Duplication

- `formatAddress` duplicated in `mockWeb3.ts` and `accountStyles.ts` with different implementations
- Pressed state handling repeated in Pressable, Button, and IconButton
- Color mapping functions structurally identical

#### 5. Silent Context Fallback

`useTheme()` silently returned a default when `ThemeProvider` was missing, hiding bugs in development.

---

### Mitigations Implemented (mm-monad_02)

#### Phase 1: Unified Validation System

Created `src/validation/` module with:
- `index.ts` - Shared `ValidationResult` monad and `Validators`
- `addressValidation.ts` - Address validation returning `AddressValidationResult` (extends `ValidationResult`)

All consumers now import from a single source:
```typescript
import { ValidationResult, Validators } from '../validation'
import { validateAddress } from '../validation/addressValidation'
```

**Files changed:** 6 | **New files:** 2

#### Phase 2: Service Injection via Context

Created dependency injection system:
- `src/services/types.ts` - `Services` interface definition
- `src/services/ServicesContext.tsx` - `ServicesProvider` and `useServices()` hook
- `src/services/defaultServices.ts` - Default implementation

Components now consume services via context:
```typescript
const { transfer, validateAddress, formatAddress } = useServices()
```

**Benefits:**
- Components are testable with mock services
- Teams can work independently on UI vs service layers
- Can swap implementations per environment

**Files changed:** 8 | **New files:** 3

#### Phase 3: Automated Token Sync

Created build-time token extraction:
- `scripts/extract-tokens.js` - Reads from `@metamask/design-tokens` at build time
- `src/adapters/tokens.native.ts` - Generated token file with `ThemeTokens` interface

Package.json scripts updated:
```json
{
  "prebuild": "node scripts/extract-tokens.js",
  "build": "pnpm prebuild && tsc -b && vite build",
  "native": "pnpm prebuild && expo start"
}
```

**Benefits:**
- Single source of truth for design tokens
- Native tokens stay in sync with MDS updates
- No runtime crypto dependency issues

**Files changed:** 3 | **New files:** 2

#### Phase 4: Quick Fixes

1. **Fixed silent context fallback** - Now throws in `__DEV__`, warns in production
2. **Removed `formatAddress` duplication** - Single source in `accountStyles.ts`
3. **Removed backwards compatibility shim** - Deleted unused `toggle` export
4. **Extracted `usePressedState` hook** - Reusable pressed state management
5. **Created `createColorMapper` utility** - Generic factory for color mapping functions

**Files changed:** 4

---

### Severity Summary

| Issue | Severity | Status |
|-------|----------|--------|
| Design token duplication | High | ✅ Fixed (Phase 3) |
| Validation system split | High | ✅ Fixed (Phase 1) |
| Service coupling | High | ✅ Fixed (Phase 2) |
| formatAddress duplication | Low | ✅ Fixed (Phase 4) |
| Pressed state duplication | Low | ✅ Fixed (Phase 4) |
| Silent context fallback | Medium | ✅ Fixed (Phase 4) |
| `as never` casts | Medium | Deferred |
| Dropdown positioning | Medium | Deferred |
| Missing tests | High | Deferred |

---

### Deferred Items (Higher Effort)

1. **Test infrastructure** - Add vitest/jest, set up component testing
2. **Dropdown collision detection** - Portal-based solution for viewport boundaries
3. **Fix `as never` casts** - Requires adapter type alignment with MDS
4. **Adapter code generation** - Generate mapping tables from schema

---

### Architecture After Mitigations

```
src/
├── validation/              # Unified validation system
│   ├── index.ts            # ValidationResult monad + Validators
│   └── addressValidation.ts # Address-specific validation
├── services/
│   ├── types.ts            # Services interface
│   ├── ServicesContext.tsx # DI container
│   ├── defaultServices.ts  # Default implementation
│   ├── mockWeb3.ts         # Web3 mock (no formatAddress)
│   └── mockAccounts.ts     # Account data (no validateAddress)
├── adapters/
│   ├── tokens.native.ts    # Generated from MDS (prebuild)
│   └── native.tsx          # Uses generated tokens
└── theme/
    └── useTheme.tsx        # Throws in dev, warns in prod
scripts/
└── extract-tokens.js       # Token extraction script
```

This structure supports:
- **Team parallelization** - UI, services, and validation can evolve independently
- **Testing** - Services mockable, validation composable, pure functions isolated
- **Design sync** - Tokens auto-generated from MDS at build time
- **Debugging** - Errors surface immediately in development
