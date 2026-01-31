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

### Baseline Components
- `Box` - Layout primitive with semantic props (`backgroundColor`, `padding`, `gap`)
- `Text` - Typography with variants (`HeadingLg`, `BodyMd`, etc.)
- `Button` - Interactive element with variants and states
- `asChild` prop - Enables semantic HTML while using DS styling

### Baseline Files
```
src/
  App.tsx
  components/
    AddressSelect.tsx
    TokenList.tsx
    TransferForm.tsx
    TransferStatus.tsx
    WalletButton.tsx
  fonts.css
  index.css
tailwind.config.js
postcss.config.js
public/fonts/
```

---

## Comparison Branches

| Branch | Approach | Description |
|--------|----------|-------------|
| `mm-imperative_01` | Direct DS usage | Components use MetaMask DS directly, platform-specific code inline |
| `mm-monad_01` | Adapter pattern | DS wrapped in adapters, platform logic abstracted |

---

## Task 1: [TBD]

*Research tasks will be documented here as they are completed.*

---

## Metrics Template

For each task, we'll measure:

| Metric | mm-imperative | mm-monad |
|--------|---------------|----------|
| Files changed | | |
| Lines added | | |
| Lines removed | | |
| New abstractions | | |
| Component changes | | |
| Cross-platform ready | | |

---

## Key Questions

1. **Does the DS itself provide enough abstraction?** Or do we need additional layers?
2. **How do imperative overrides affect maintainability?** (inline styles, className)
3. **What's the cost/benefit of wrapping DS in adapters?**
4. **How does each approach handle platform-specific needs?**
