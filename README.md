# Token Transfer App

React TypeScript app for evaluating monadic design system patterns with hexagonal architecture.

## Setup

```bash
npm install
npm run dev
```

## Architecture

Hexagonal (ports & adapters) architecture separating core domain from platform specifics.

```
┌─────────────────────────────────────────┐
│              Core Domain                │
│  - Validation logic (Result monad)      │
│  - Business rules (pure functions)      │
└─────────────────────────────────────────┘
                   │
          ┌───────▼───────┐
          │     Ports     │
          │  (interfaces) │
          │ StylePort     │
          │ RenderPort    │
          │ Web3Port      │
          └───────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼                             ▼
┌─────────┐               ┌─────────────┐
│ Browser │               │   Mobile    │
│ Adapter │               │   Adapter   │
│ (CSS)   │               │   (future)  │
└─────────┘               └─────────────┘
```

## Structure

```
src/
├── core/           # Pure domain logic, no platform deps
│   └── validation  # Result monad, validators
├── ports/          # Interface definitions
│   ├── style       # StylePort - semantic → concrete
│   ├── render      # RenderPort - layout primitives
│   └── web3        # Web3Port - blockchain ops
├── adapters/
│   └── browser/    # Browser-specific implementations
│       ├── style   # CSS style adapter
│       ├── render  # React DOM components
│       └── web3    # Mock Web3 (or ethers/viem)
├── context/        # DI container (AdapterProvider)
├── components/     # UI components (use adapters via hooks)
└── hooks/          # React hooks
```

## Key Concepts

### Ports (Interfaces)
- **StylePort**: Components use semantic variants (`intent: 'primary'`, `size: 'md'`), adapters resolve to platform styles
- **Web3Port**: Wallet, token, transfer operations - mockable for testing
- **RenderPort**: Layout primitives (Box, Stack, Flex) - could target DOM or React Native

### Adapters (Implementations)
- **browserStyleAdapter**: Resolves semantic styles to CSS
- **browserWeb3Adapter**: Mock implementation with test accounts
- **Browser render components**: React DOM with CSS-in-JS

### Theme-Driven Styling
Components use semantic props, theme resolves to actual styles:
```tsx
// Component uses semantic intent
<Box styles={style.button({ intent: 'primary', size: 'md' })} />

// Adapter resolves to CSS
{ backgroundColor: '#3b82f6', padding: '8px 16px', ... }
```

## Mock Accounts

Test addresses for validation scenarios:

| Type | Description |
|------|-------------|
| EOA | Valid wallet addresses |
| Contract | Token contracts, DEX routers |
| Invalid | Bad checksum, wrong length |
| Blacklisted | Flagged addresses |
| Sanctioned | OFAC sanctioned addresses |

## Branches

- `master` - Imperative styling baseline
- `monad` - Hexagonal architecture with semantic theming

## Roadmap

1. ~~Imperative styling baseline~~ (master)
2. ~~Hexagonal architecture with semantic theming~~ (monad)
3. Comparative tasks: implement same feature on both branches
   - Example: `master` → `imperative_01` vs `monad` → `monad_01`
