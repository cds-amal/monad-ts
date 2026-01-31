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
| Deliverable | Working adapter system | Documentation only |
| New files | 6 | 1 (CROSS_PLATFORM.md) |
| Lines added | 324 | 120 |
| Architecture change | None needed | Would require new abstraction layer |

### mm-monad_01 Adapter System

```
src/adapters/
  index.ts           # Re-exports
  platform.ts        # Platform detection
  types.ts           # UIAdapter interface
  AdapterContext.tsx # React context + hooks
  web.tsx            # Web adapter (wraps MDS)
  native.tsx         # Native adapter (placeholder)
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
| C: Dark Mode | 85 LOC | 23 LOC |
| D: Cross-Platform | 324 LOC (working) | 120 LOC (docs only) |
| **Total new code** | ~621 LOC | ~327 LOC |

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

### mm-imperative_01
| Commit | Description |
|--------|-------------|
| `97f81c9` | Add Input component with inline validation |
| `efef499` | Refactor AddressSelect: extract AccountBadge and utilities |
| `80fd6e6` | Add dark mode with simple useTheme hook |
| `ceb4886` | Document cross-platform challenges and required abstractions |
