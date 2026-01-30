# DX Research: Imperative vs Monadic Design Systems

## Overview

This repository evaluates the developer experience (DX) of two architectural approaches for React applications:

1. **Imperative** - Traditional inline styles with direct CSS property manipulation
2. **Monadic** - Hexagonal architecture with semantic theming and composable style/validation monads

The goal is to measure real-world DX trade-offs when implementing the same features across both paradigms.

## Evaluation Dimensions

Each task is analyzed across three dimensions:

| Dimension | What We Measure |
|-----------|-----------------|
| **Code Changes** | Files modified, lines changed, nature of changes, blast radius |
| **Context Overhead** | Concepts to understand, mental model complexity, debugging path |
| **Benefits to Scale** | How approach handles team growth, codebase growth, feature additions |

## Hypothesis

A monadic system with hexagonal architecture provides:
- Better separation of concerns (structure vs style vs validation)
- Improved testability through adapter injection
- Easier theme/platform changes via port/adapter swapping
- More maintainable code at scale

At the cost of:
- Higher initial setup complexity
- Steeper learning curve
- More abstraction layers

## Test Application

A token transfer UI with:
- Wallet connection flow
- Token selection
- Address input with validation (EOA, contract, invalid, blacklisted, sanctioned)
- Transfer execution with status feedback

## Branch Structure

```
master              # Imperative baseline + this research doc
├── imperative_01   # Task 1 implemented imperatively
├── imperative_02   # Task 2 implemented imperatively
└── ...

monad               # Hexagonal architecture baseline
├── monad_01        # Task 1 implemented monadically
├── monad_02        # Task 2 implemented monadically
└── ...
```

## Architecture Comparison

### Imperative (master)

```
src/
├── components/     # UI with inline styles
├── services/       # Mock Web3
├── hooks/          # React hooks
└── types/          # TypeScript interfaces
```

Components contain style definitions directly:
```tsx
const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#3b82f6',
  // ... hardcoded values
}
```

### Monadic (monad branch)

```
src/
├── core/           # Pure domain logic (validation monad)
├── ports/          # Interface definitions
│   ├── style.ts    # StylePort - semantic → concrete
│   ├── render.ts   # RenderPort - layout primitives
│   └── web3.ts     # Web3Port - blockchain ops
├── adapters/
│   └── browser/    # Browser-specific implementations
├── context/        # DI container (AdapterProvider)
├── components/     # UI using adapters via hooks
└── hooks/
```

Components use semantic variants:
```tsx
const style = useStyle()
<Box styles={style.button({ intent: 'primary', size: 'md' })} />
```

---

## Research Tasks

### Task 1: Add Storybook
**Objective**: Enable design team review of components

#### Code Changes

| Metric | Imperative | Monad |
|--------|------------|-------|
| Files changed | 10 | 10 |
| Lines added | ~2865 | ~2876 |
| New config files | 4 | 4 |
| Story files | 5 | 5 |
| Blast radius | Config only | Config + decorator |

Both approaches required identical Storybook configuration. Story files are nearly identical.

**Monad-specific addition** - decorator in `preview.tsx`:
```tsx
decorators: [
  (Story) => (
    <AdapterProvider>
      <Story />
    </AdapterProvider>
  ),
]
```

#### Context Overhead

| Aspect | Imperative | Monad |
|--------|------------|-------|
| Concepts to understand | Storybook basics | Storybook + AdapterProvider |
| Why decorator needed | N/A | Components require context for `useStyle()` |
| Debug path | Direct - render component | Check adapter context → render |
| Onboarding time | ~30 min | ~45 min |

**Imperative**: Developer writes stories by importing components directly. No additional context needed. What you see is what you get.

**Monad**: Developer must understand that components consume adapters via React context. Without the decorator, `useStyle()` throws. This is a one-time learning cost but adds cognitive load for newcomers.

#### Benefits to Scale

| Scenario | Imperative | Monad |
|----------|------------|-------|
| 10 more stories | Linear effort | Linear effort |
| Testing with mock data | Manual setup per story | Inject mock adapters globally |
| Visual regression testing | Standard approach | Can test per-adapter variant |
| Design token audit | Grep through components | Single adapter file |

**At 5 components**: Nearly identical DX. Monad's decorator feels like unnecessary ceremony.

**At 50 components**: Monad's adapter injection enables systematic testing (e.g., render all components with a "high-contrast" adapter in one config change).

**At 200+ components**: Monad's enforced patterns prevent style drift across teams. New stories automatically inherit correct adapter setup.

---

### Task 2: Add Dark Mode
**Objective**: Implement light/dark theme toggle

#### Code Changes

| Metric | Imperative | Monad |
|--------|------------|-------|
| Files changed | 10 | 14 |
| Lines added | +224 | +504 |
| Lines removed | -68 | -283 |
| Net change | +156 | +221 |
| Component files touched | 6 | 4 |
| Infrastructure files | 2 | 6 |
| Blast radius | All styled components | Adapter layer + strays |

**Imperative file changes**:
```
New files:
  src/context/ThemeContext.tsx     (+95 lines) - color mappings + hooks
  src/components/ThemeToggle.tsx   (+25 lines)

Modified components (6 files, each requires):
  - Import useColors hook
  - Replace every hardcoded color with c.xxx

  App.tsx            - 3 color replacements
  WalletButton.tsx   - 8 color replacements
  TokenList.tsx      - 4 color replacements
  TransferForm.tsx   - 6 color replacements
  TransferStatus.tsx - 5 color replacements
  AddressSelect.tsx  - 12 color replacements

Total: 38 individual color value changes across 6 files
```

**Monad file changes**:
```
Infrastructure (one-time, centralized):
  src/adapters/browser/tokens.ts   (+70 lines) - semantic color tokens
  src/adapters/browser/style.ts    (refactored) - factory pattern
  src/context/AdapterContext.tsx   (+30 lines) - theme state
  src/ports/style.ts               (+1 line) - divider method

New files:
  src/components/ThemeToggle.tsx   (+16 lines)

Stray hardcoded colors (4 files):
  TokenList.tsx      - 3 refs
  TransferStatus.tsx - 1 ref
  AddressSelect.tsx  - 4 refs
  App.tsx            - 1 ref

Total: 9 color fixes in components (vs 38 in imperative)
```

#### Context Overhead

| Aspect | Imperative | Monad |
|--------|------------|-------|
| New concepts | `useColors()` hook, color key names | Semantic tokens, adapter factory, theme context |
| Mental model | "Get colors object, use properties" | "Adapter resolves intent to themed styles" |
| Where to find colors | `ThemeContext.tsx` | `tokens.ts` (defs) → `style.ts` (resolution) |
| Debugging theme issue | Check useColors return | Check theme → adapter → style method |
| Change propagation | Manual per-component | Automatic via adapter |

**Imperative mental model**:
```
Developer thinks: "I need the primary color for this button"
Developer does:
  1. Import useColors
  2. Call hook: const c = useColors()
  3. Use in style: backgroundColor: c.primary
Developer must remember: Import hook in every component that uses colors
```

**Monad mental model**:
```
Developer thinks: "I need a primary button"
Developer does:
  1. Call existing hook: const style = useStyle()
  2. Use semantic method: style.button({ intent: 'primary' })
Developer trusts: Adapter handles light/dark/any theme automatically
```

The monad approach front-loads cognitive investment but reduces ongoing mental burden. Once understood, developers stop thinking about colors entirely - they express intent.

#### Benefits to Scale

| Scenario | Imperative | Monad |
|----------|------------|-------|
| Add 3rd theme (high-contrast) | Touch 6+ component files | Add to `themeColors` object |
| Junior dev adds component | May forget useColors | Forced to use style methods |
| Design changes primary color | Find/replace across files | Single token change |
| A/B test different themes | Complex state management | Swap adapter at provider |
| Port to React Native | Rewrite all component styles | New adapter, same components |

**Scaling projections**:

| Team/Codebase Size | Imperative Impact | Monad Impact |
|--------------------|-------------------|--------------|
| 1-3 devs, 10 components | Faster, simpler | Overhead feels excessive |
| 5-10 devs, 50 components | Theme changes risky | Localized, predictable |
| 20+ devs, 200+ components | Style drift, inconsistency | Enforced patterns, single source of truth |

**Adding high-contrast theme later**:
- Imperative: Add color set to context, audit all 50+ components use correct semantic keys, fix any that used raw hex values
- Monad: Add `highContrast` entry to `themeColors`, adapter factory handles distribution automatically

**Cross-platform (React Native) port**:
- Imperative: Every component's styles must be rewritten for RN's StyleSheet API
- Monad: Create `nativeStyleAdapter` implementing same `StylePort`, components unchanged

#### Task 2 Verdict

| Dimension | Winner | Rationale |
|-----------|--------|-----------|
| Initial code changes | Imperative | Direct edits, less infrastructure |
| Ongoing code changes | Monad | Changes stay in adapter layer |
| Context overhead (learning) | Imperative | Simpler mental model |
| Context overhead (working) | Monad | Don't think about colors at all |
| Scale: small team | Tie | Both manageable |
| Scale: large team | Monad | Enforced patterns, no drift |
| Scale: multi-theme | Monad | Add theme without touching components |
| Scale: multi-platform | Monad | Adapter swapping |

---

## Running the Comparison

```bash
# View imperative implementation
git checkout imperative_02
npm run storybook

# View monadic implementation
git checkout monad_02
npm run storybook

# Compare diffs
git diff master..imperative_02 --stat
git diff monad..monad_02 --stat
```

---

## Conclusions

### Key Findings

1. **Setup cost vs maintenance cost**: Monad has ~30% higher initial implementation cost but significantly lower cost for subsequent changes.

2. **Blast radius**: Imperative changes ripple through all components. Monad changes are localized to adapter layer.

3. **Consistency enforcement**: Monad architecture makes it harder to bypass the style system. Imperative allows (and eventually accumulates) shortcuts.

4. **Context overhead crossover**: Around 30-50 components, monad's upfront learning investment starts paying dividends in reduced per-change cognitive load.

5. **The "stray colors" problem**: Both approaches suffer when developers bypass the style system. Monad's structure makes violations more visible and easier to fix.

### DX Trade-off Matrix

| Aspect | Imperative | Monad | Crossover Point |
|--------|------------|-------|-----------------|
| Initial setup | ✅ Fast | ❌ Slower | N/A |
| Learning curve | ✅ Low | ❌ Medium | N/A |
| Adding features | ⚠️ Scattered | ✅ Localized | ~20 components |
| Theme/style changes | ❌ Touch everything | ✅ Adapter only | ~10 components |
| Testing/mocking | ❌ Manual | ✅ Built-in DI | Immediate |
| Debugging | ✅ Direct | ⚠️ Indirection | Never (tradeoff) |
| Team scalability | ⚠️ Drift risk | ✅ Enforced patterns | ~5 developers |
| Multi-platform | ❌ Rewrite | ✅ New adapter | Immediate |

### Recommendations

**Choose Imperative when**:
- Prototyping or building MVPs
- Team is small (1-3 developers)
- Single platform target
- Limited theming requirements
- Speed to market is primary concern

**Choose Monad when**:
- Building for long-term maintenance
- Team will grow beyond 5 developers
- Multiple themes or platforms anticipated
- Design system consistency is critical
- Testing and accessibility are priorities

---

## Team Composition Analysis

### Design-Focused Teams

Teams where designers have significant input into implementation, or where design system fidelity is paramount.

#### Imperative Approach

| Aspect | Impact | Rating |
|--------|--------|--------|
| Design-to-code mapping | Direct - designers see exact CSS values | ✅ Excellent |
| Tweaking values | Easy - change hex code, see result | ✅ Excellent |
| Maintaining consistency | Hard - must manually audit all components | ❌ Poor |
| Design token updates | Tedious - find/replace across codebase | ❌ Poor |
| Handoff friction | Low - CSS is familiar | ✅ Good |

**Where design teams excel**:
- Quick visual iterations
- Pixel-perfect adjustments
- Direct manipulation of styles

**Where design teams struggle**:
- Ensuring consistency across 50+ components
- Updating design tokens without missing usages
- Preventing developers from using "close enough" colors

**Typical failure mode**: Designer updates brand colors in Figma. Developer must manually update every component. Some get missed. Colors drift over time.

#### Monadic Approach

| Aspect | Impact | Rating |
|--------|--------|--------|
| Design-to-code mapping | Indirect - semantic tokens abstracted | ⚠️ Learning curve |
| Tweaking values | Centralized - change token, propagates everywhere | ✅ Excellent |
| Maintaining consistency | Automatic - adapter enforces tokens | ✅ Excellent |
| Design token updates | Single location in `tokens.ts` | ✅ Excellent |
| Handoff friction | Higher - must learn semantic vocabulary | ⚠️ Moderate |

**Where design teams excel**:
- Global design token updates
- Theme variations (dark mode, high contrast)
- Auditing design system compliance
- A/B testing visual treatments

**Where design teams struggle**:
- Initial learning curve for semantic tokens
- Understanding adapter resolution
- Quick one-off style overrides

**Typical success mode**: Designer updates primary color in design system. Engineer changes one line in `tokens.ts`. All 200 components update automatically. Zero drift.

#### Design Team Verdict

| Team Profile | Recommended Approach |
|--------------|----------------------|
| Startup with designer-developer hybrids | Imperative |
| Agency doing client projects | Imperative |
| Product company with design system | Monad |
| Enterprise with brand guidelines | Monad |
| Design-led org (50+ designers) | Monad |

---

### Engineering-Focused Teams

Teams prioritizing code quality, testing, scalability, and maintainability.

#### Imperative Approach

| Aspect | Impact | Rating |
|--------|--------|--------|
| Code readability | Direct - styles inline with components | ✅ Good |
| Testing components | Manual mocking of styles | ⚠️ Moderate |
| Onboarding new devs | Fast - familiar patterns | ✅ Excellent |
| Refactoring safety | Low - styles scattered, easy to miss | ❌ Poor |
| Type safety | Limited - CSSProperties catch some errors | ⚠️ Moderate |
| Code review burden | High - must verify consistent color usage | ❌ Poor |

**Where engineering teams excel**:
- Rapid prototyping
- Quick bug fixes
- Understanding exactly what renders

**Where engineering teams struggle**:
- Enforcing style consistency in PRs
- Refactoring without visual regressions
- Testing component appearance systematically

**Typical failure mode**: Code review catches `#3b82f5` instead of `#3b82f6`. Or doesn't. Subtle inconsistencies accumulate. "Why is this button slightly different?" becomes common.

#### Monadic Approach

| Aspect | Impact | Rating |
|--------|--------|--------|
| Code readability | Abstract - must understand adapter layer | ⚠️ Learning curve |
| Testing components | Excellent - inject mock adapters | ✅ Excellent |
| Onboarding new devs | Slower - must learn architecture | ⚠️ Moderate |
| Refactoring safety | High - styles centralized, type-checked | ✅ Excellent |
| Type safety | Strong - `intent: 'primary'` vs raw strings | ✅ Excellent |
| Code review burden | Low - semantic intent obvious | ✅ Excellent |

**Where engineering teams excel**:
- Systematic testing (render with different adapters)
- Safe refactoring (change adapter, not components)
- Enforcing patterns through types
- Code reviews focus on logic, not style values

**Where engineering teams struggle**:
- Initial architecture setup
- Debugging through abstraction layers
- Explaining pattern to new team members

**Typical success mode**: New hire sees `style.button({ intent: 'primary' })`, understands intent without knowing hex values. PR review focuses on "is this the right intent?" not "is this the right shade of blue?".

#### Engineering Team Verdict

| Team Profile | Recommended Approach |
|--------------|----------------------|
| Solo developer | Imperative |
| Early-stage startup (move fast) | Imperative |
| Growth-stage (10-50 engineers) | Monad |
| Enterprise (100+ engineers) | Monad |
| Platform team building for others | Monad |
| Team with junior developers | Monad (guardrails help) |

---

### Cross-Functional Team Dynamics

#### Imperative: Designer-Developer Collaboration

```
Designer: "Change the button color to #2563eb"
Developer: Opens 6 files, changes color
Designer: "Actually, make it #1d4ed8"
Developer: Opens 6 files again
Designer: "Can we A/B test both?"
Developer: "That's... complicated"
```

**Friction points**:
- Every design change requires code changes in multiple files
- A/B testing requires conditional logic in components
- Design tokens exist in Figma but not enforced in code

#### Monad: Designer-Developer Collaboration

```
Designer: "Change the button color to #2563eb"
Developer: Changes one line in tokens.ts
Designer: "Actually, make it #1d4ed8"
Developer: Changes the same line
Designer: "Can we A/B test both?"
Developer: "Sure, I'll create two adapter variants"
```

**Collaboration benefits**:
- Design token changes are single-line updates
- A/B testing is adapter swapping at provider level
- Semantic vocabulary bridges design and code

**Collaboration costs**:
- Designer must learn semantic token names
- "Make this 2px bigger" requires understanding which style method to modify

---

### Organizational Recommendations

| Organization Type | Team Structure | Recommendation |
|-------------------|----------------|----------------|
| Startup (<10 people) | Generalists | Imperative |
| Scale-up (10-50) | Emerging specialization | Start Monad migration |
| Growth (50-200) | Dedicated design system team | Monad |
| Enterprise (200+) | Multiple product teams | Monad (required for consistency) |
| Agency | Project-based teams | Imperative (speed) or Monad (reusable system) |
| Open source library | External contributors | Monad (enforced patterns) |

---

## Future Tasks

- [x] Add Storybook
- [x] Dark mode implementation
- [ ] Mobile responsive layout
- [ ] Form validation feedback
- [ ] Loading states
- [ ] Error boundaries
- [ ] Accessibility improvements (focus states, ARIA)
- [ ] Animation system
