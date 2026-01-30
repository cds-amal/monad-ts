# DX Research: Imperative vs Monadic Design Systems

## Overview

This repository evaluates the developer experience (DX) of two architectural approaches for React applications:

1. **Imperative** - Traditional inline styles with direct CSS property manipulation
2. **Monadic** - Hexagonal architecture with semantic theming and composable style/validation monads

The goal is to measure real-world DX trade-offs when implementing the same features across both paradigms.

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

## Research Tasks

### Task 1: Add Storybook
**Objective**: Enable design team review of components

| Metric | Imperative | Monad |
|--------|------------|-------|
| Files changed | 10 | 10 |
| Lines added | ~2865 | ~2876 |
| Setup complexity | Low | Medium (decorator needed) |
| Testability | Components work directly | Can inject mock adapters |

**Key difference**: Monad requires `AdapterProvider` decorator in Storybook preview:
```tsx
decorators: [
  (Story) => (
    <AdapterProvider>
      <Story />
    </AdapterProvider>
  ),
]
```

**Observations**:
- Near-identical story files
- Monad's decorator is one-time setup cost
- Monad enables adapter mocking for isolated testing

---

### Task 2: Add Dark Mode
**Objective**: Implement light/dark theme toggle

| Metric | Imperative | Monad |
|--------|------------|-------|
| Files changed | 10 | 14 |
| Lines added | +224 | +504 |
| Lines removed | -68 | -283 |
| Net change | +156 | +221 |
| Component files touched | 6 | 4 (3 for hardcoded colors) |
| Architecture change | New context + hooks | Style adapter factory |

**Imperative approach** (`imperative_02`):
- Created `ThemeContext.tsx` with light/dark color mappings
- Created `ThemeToggle.tsx` component
- Updated 6 component files to replace hardcoded colors with `useColors()` hook:
  - `App.tsx`
  - `WalletButton.tsx`
  - `TokenList.tsx`
  - `TransferForm.tsx`
  - `TransferStatus.tsx`
  - `AddressSelect.tsx`

```tsx
// Before - hardcoded colors
const buttonStyle = { backgroundColor: '#3b82f6', color: '#111827' }

// After - color hook
const c = useColors()
const buttonStyle = { backgroundColor: c.primary, color: c.text }
```

**Monadic approach** (`monad_02`):
- Added semantic color tokens (`SemanticColors`) with light/dark variants to `tokens.ts`
- Converted `browserStyleAdapter` to factory function `createStyleAdapter(theme)`
- Added `ThemeContext` to `AdapterContext.tsx`
- Created `ThemeToggle.tsx` component
- Updated 4 files for stray hardcoded colors (TokenList, TransferStatus, AddressSelect, App)

```tsx
// Adapter factory creates theme-aware styles
const adapters = useMemo(() => ({
  style: createStyleAdapter(theme),
  web3: browserWeb3Adapter,
}), [theme])

// Components unchanged - still use semantic styles
<Box styles={style.button({ intent: 'primary' })} />
```

**Key Observations**:

1. **Initial investment pays off**: The monadic approach required more upfront work defining semantic color tokens, but components using `style.xxx()` methods needed no changes.

2. **Stray hardcoded colors**: Both approaches had components with inline hardcoded colors that needed updates. This reveals a DX insight: consistency in using the style system is crucial.

3. **Future-proofing**: Monad's adapter pattern allows adding new themes (high-contrast, colorblind-friendly) by only modifying `themeColors` - no component changes needed.

4. **Storybook integration**: Added theme toolbar to both - monad's `AdapterProvider` accepts `initialTheme` prop, making theme testing seamless.

5. **Lines of code**: Monad has more infrastructure (semantic tokens, factory pattern) but this is a one-time cost. Adding a third theme would require ~40 lines in monad vs potentially 100+ lines scattered across components in imperative.

**Verdict**: For dark mode specifically, monad provides better DX for ongoing maintenance despite higher initial implementation cost.

---

## Running the Comparison

```bash
# View imperative implementation
git checkout imperative_01
npm run storybook

# View monadic implementation
git checkout monad_01
npm run storybook

# Compare diffs
git diff master..imperative_01 --stat
git diff monad..monad_01 --stat
```

## Conclusions

*To be updated as tasks are completed*

### Preliminary Findings

1. **Setup**: Monad has higher initial cost but provides dependency injection out of the box
2. **Stories**: Nearly identical DX for writing component stories
3. **Testing**: Monad architecture naturally supports adapter mocking
4. **Theme changes**: Monad excels at centralized style changes (dark mode required no component changes for properly abstracted styles)
5. **Consistency matters**: Both approaches suffer when developers bypass the style system with hardcoded values

### DX Trade-off Summary

| Aspect | Imperative | Monad | Winner |
|--------|------------|-------|--------|
| Initial setup | Fast | Slower | Imperative |
| Learning curve | Low | Medium | Imperative |
| Adding features | Scattered changes | Localized changes | Monad |
| Theme changes | Touch all components | Touch adapter only | Monad |
| Testing/mocking | Manual setup | Built-in via DI | Monad |
| Debugging | Direct inspection | Abstraction layers | Imperative |
| Team scalability | Varies | Enforced patterns | Monad |

## Future Tasks

- [x] Dark mode implementation
- [ ] Mobile responsive layout
- [ ] Form validation feedback
- [ ] Loading states
- [ ] Error boundaries
- [ ] Accessibility improvements
