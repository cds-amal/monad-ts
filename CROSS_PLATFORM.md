# Cross-Platform Challenges: Imperative Approach

This document analyzes the effort required to add React Native support to the imperative (inline styles + direct DOM) codebase.

## Executive Summary

**The imperative approach cannot remain imperative for cross-platform support.**

Adding React Native requires introducing an abstraction layer (primitives) that fundamentally changes the architecture. This document catalogs the incompatibilities and estimates the migration effort.

---

## 1. Incompatibility Audit

### 1.1 DOM Elements → React Native Components

Every DOM element must be replaced with a platform-agnostic primitive:

| DOM Element | RN Equivalent | Files Affected |
|-------------|---------------|----------------|
| `<div>` | `<View>` | All 7 components + App.tsx |
| `<span>` | `<Text>` | All 7 components + App.tsx |
| `<button>` | `<Pressable>` + `<Text>` | WalletButton, ThemeToggle, TransferForm, TransferStatus, AddressSelect |
| `<input>` | `<TextInput>` | TransferForm |
| `<form>` | `<View>` (no native forms) | TransferForm |
| `<header>` | `<View>` | App.tsx |
| `<h1>` | `<Text>` | App.tsx |
| `<label>` | `<Text>` | TransferForm, TokenList |

**Total element replacements: ~150+ instances across 8 files**

### 1.2 Incompatible CSS Properties

| Property | Usage Location | RN Translation |
|----------|---------------|----------------|
| `cursor` | All buttons, clickable divs | Remove (no cursor on mobile) |
| `transition` | ThemeToggle, TokenList, TransferForm, AddressSelect, App | Remove or use `Animated` API |
| `boxShadow` | App.tsx (cardStyle), AddressSelect (dropdown) | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` + `elevation` (Android) |
| `outline` | TransferForm (inputStyle) | Remove (use border for focus) |
| `textTransform` | AddressSelect (groupLabelStyle) | Manual string transformation |
| `letterSpacing` | AddressSelect | Supported but in different units |
| `wordBreak` | TransferStatus | Not supported; use `numberOfLines` |
| `overflowY: 'auto'` | AddressSelect (dropdown) | `<ScrollView>` component |
| `fontFamily: 'monospace'` | WalletButton, AddressSelect, TransferStatus | Platform-specific: `'Courier'` (iOS), `'monospace'` (Android) |
| `textAlign: 'center'` on div | App.tsx (emptyStateStyle) | Must be on `<Text>` component |
| `zIndex` | AddressSelect | Supported but with different stacking context |

**CSS incompatibilities: 11 property types, ~40+ instances**

### 1.3 Incompatible Events

| Web Event | Location | RN Equivalent |
|-----------|----------|---------------|
| `onClick` (on div) | TokenList, AddressSelect | `<Pressable onPress>` |
| `onClick` (on button) | All buttons | `onPress` prop |
| `onMouseEnter` | AddressSelect:165 | `Pressable` with `onHoverIn` (web only) or state callback |
| `onMouseLeave` | AddressSelect:169 | `Pressable` with `onHoverOut` (web only) or state callback |
| `onSubmit` | TransferForm:124 | Manual button press handler |
| `onChange` (input) | TransferForm:153 | `onChangeText` |
| `disabled` (button) | Multiple | `disabled` prop (works) |

**Event incompatibilities: 6 event types, ~20+ instances**

### 1.4 Form Handling Differences

React Native has no `<form>` element and no `onSubmit` event:

```tsx
// Web (current)
<form onSubmit={handleSubmit}>
  <input onChange={e => setAmount(e.target.value)} />
  <button type="submit">Send</button>
</form>

// React Native (required)
<View>
  <TextInput onChangeText={setAmount} />
  <Pressable onPress={handleSubmit}><Text>Send</Text></Pressable>
</View>
```

---

## 2. Required Abstraction Layer

### 2.1 Primitive Components Needed

To support both platforms, we must create wrapper components:

```
src/primitives/
  index.ts          # Re-exports all primitives
  Box.tsx           # <div> / <View>
  Text.tsx          # <span> / <Text>
  Pressable.tsx     # <button> / <Pressable> with hover state handling
  TextInput.tsx     # <input> / <TextInput>
  ScrollBox.tsx     # <div overflow:auto> / <ScrollView>
  Platform.ts       # Platform detection utilities
  styles.ts         # Style normalization (shadow, fonts)
```

### 2.2 Primitive Implementation Example

```tsx
// src/primitives/Box.tsx
import { Platform } from 'react-native'

export const Box = Platform.select({
  web: (props) => <div {...props} />,
  default: (props) => <View {...props} />,
})
```

### 2.3 Style Normalization Required

```tsx
// src/primitives/styles.ts
export function normalizeStyles(webStyles: React.CSSProperties): ViewStyle {
  const {
    cursor,           // Remove
    transition,       // Remove
    boxShadow,        // Convert to shadow* props
    outline,          // Remove
    textTransform,    // Handle manually
    ...rest
  } = webStyles

  return {
    ...rest,
    ...parseBoxShadow(boxShadow),
  }
}
```

---

## 3. File Change Estimate

### 3.1 New Files Required

| File | Purpose | Lines (est.) |
|------|---------|--------------|
| `src/primitives/index.ts` | Re-exports | ~10 |
| `src/primitives/Box.tsx` | div/View wrapper | ~20 |
| `src/primitives/Text.tsx` | span/Text wrapper | ~25 |
| `src/primitives/Pressable.tsx` | button/Pressable + hover | ~50 |
| `src/primitives/TextInput.tsx` | input/TextInput | ~40 |
| `src/primitives/ScrollBox.tsx` | scrollable container | ~25 |
| `src/primitives/Platform.ts` | Platform detection | ~15 |
| `src/primitives/styles.ts` | Style normalization | ~80 |
| `src/main.native.tsx` | RN entry point | ~15 |
| `app.json` | Expo config | ~20 |

**New files: 10 | New lines: ~300**

### 3.2 Files Requiring Modification

| File | Changes Required | Effort |
|------|-----------------|--------|
| `App.tsx` | Replace all elements with primitives, remove transitions | High |
| `AddressSelect.tsx` | Most complex: hover states, dropdown, scroll | Very High |
| `WalletButton.tsx` | Replace button/div/span | Medium |
| `TokenList.tsx` | Replace div/span, fix onClick | Medium |
| `TransferForm.tsx` | Form → View, input handling, button | High |
| `TransferStatus.tsx` | Replace div/span/button | Medium |
| `ThemeToggle.tsx` | Replace button, remove transition | Low |
| `package.json` | Add RN/Expo dependencies | Low |
| `vite.config.ts` | Add .web.tsx resolution | Low |
| `metro.config.js` | New - RN bundler config | Medium |

**Modified files: 10 | Estimated changes: ~500 lines**

### 3.3 Summary

| Category | Count |
|----------|-------|
| New files | 10 |
| Modified files | 10 |
| New lines of code | ~300 |
| Modified lines of code | ~500 |
| **Total effort** | **~800 lines changed** |

---

## 4. Effort Assessment

### 4.1 Why This Fundamentally Changes the Architecture

The imperative approach's core principle is **direct control**: inline styles, DOM elements, explicit event handlers. Cross-platform support requires **indirection**:

1. **Element Indirection**: Can't use `<div>` directly; must use `<Box>` which renders platform-appropriate element
2. **Style Indirection**: Can't use CSS properties directly; must normalize/translate styles
3. **Event Indirection**: Can't use `onClick` directly; must use platform-appropriate handler

This indirection IS the abstraction layer that the "monadic" approach already has via adapters.

### 4.2 The Irony

To achieve cross-platform support, the imperative approach must:

1. Create an abstraction layer (primitives)
2. Add platform detection logic
3. Normalize styles through functions
4. Abstract event handling

**This transforms it into a monadic architecture** with:
- Primitives as "render adapters"
- Style normalizers as "style adapters"
- Platform detection as "context"

### 4.3 Comparison

| Aspect | Imperative (current) | Imperative (cross-platform) | Monadic |
|--------|---------------------|----------------------------|---------|
| Direct DOM | ✓ | ✗ (via primitives) | ✗ (via adapters) |
| Inline styles | ✓ | Partial (normalized) | Via style adapters |
| Platform-specific code | None | In primitives | In adapters |
| Architecture | Flat | Layered | Layered |

### 4.4 The "Abstraction Tax"

The imperative approach avoided abstraction for simplicity. Cross-platform support imposes an unavoidable **abstraction tax**:

- Must learn primitive API (similar to learning adapter API)
- Must understand platform differences (same either way)
- Must maintain two render paths (primitives vs adapters)

The monadic approach paid this tax upfront. The imperative approach deferred it.

---

## 5. Conclusion

**Cross-platform support is not compatible with staying imperative.**

The required changes transform the codebase into something architecturally similar to the monadic approach:

- Primitives ≈ Render Adapters
- Style normalization ≈ Style Adapters
- Platform detection ≈ Adapter Context

The difference is that the monadic approach designed for this from the start, while the imperative approach must retrofit it—touching every component file in the process.

### Recommendation

If cross-platform support is needed, the imperative approach should:
1. Accept the architectural change
2. Implement a full primitive layer
3. Migrate all components to use primitives

Alternatively, evaluate whether the monadic approach's upfront abstraction cost is justified by the reduced cross-platform migration effort.
