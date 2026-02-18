# Token Transfer App

React TypeScript app for evaluating monadic design system patterns. Uses mock Web3 for demonstration.

## Setup

```bash
pnpm install
pnpm dev
```

## Structure

- `src/components/` - UI components (WalletButton, TokenList, TransferForm, AddressSelect)
- `src/services/` - Mock Web3 and accounts services
- `src/hooks/` - React hooks (useWallet)
- `src/types/` - TypeScript interfaces

## Mock Accounts

The app includes test addresses for validation scenarios:

| Type | Description |
|------|-------------|
| EOA | Valid wallet addresses |
| Contract | Token contracts, DEX routers |
| Invalid | Bad checksum, wrong length |
| Blacklisted | Flagged addresses |
| Sanctioned | OFAC sanctioned addresses |

## Roadmap

1. ~~Imperative styling baseline~~ (current)
2. Convert to monadic design system
