# Cross-Platform Support Analysis

This document analyzes what would be required to add React Native support to the imperative approach.

## Current Architecture

The app uses:
- MetaMask Design System React (`@metamask/design-system-react`)
- Tailwind CSS via `className` strings
- Standard React DOM elements (`<input>`, `<button>`, `<form>`)

## Incompatibilities

### 1. DOM Elements → Native Components

| Current | React Native Equivalent |
|---------|------------------------|
| `<div>` / `Box` | `<View>` |
| `<span>` / `Text` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` |
| `<form>` | N/A (no forms in RN) |

**Files affected**: All 7 component files

### 2. CSS Classes → StyleSheet

Tailwind `className` strings don't work in React Native. Every usage must convert:

```tsx
// Before (web)
<Box className="flex flex-col gap-4 p-3 rounded-lg">

// After (native)
<View style={styles.container}>
```

**Impact**: ~50+ className usages across codebase

### 3. MetaMask Design System

`@metamask/design-system-react` is web-only:
- Uses DOM elements internally
- Relies on CSS for styling
- No React Native equivalent package exists

**Options**:
1. Wait for MetaMask to release RN version
2. Create wrapper components that re-implement MDS for native
3. Use different component library for native

### 4. Event Handlers

| Web Event | React Native |
|-----------|-------------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` / `onValueChange` |
| `onBlur` | `onBlur` (same) |
| `onMouseEnter/Leave` | N/A (no hover on touch) |

### 5. Platform-Specific APIs

- `localStorage` → `AsyncStorage` or `expo-secure-store`
- `window.matchMedia` → `Appearance.getColorScheme()`
- CSS transitions → `Animated` API or `react-native-reanimated`

## Required Changes

### New Abstraction Layer

Would need to create primitives that resolve to platform-appropriate elements:

```
src/primitives/
  Box.tsx       # View/div wrapper
  Text.tsx      # Text/span wrapper
  Pressable.tsx # Button wrapper
  Input.tsx     # TextInput wrapper
  Platform.ts   # Detection utilities
```

### Component Migration

Every component would need updates:

| Component | Changes Required |
|-----------|-----------------|
| `AddressSelect.tsx` | Replace dropdown with RN picker, remove hover states |
| `TransferForm.tsx` | Remove `<form>`, change to `<View>` |
| `Input.tsx` | Wrap `<TextInput>` instead of `<input>` |
| `Dropdown.tsx` | Complete rewrite for RN modal-based picker |
| `TokenList.tsx` | Use `FlatList` instead of map |
| `ThemeToggle.tsx` | Use `Appearance` API |
| `App.tsx` | Remove DOM-specific elements |

### Estimated Effort

- **New files**: 8-10 (primitives + native adapters)
- **Modified files**: All 7 components + hooks
- **Lines of code**: ~500+ new/modified
- **Architecture change**: Significant - must introduce abstraction layer

## Key Finding

The imperative approach with direct MDS usage cannot stay imperative for cross-platform. Would need to:

1. Create a primitive abstraction layer (similar to what monadic approach already has)
2. Re-implement or abstract away MDS components
3. Convert all className usages to StyleSheet or inline styles

This effectively requires adopting the same patterns the monadic approach uses from the start.

## Recommendation

For cross-platform support:
- Use platform-agnostic primitives from the beginning
- Treat web-specific libraries (like MDS) as adapters, not core dependencies
- Keep styling in a format that can translate to both platforms

The monadic approach's adapter pattern is better suited for this requirement.
