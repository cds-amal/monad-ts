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

### Task 2: [Next task]
*To be completed*

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

## Future Tasks

- [ ] Dark mode implementation
- [ ] Mobile responsive layout
- [ ] Form validation feedback
- [ ] Loading states
- [ ] Error boundaries
- [ ] Accessibility improvements
