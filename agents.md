# AI Agent Guidelines: Token Transfer App

> This document is written for AI coding assistants (Claude Code, Cursor, GitHub Copilot, etc.). It tells you how to generate code that follows the architecture and design system patterns established in this codebase. If you're generating UI code for this project, read this first.

## The One Rule

**Express intent, not implementation.**

Every component in this codebase uses semantic primitives from an adapter layer. You never write raw HTML elements, inline styles, or arbitrary color values. Instead, you describe *what* you want (a primary button, a muted background, body-sized text) and let the adapter + design system handle the *how*.

---

## Quick Rules (Non-Negotiable)

Before generating any code, internalize these:

| Rule | Why |
|------|-----|
| **No `<div>`, `<button>`, `<span>`, `<p>`, `<h1>`** | Use `Box`, `Button`, `Text`, `Pressable` from `usePrimitives()` |
| **No inline styles** (`style={{ ... }}`) | Use semantic props: `backgroundColor="muted"`, `padding={4}`, `variant="primary"` |
| **No hex colors** (`#3b82f6`, `#ef4444`) | Use semantic color names: `"primary"`, `"error"`, `"success"`, `"muted"` |
| **No magic pixel values** (`17px`, `13px`) | Use the spacing scale: `1`, `2`, `3`, `4`, `6`, `8`, `10`, `12` |
| **No `web3Service.method()` direct imports** | Use `useServices()` hook for all service access |
| **No platform conditionals** (`if (Platform.OS === 'web')`) | Use `.native.tsx` / `.tsx` file pairs; Metro and Vite resolve the right one |

---

## Architecture at a Glance

### Provider Stack

Every component lives inside this provider hierarchy (outermost to innermost):

```
EnvironmentProvider > ThemeProvider > FeatureFlagsProvider > ServicesProvider > AdapterProvider > [Your Component]
```

### The Adapter Pattern

Components never import from `@metamask/design-system-react` or `react-native` directly. They import from the adapter layer:

```tsx
import { usePrimitives } from '../adapters'

function MyComponent() {
  const { Box, Text, Button, Pressable, TextInput } = usePrimitives()
  // ... use these primitives for all UI
}
```

The adapter maps semantic props to platform-specific implementations:
- **Web**: `Box` renders MetaMask DS `<MDSBox>`, `Button` renders `<MDSButton>`, etc.
- **Native**: `Box` renders React Native `<View>`, `Button` renders a styled `<Pressable>`, etc.

This is why it works on both web and iOS without platform conditionals in component code.

### Available Primitives

| Primitive | Replaces | Key Props |
|-----------|----------|-----------|
| `Box` | `<div>` | `flexDirection`, `gap`, `padding`, `backgroundColor`, `borderColor`, `borderRadius`, `alignItems`, `justifyContent` |
| `Text` | `<span>`, `<p>`, `<h1>` | `variant` (`headingLg`, `bodyMd`, `bodySm`, etc.), `color`, `fontWeight`, `fontFamily` |
| `Button` | `<button>` | `variant` (`primary`, `secondary`, `danger`), `size` (`sm`, `md`, `lg`), `onPress`, `loading`, `loadingText`, `disabled` |
| `Pressable` | `<div onClick>` | `onPress`, `disabled` |
| `TextInput` | `<input>` | `value`, `onChangeText`, `placeholder`, `type`, `hasError` |
| `IconButton` | icon + button combo | `icon`, `size`, `onPress`, `label` (accessibility) |

### Context Hooks

| Hook | What It Provides |
|------|-----------------|
| `usePrimitives()` | All UI primitives (`Box`, `Text`, `Button`, `Pressable`, `TextInput`, `IconButton`) |
| `useServices()` | Business logic: `transfer()`, `validateAddress()`, `getAccountByAddress()`, `formatAddress()` |
| `useTheme()` | Theme state and toggle: `theme`, `toggleTheme()` |
| `useFeatureFlag(name)` | Boolean feature flag value |
| `useEnvironment()` | `platform` (`web` or `native`), `mode` (`development` or `production`) |

---

## Transformations: What You Generate vs What We Want

These are real components from this codebase showing the before (master branch, imperative) and after (monad branches, adapter-based).

### WalletButton

**What AI typically generates (wrong):**

```tsx
// src/components/WalletButton.tsx on master branch
// Every line here is an anti-pattern

import { web3Service } from '../services/mockWeb3'  // direct service import

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',          // magic pixels
    backgroundColor: wallet ? '#ef4444' : '#3b82f6',  // raw hex colors
    color: 'white',                // raw color
    borderRadius: '8px',           // magic pixels
    cursor: loading ? 'wait' : 'pointer',  // imperative cursor logic
  }

  return (
    <button                        // native HTML element
      style={buttonStyle}          // inline styles
      onClick={onDisconnect}       // onClick instead of onPress
    >
      {loading ? 'Disconnecting...' : 'Disconnect'}  // manual loading state
    </button>
  )
}
```

**What you should generate (correct):**

```tsx
import { usePrimitives } from '../adapters'
import { useServices } from '../services/ServicesContext'

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const { Box, Text, Button } = usePrimitives()
  const { formatAddress } = useServices()

  if (wallet) {
    return (
      <Box flexDirection="row" gap={3} alignItems="center">
        <Box paddingVertical={2} paddingHorizontal={4} borderRadius={8} backgroundColor="muted">
          <Text variant="bodySm" fontFamily="mono">
            {formatAddress(wallet.address)}
          </Text>
        </Box>
        <Button
          variant="danger"
          size="md"
          onPress={onDisconnect}
          disabled={loading}
          loading={loading}
          loadingText="Disconnecting"
        >
          Disconnect
        </Button>
      </Box>
    )
  }

  return (
    <Button
      variant="primary"
      size="md"
      onPress={onConnect}
      disabled={loading}
      loading={loading}
      loadingText="Connecting"
    >
      Connect Wallet
    </Button>
  )
}
```

**What changed:**
- `<button>` became `<Button variant="danger">` (semantic intent)
- `style={{ backgroundColor: '#ef4444' }}` became `variant="danger"` (one prop)
- `{loading ? 'Disconnecting...' : 'Disconnect'}` became `loading={loading} loadingText="Disconnecting"` (built-in)
- `onClick` became `onPress` (cross-platform)
- `web3Service.formatAddress()` became `useServices().formatAddress()` (dependency injection)

### TokenList

**Wrong (imperative):**

```tsx
export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const getTokenStyle = (token: Token): React.CSSProperties => ({
    padding: '16px',
    backgroundColor: selectedToken?.symbol === token.symbol ? '#dbeafe' : '#f9fafb',
    border: selectedToken?.symbol === token.symbol ? '2px solid #3b82f6' : '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: 600 }}>Select Token</span>
      {tokens.map(token => (
        <div key={token.symbol} style={getTokenStyle(token)} onClick={() => onSelectToken(token)}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>{token.symbol}</span>
          <span style={{ fontSize: '16px' }}>{token.balance}</span>
        </div>
      ))}
    </div>
  )
}
```

**Correct (adapter-based):**

```tsx
import { usePrimitives } from '../adapters'

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const { Box, Text, Pressable } = usePrimitives()

  return (
    <Box flexDirection="column" gap={2}>
      <Text variant="bodyMd" fontWeight="medium">Select Token</Text>
      {tokens.map(token => {
        const isSelected = selectedToken?.symbol === token.symbol
        return (
          <Pressable key={token.symbol} onPress={() => onSelectToken(token)}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              padding={4}
              borderRadius={8}
              backgroundColor={isSelected ? 'primaryMuted' : 'alternative'}
              borderWidth={2}
              borderColor={isSelected ? 'primary' : 'transparent'}
            >
              <Box flexDirection="column" gap={1}>
                <Text variant="bodyMd" fontWeight="medium">{token.symbol}</Text>
                <Text variant="bodyXs" color="muted">{token.name}</Text>
              </Box>
              <Text variant="bodyMd" fontWeight="medium">{token.balance}</Text>
            </Box>
          </Pressable>
        )
      })}
    </Box>
  )
}
```

**What changed:**
- `<div onClick>` became `<Pressable onPress>` (cross-platform tap handling)
- `'#dbeafe'` / `'#3b82f6'` became `"primaryMuted"` / `"primary"` (semantic colors)
- `style={{ fontSize: '14px' }}` became `variant="bodyMd"` (typography system)
- All pixel values became spacing scale numbers

### TransferStatus

**Wrong:**

```tsx
const containerStyle: React.CSSProperties = {
  backgroundColor: result.success ? '#d1fae5' : '#fee2e2',
  border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
}

return (
  <div style={containerStyle}>
    <span style={{ color: result.success ? '#065f46' : '#991b1b' }}>
      {result.success ? 'Transfer Successful!' : 'Transfer Failed'}
    </span>
    <button style={dismissStyle} onClick={onDismiss}>✕</button>
  </div>
)
```

**Correct:**

```tsx
const { Box, Text, IconButton } = usePrimitives()

return (
  <Box
    flexDirection="row"
    justifyContent="space-between"
    alignItems="flex-start"
    padding={4}
    gap={3}
    borderRadius={8}
    backgroundColor={isSuccess ? 'successMuted' : 'errorMuted'}
    borderWidth={2}
    borderColor={isSuccess ? 'success' : 'error'}
  >
    <Box flexDirection="column" gap={1}>
      <Text variant="bodyMd" fontWeight="medium" color={isSuccess ? 'success' : 'error'}>
        {isSuccess ? 'Transfer Successful!' : 'Transfer Failed'}
      </Text>
      <Text variant="bodySm" color={isSuccess ? 'success' : 'error'} fontFamily={result.txHash ? 'mono' : 'default'}>
        {isSuccess ? `TX: ${result.txHash}` : result.error}
      </Text>
    </Box>
    <IconButton icon="close" size="sm" label="Dismiss" onPress={onDismiss} />
  </Box>
)
```

---

## How to Write a New Component

Follow this template every time:

```tsx
import { usePrimitives } from '../adapters'
// import { useServices } from '../services/ServicesContext'  // if you need business logic
// import { useFeatureFlag } from '../features'               // if feature-gated

interface MyComponentProps {
  // typed props
}

export function MyComponent({ ...props }: MyComponentProps) {
  const { Box, Text, Button } = usePrimitives()
  // const { someService } = useServices()
  // const isEnabled = useFeatureFlag('myFeature')

  return (
    <Box flexDirection="column" gap={3}>
      <Text variant="headingSm">Title</Text>
      <Text variant="bodyMd" color="muted">Description</Text>
      <Button variant="primary" size="md" onPress={handleAction}>
        Action
      </Button>
    </Box>
  )
}
```

### Decision Tree for Choosing Primitives

```
Need to render something?
  |
  +-- Is it a container/layout? --> Box
  |     props: flexDirection, gap, padding, backgroundColor, borderColor
  |
  +-- Is it text content? --> Text
  |     props: variant (headingLg/bodyMd/bodySm/etc.), color, fontWeight, fontFamily
  |
  +-- Is it a button/action? --> Button
  |     props: variant (primary/secondary/danger), size, onPress, loading
  |
  +-- Is it a tappable area (not a button)? --> Pressable
  |     props: onPress, disabled
  |
  +-- Is it a text input? --> TextInput
  |     props: value, onChangeText, placeholder, type, hasError
  |
  +-- Is it an icon-only button? --> IconButton
        props: icon, size, onPress, label
```

---

## Semantic Color Reference

These are the color names you pass as prop values. Never use hex codes.

### Background Colors (`backgroundColor` on Box)

| Name | Usage |
|------|-------|
| `"default"` | Primary background (white in light, dark in dark mode) |
| `"alternative"` | Secondary/page background |
| `"muted"` | Subtle emphasis, badges, chips |
| `"primaryMuted"` | Selected/active state background |
| `"errorMuted"` | Error state background |
| `"successMuted"` | Success state background |
| `"warningMuted"` | Warning state background |
| `"infoMuted"` | Info state background |

### Border Colors (`borderColor` on Box)

| Name | Usage |
|------|-------|
| `"default"` | Standard borders |
| `"muted"` | Subtle borders, dividers |
| `"primary"` | Selected/active state border |
| `"error"` | Error state border |
| `"success"` | Success state border |
| `"transparent"` | No visible border (useful for layout consistency) |

### Text Colors (`color` on Text)

| Name | Usage |
|------|-------|
| `"default"` | Primary text |
| `"muted"` | Secondary/helper text |
| `"primary"` | Brand/accent text |
| `"error"` | Error messages |
| `"success"` | Success messages |

### Text Variants (`variant` on Text)

| Variant | Usage |
|---------|-------|
| `"headingLg"` | Page titles |
| `"headingMd"` | Section titles |
| `"headingSm"` | Subsection titles |
| `"bodyLg"` | Large body text |
| `"bodyMd"` | Default body text |
| `"bodySm"` | Small body text, labels |
| `"bodyXs"` | Captions, helper text |

---

## Cross-Platform Rules

This app runs on both web (Vite) and iOS (React Native + Metro). The adapter layer handles the difference, but you need to follow these rules:

1. **Never use DOM APIs** (`document`, `window`, `localStorage`) in component code. If you need platform-specific behavior, create a `.tsx` / `.native.tsx` file pair.

2. **Never use React Native APIs** (`View`, `Pressable`, `StyleSheet`) in component code. Those live inside the native adapter implementation.

3. **Use `onPress` not `onClick`**. The adapter's `Button` and `Pressable` use `onPress` as the cross-platform event handler name.

4. **Use `onChangeText` not `onChange`**. The adapter's `TextInput` provides the string directly, not a synthetic event.

5. **Platform-specific files**: If you genuinely need different behavior per platform, create:
   - `MyThing.tsx` (web version, resolved by Vite)
   - `MyThing.native.tsx` (native version, resolved by Metro)
   - **Important**: After creating `.native.tsx` files, Metro needs `--clear` to pick them up.

---

## Validation Pattern

For input validation, use the composable `ValidationResult` monad:

```tsx
import { ValidationResult, Validators } from '../validation'

// Chain validators: each runs only if the previous one passed
const validateAmount = ValidationResult.chain(
  Validators.numeric('Enter a valid amount'),
  Validators.positive('Amount must be greater than 0'),
  (value: string) => {
    const num = parseFloat(value)
    return num <= maxBalance
      ? ValidationResult.ok()
      : ValidationResult.err(`Exceeds balance of ${maxBalance}`)
  }
)
```

Don't write inline validation logic with nested `if` chains. Compose validators.

---

## Feature Flags

Gate features behind feature flags:

```tsx
import { useFeatureFlag } from '../features'

function MyComponent() {
  const isEnabled = useFeatureFlag('myFeatureName')

  if (!isEnabled) return null
  // ... render feature
}
```

Available flags are defined in `src/features/types.ts`. Add new flags there.

---

## Anti-Pattern Detection

If you're about to generate any of these, stop and fix it:

| Red Flag | Fix |
|----------|-----|
| `<div>` | `<Box>` from `usePrimitives()` |
| `<button>` | `<Button variant="...">` from `usePrimitives()` |
| `<span>`, `<p>`, `<h1>` | `<Text variant="...">` from `usePrimitives()` |
| `<input>` | `<TextInput>` from `usePrimitives()` |
| `style={{ ... }}` | Use semantic props on `Box`, `Text`, `Button` |
| `#3b82f6`, `#ef4444`, any hex | Use semantic names: `"primary"`, `"error"`, `"danger"` |
| `onClick` | `onPress` |
| `onChange` (on inputs) | `onChangeText` |
| `import { web3Service }` | `const { method } = useServices()` |
| `padding: '12px'` | `padding={3}` (spacing scale) |
| `fontSize: '14px'` | `variant="bodySm"` (typography system) |
| `if (Platform.OS === 'web')` | Create `.tsx` / `.native.tsx` file pair |

---

## File Structure Reference

```
src/
  adapters/             # Platform abstraction layer
    types.ts            # UIAdapter interface, all primitive prop types
    web.tsx             # Web implementation (wraps @metamask/design-system-react)
    web.native.tsx      # Native implementation (wraps React Native primitives)
    index.ts            # AdapterProvider, usePrimitives hook
  components/           # UI components (platform-agnostic)
  config/               # Runtime UI configuration (long-press dialog)
  environment/          # Platform and mode detection
  features/             # Feature flag system
  hooks/                # React hooks
  services/             # Business logic (via ServicesContext)
  theme/                # Theme operations
  types/                # Shared TypeScript interfaces
  validation/           # Composable validation (ValidationResult monad)
```

---

## Detailed Component API

For the full MetaMask Design System component reference (prop tables, composition patterns, Box props vs className rules), see [`DESIGN_GUIDELINES/COMPONENTS.md`](./DESIGN_GUIDELINES/COMPONENTS.md).

For the adapter type definitions (all available props, color types, variant types), see `src/adapters/types.ts`.

---

## Why This Matters

The research in this repository ([mm-dx-research.md](./mm-dx-research.md)) demonstrates that:

- Imperative code (inline styles, raw HTML) stalls at cross-platform support and accumulates drift
- The adapter/monadic approach costs ~2.6x upfront but is the only one that ships iOS, feature flags, runtime configuration, and dark mode without rewriting
- The velocity crossover happens at commit 4: after that, functional compounds while imperative accumulates debt

Every time you generate a `<div style={{ backgroundColor: '#3b82f6' }}>`, you're choosing the path that stalls. Every time you generate a `<Box backgroundColor="primary">`, you're choosing the path that compounds.
