# Component Guidelines

This document defines how to use MetaMask Design System components when generating UI code. These patterns ensure consistency, maintainability, and adherence to design system principles.

## Table of Contents

- [General Principles](#general-principles)
- [Component Hierarchy](#component-hierarchy)
- [Box Component (Layout)](#box-component-layout)
- [Button Component (Interactive)](#button-component-interactive)
- [Text Component (Typography)](#text-component-typography)
- [Base vs Variant Components](#base-vs-variant-components)
- [Component Composition Patterns](#component-composition-patterns)
- [Anti-Patterns](#anti-patterns)
- [AI Agent Guidelines](#ai-agent-guidelines)

---

## General Principles

### 1. ALWAYS Use Design System Components

**DO:**
```tsx
import { Box, Button, Text } from '@metamask/design-system-react'
```

**DON'T:**
```tsx
// ❌ Never use native HTML elements for UI
<div>, <button>, <span>, <p>, <h1>, etc.
```

### 2. NEVER Use Inline Styles

**DO:**
```tsx
<Box className="rounded-lg" paddingHorizontal={4}>
```

**DON'T:**
```tsx
// ❌ Never use inline styles
<Box style={{ padding: '16px', borderRadius: '8px' }}>
```

### 3. ALWAYS Use Semantic Variants and Tokens

**DO:**
```tsx
<Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
```

**DON'T:**
```tsx
// ❌ Never use arbitrary prop values
<Button style={{ backgroundColor: '#3b82f6' }}>
```

### 4. NEVER Use Raw Tailwind Utility Classes for Colors/Typography

**DO:**
```tsx
<Text variant={TextVariant.BodyMd}>
```

**DON'T:**
```tsx
// ❌ Never use Tailwind color/font utilities directly
<div className="text-blue-500 text-lg font-bold">
```

**Exception:** Layout utilities like `flex`, `rounded-lg`, `font-mono` are acceptable when design system props don't cover the use case.

---

## Component Hierarchy

**Before writing any component, ask: "Does `@metamask/design-system-react` have this?"**

Always follow this strict order when choosing components:

### Decision Tree

```
Need a component?
  ├─ Is it Box, Text, Button, Icon, Avatar, or Badge?
  │  └─ YES → Use @metamask/design-system-react [STOP]
  │
  ├─ Can I compose it from Box + Text + Button?
  │  └─ YES → Compose from design system primitives [STOP]
  │
  └─ Is it truly custom with no design system equivalent?
     └─ Build minimal component using design system primitives [STOP]
```

### Why This Hierarchy Matters

- **Consistency** - Design system ensures uniform look, feel, and behavior
- **Maintenance** - Centralized updates benefit all consumers
- **Accessibility** - Components built with a11y in mind
- **Type Safety** - Full TypeScript support
- **Performance** - Optimized components reduce bundle size

---

## Box Component (Layout)

The `Box` component is the foundational layout primitive. Use it instead of `<div>`.

**Box is a special cross-platform primitive** - It's designed to work on both web (renders `div`) and React Native (renders `View`) with the same API. This is why Box has utility props while other components use `className`.

**Box is the ONLY component with layout and color props.** All other components (Button, Text, Icon) should use their component-specific props first, then `className` for additional utilities.

### Import

```tsx
import {
  Box,
  BoxAlignItems,
  BoxJustifyContent,
  BoxDisplay,
  BoxFlexDirection,
  BoxBackgroundColor,
  BoxBorderColor
} from '@metamask/design-system-react'
```

### Common Props

| Prop | Type | Purpose | Example Values |
|------|------|---------|----------------|
| `className` | `string` | Additional utilities | `"flex"`, `"rounded-lg"`, `"w-full"` |
| `gap` | `number` | Spacing between children | `2`, `3`, `4` (design system scale 0-12) |
| `padding` | `number` | All sides padding | `2`, `3`, `4` |
| `paddingVertical` | `number` | Top/bottom padding | `2`, `3`, `4` |
| `paddingHorizontal` | `number` | Left/right padding | `2`, `3`, `4` |
| `margin` | `number` | All sides margin | `2`, `3`, `4` |
| `alignItems` | `BoxAlignItems` | Flex align-items | `BoxAlignItems.Center` |
| `justifyContent` | `BoxJustifyContent` | Flex justify-content | `BoxJustifyContent.SpaceBetween` |
| `display` | `BoxDisplay` | Display property | `BoxDisplay.Flex`, `BoxDisplay.Block` |
| `flexDirection` | `BoxFlexDirection` | Flex direction | `BoxFlexDirection.Row`, `BoxFlexDirection.Column` |
| `backgroundColor` | `BoxBackgroundColor` | Background color (Box only) | `BoxBackgroundColor.BackgroundDefault` |
| `borderColor` | `BoxBorderColor` | Border color (Box only) | `BoxBorderColor.BorderMuted` |
| `borderWidth` | `number` | Border width | `0`, `1`, `2`, `4`, `8` |

### Box Props vs className Rules

**Priority Order**: Box utility props → className for extras

**✅ USE PROPS for:**
- **Static background colors**: `backgroundColor={BoxBackgroundColor.BackgroundDefault}`
- **Static border colors**: `borderColor={BoxBorderColor.BorderMuted}`
- **Border width**: `borderWidth={1}`
- **Flexbox layout**: `flexDirection`, `alignItems`, `justifyContent`
- **Standard spacing**: `padding={4}`, `margin={2}`, `gap={3}` (0-12 scale)

**✅ USE className for:**
- **Width/height**: `w-full`, `h-20`, `w-96`
- **Complex positioning**: `absolute`, `relative`, `top-0`, `left-0`
- **Border radius**: `rounded-lg`, `rounded-full`
- **Interactive states**: `hover:bg-hover`, `active:bg-pressed`, `focus:ring`
- **Shadows and opacity**: `shadow-lg`, `opacity-50`
- **Other utilities**: `overflow-hidden`, `z-10`, `truncate`

**❌ DON'T use className on Box for:**
- Static background colors (use `backgroundColor` prop with enum)
- Static border colors (use `borderColor` prop with enum)
- Flexbox properties (use `flexDirection`, `alignItems`, etc. props)
- Standard spacing (use `padding`/`margin` props)

### Examples: Props vs className

```tsx
// ✅ CORRECT: Use props for layout and colors
<Box
  backgroundColor={BoxBackgroundColor.BackgroundDefault}
  borderColor={BoxBorderColor.BorderMuted}
  borderWidth={1}
  flexDirection={BoxFlexDirection.Row}
  alignItems={BoxAlignItems.Center}
  padding={4}
  gap={3}
  className="w-full rounded-lg hover:bg-hover"
>

// ❌ WRONG: Don't use className for things Box props cover
<Box className="bg-default border border-muted flex flex-row items-center p-4 gap-3 w-full rounded-lg">
```

### Usage Examples

#### Basic Container

```tsx
// ✅ CORRECT: Use Box with design system spacing
<Box className="rounded-lg" paddingVertical={2} paddingHorizontal={4}>
  <Text variant={TextVariant.BodySm}>Content here</Text>
</Box>
```

```tsx
// ❌ WRONG: Don't use div with inline styles
<div style={{ padding: '8px 16px', borderRadius: '8px' }}>
  <span>Content here</span>
</div>
```

#### Flex Layout

```tsx
// ✅ CORRECT: Use Box with semantic props for flex layouts
<Box className="flex" gap={3} alignItems={BoxAlignItems.Center}>
  <Text variant={TextVariant.BodyMd}>Label</Text>
  <Button variant={ButtonVariant.Primary}>Action</Button>
</Box>
```

```tsx
// ❌ WRONG: Don't use div with inline flex styles
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <span>Label</span>
  <button>Action</button>
</div>
```

#### Nested Layouts

```tsx
// ✅ CORRECT: Compose Box components for complex layouts
<Box className="flex" gap={4} flexDirection={BoxFlexDirection.Column}>
  <Box paddingVertical={3} paddingHorizontal={4}>
    <Text variant={TextVariant.HeadingSm}>Title</Text>
  </Box>
  <Box className="flex" gap={2}>
    <Button variant={ButtonVariant.Primary}>Save</Button>
    <Button variant={ButtonVariant.Secondary}>Cancel</Button>
  </Box>
</Box>
```

### When to Use

- **Container elements** - Any `<div>` should be a `<Box>`
- **Flex layouts** - Use `className="flex"` with Box props
- **Spacing/padding** - Use design system scale values (2, 3, 4, etc.)
- **Semantic grouping** - Wrap related content in Box

---

## Button Component (Interactive)

The `Button` component handles all interactive button UI. Use it instead of `<button>`.

### Import

```tsx
import {
  Button,
  ButtonVariant,
  ButtonBaseSize
} from '@metamask/design-system-react'
```

### Common Props

| Prop | Type | Purpose | Example Values |
|------|------|---------|----------------|
| `variant` | `ButtonVariant` | Visual style/intent | `ButtonVariant.Primary`, `ButtonVariant.Secondary` |
| `size` | `ButtonBaseSize` | Button size | `ButtonBaseSize.Sm`, `ButtonBaseSize.Md`, `ButtonBaseSize.Lg` |
| `onClick` | `() => void` | Click handler | Event handler function |
| `isDisabled` | `boolean` | Disabled state | `true`, `false` |
| `isLoading` | `boolean` | Loading state | `true`, `false` |
| `loadingText` | `string` | Text during loading | `"Loading..."`, `"Connecting"` |
| `isDanger` | `boolean` | Danger/destructive action | `true`, `false` |
| `children` | `ReactNode` | Button label | Text or elements |

### Available Variants

```tsx
enum ButtonVariant {
  Primary = 'primary',      // Main actions
  Secondary = 'secondary',  // Secondary actions
  Link = 'link',           // Link-style buttons
}
```

### Usage Examples

#### Primary Action Button

```tsx
// ✅ CORRECT: Use Button with semantic variant
<Button
  variant={ButtonVariant.Primary}
  size={ButtonBaseSize.Md}
  onClick={onConnect}
>
  Connect Wallet
</Button>
```

```tsx
// ❌ WRONG: Don't use native button with inline styles
<button
  onClick={onConnect}
  style={{
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px'
  }}
>
  Connect Wallet
</button>
```

#### Loading State

```tsx
// ✅ CORRECT: Use built-in loading props
<Button
  variant={ButtonVariant.Primary}
  size={ButtonBaseSize.Md}
  onClick={onSubmit}
  isLoading={loading}
  loadingText="Submitting"
>
  Submit
</Button>
```

```tsx
// ❌ WRONG: Don't manually implement loading UI
<button onClick={onSubmit} disabled={loading}>
  {loading ? 'Submitting...' : 'Submit'}
</button>
```

#### Disabled State

```tsx
// ✅ CORRECT: Use isDisabled prop
<Button
  variant={ButtonVariant.Primary}
  size={ButtonBaseSize.Md}
  onClick={onSave}
  isDisabled={!isValid}
>
  Save
</Button>
```

```tsx
// ❌ WRONG: Don't use HTML disabled attribute
<button onClick={onSave} disabled={!isValid}>
  Save
</button>
```

#### Danger/Destructive Action

```tsx
// ✅ CORRECT: Use isDanger prop for destructive actions
<Button
  variant={ButtonVariant.Primary}
  size={ButtonBaseSize.Md}
  onClick={onDelete}
  isDanger
>
  Delete Account
</Button>
```

```tsx
// ❌ WRONG: Don't use arbitrary red styling
<button
  onClick={onDelete}
  style={{ backgroundColor: '#ef4444', color: 'white' }}
>
  Delete Account
</button>
```

#### Button Group

```tsx
// ✅ CORRECT: Compose buttons in Box with gap
<Box className="flex" gap={2}>
  <Button
    variant={ButtonVariant.Primary}
    size={ButtonBaseSize.Md}
    onClick={onSave}
  >
    Save
  </Button>
  <Button
    variant={ButtonVariant.Secondary}
    size={ButtonBaseSize.Md}
    onClick={onCancel}
  >
    Cancel
  </Button>
</Box>
```

### When to Use

- **All clickable actions** - Any `<button>` should be a `<Button>`
- **Form submissions** - Use `variant={ButtonVariant.Primary}`
- **Secondary actions** - Use `variant={ButtonVariant.Secondary}`
- **Destructive actions** - Add `isDanger` prop
- **Async operations** - Use `isLoading` and `loadingText`

### Real-World Example

From `src/components/WalletButton.tsx`:

```tsx
export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  if (wallet) {
    return (
      <Box className="flex" gap={3} alignItems={BoxAlignItems.Center}>
        <Box className="rounded-lg" paddingVertical={2} paddingHorizontal={4}>
          <Text variant={TextVariant.BodySm} fontFamily={FontFamily.Default} className="font-mono">
            {web3Service.formatAddress(wallet.address)}
          </Text>
        </Box>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonBaseSize.Md}
          onClick={onDisconnect}
          isDisabled={loading}
          isLoading={loading}
          loadingText="Disconnecting"
          isDanger
        >
          Disconnect
        </Button>
      </Box>
    )
  }

  return (
    <Button
      variant={ButtonVariant.Primary}
      size={ButtonBaseSize.Md}
      onClick={onConnect}
      isDisabled={loading}
      isLoading={loading}
      loadingText="Connecting"
    >
      Connect Wallet
    </Button>
  )
}
```

---

## Text Component (Typography)

The `Text` component handles all text rendering. Use it instead of `<span>`, `<p>`, `<h1>`, etc.

### Import

```tsx
import {
  Text,
  TextVariant,
  FontFamily
} from '@metamask/design-system-react'
```

### Common Props

| Prop | Type | Purpose | Example Values |
|------|------|---------|----------------|
| `variant` | `TextVariant` | Semantic text style | `TextVariant.HeadingLg`, `TextVariant.BodyMd` |
| `fontFamily` | `FontFamily` | Font family | `FontFamily.Default`, `FontFamily.Monospace` |
| `className` | `string` | Additional utilities | `"font-mono"`, `"truncate"` |
| `as` | `string` | HTML element | `"span"`, `"p"`, `"h1"`, `"label"` |
| `children` | `ReactNode` | Text content | String or elements |

### Available Variants

```tsx
enum TextVariant {
  // Headings
  HeadingLg = 'heading-lg',     // Large headings
  HeadingMd = 'heading-md',     // Medium headings
  HeadingSm = 'heading-sm',     // Small headings

  // Body text
  BodyLgMedium = 'body-lg-medium',
  BodyMd = 'body-md',           // Default body text
  BodySm = 'body-sm',           // Small body text
  BodyXs = 'body-xs',           // Extra small text
}

enum FontFamily {
  Default = 'default',          // MM Sans
  Monospace = 'monospace',      // Monospace font
}
```

### Usage Examples

#### Headings

```tsx
// ✅ CORRECT: Use Text with heading variant
<Text variant={TextVariant.HeadingLg} as="h1">
  Welcome to MetaMask
</Text>
```

```tsx
// ❌ WRONG: Don't use native heading elements
<h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
  Welcome to MetaMask
</h1>
```

#### Body Text

```tsx
// ✅ CORRECT: Use Text with body variant
<Text variant={TextVariant.BodyMd}>
  Your wallet balance is shown below.
</Text>
```

```tsx
// ❌ WRONG: Don't use p or span with arbitrary styling
<p style={{ fontSize: '14px', lineHeight: '1.5' }}>
  Your wallet balance is shown below.
</p>
```

#### Monospace Text (Addresses, Hashes)

```tsx
// ✅ CORRECT: Use Text with monospace font family
<Text variant={TextVariant.BodySm} fontFamily={FontFamily.Default} className="font-mono">
  0x1234...5678
</Text>
```

```tsx
// ❌ WRONG: Don't use span with font-family style
<span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
  0x1234...5678
</span>
```

#### Labels

```tsx
// ✅ CORRECT: Use Text with as="label" for form labels
<Text variant={TextVariant.BodySm} as="label" htmlFor="amount">
  Amount
</Text>
```

```tsx
// ❌ WRONG: Don't use native label with styling
<label htmlFor="amount" style={{ fontSize: '12px', fontWeight: '500' }}>
  Amount
</label>
```

### When to Use

- **All text rendering** - Any text element should be `<Text>`
- **Headings** - Use `HeadingLg/Md/Sm` variants with appropriate `as` prop
- **Body content** - Use `BodyMd` (default) or size-appropriate variant
- **Addresses/hashes** - Use `fontFamily={FontFamily.Default}` with `className="font-mono"`
- **Form labels** - Use `as="label"` with appropriate variant

---

## Base vs Variant Components

MetaMask Design System follows a Base/Variant pattern for component families. **Always prefer variant components over base components.**

### The Pattern

| Component Family | Variant Components (Use First) | Base Component (Use Sparingly) |
|------------------|--------------------------------|--------------------------------|
| **Button** | Button (Primary/Secondary/Link), ButtonIcon | ButtonBase |
| **Other Families** | (Specific variants for your use case) | (Base implementation) |

### When to Use Variant Components

**✅ ALWAYS prefer variant components:**

```tsx
// ✅ CORRECT: Use Button with variant
<Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
  Submit
</Button>

<Button variant={ButtonVariant.Secondary} size={ButtonBaseSize.Md}>
  Cancel
</Button>
```

Variant components provide:
- **Semantic meaning** - Primary vs Secondary communicates intent
- **Design consistency** - Variants follow design system specs
- **Built-in behavior** - Loading states, accessibility, etc.
- **Less code** - No need to manually style

### When to Use Base Components

**⚠️ Only use base components when:**

1. **No existing variant fits** - Your design needs don't match any variant
2. **Building custom patterns** - Creating a new reusable pattern
3. **Highly specialized UI** - One-off component with unique requirements

```tsx
// ⚠️ USE SPARINGLY: ButtonBase for highly custom patterns
<ButtonBase
  size={ButtonBaseSize.Md}
  className="h-auto rounded-lg bg-muted py-4 px-4 hover:bg-muted-hover"
  onClick={handleClick}
>
  <Icon name={IconName.Bank} />
  <Text fontWeight={FontWeight.Medium}>Custom Pattern</Text>
</ButtonBase>
```

### Warning Signs

**If you're reaching for a base component, ask:**

1. ✅ **Can an existing variant work?** - With minor adjustments
2. ✅ **Should this be a new variant?** - If used multiple times
3. ❌ **Is this design inconsistent?** - Does it break design system patterns?

**Base component usage may indicate:**
- Design inconsistency or drift
- Missing variant that should be added to design system
- One-off pattern that creates maintenance debt

### Decision Flow

```
Need a Button?
  ├─ Is it a primary, secondary, or link-style button?
  │  └─ YES → Use Button with appropriate variant [STOP]
  │
  ├─ Does an existing Button variant cover 80% of the need?
  │  └─ YES → Use Button variant, adjust with className if needed [STOP]
  │
  ├─ Is this a reusable pattern used in multiple places?
  │  └─ YES → Consider proposing a new Button variant [STOP]
  │
  └─ Highly custom one-off button with no design system equivalent?
     └─ Use ButtonBase with justification [PROCEED WITH CAUTION]
```

### Key Principle

**Variant components > Base components**

Using base components is not wrong, but it's a signal to pause and validate that you're not:
- Creating design inconsistency
- Bypassing the design system unnecessarily
- Building technical debt

---

## Component Composition Patterns

### Pattern: Form Field

```tsx
// ✅ CORRECT: Compose Box + Text + Input
<Box className="flex" gap={2} flexDirection={BoxFlexDirection.Column}>
  <Text variant={TextVariant.BodySm} as="label" htmlFor="recipient">
    Recipient Address
  </Text>
  <input
    id="recipient"
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />
  <Text variant={TextVariant.BodyXs}>
    Enter a valid Ethereum address
  </Text>
</Box>
```

### Pattern: Card/Panel

```tsx
// ✅ CORRECT: Use Box for card-like containers
<Box
  className="rounded-lg"
  paddingVertical={4}
  paddingHorizontal={4}
  gap={3}
  flexDirection={BoxFlexDirection.Column}
>
  <Text variant={TextVariant.HeadingMd}>Token Balance</Text>
  <Text variant={TextVariant.BodyMd}>1,234.56 ETH</Text>
  <Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
    Transfer
  </Button>
</Box>
```

### Pattern: List Item

```tsx
// ✅ CORRECT: Compose Box + Text for list items
<Box className="flex" gap={3} alignItems={BoxAlignItems.Center}>
  <Box className="rounded-full" padding={2}>
    {/* Icon */}
  </Box>
  <Box className="flex" gap={1} flexDirection={BoxFlexDirection.Column}>
    <Text variant={TextVariant.BodyMd}>Ethereum</Text>
    <Text variant={TextVariant.BodySm}>1,234.56 ETH</Text>
  </Box>
  <Button variant={ButtonVariant.Link} size={ButtonBaseSize.Sm}>
    Send
  </Button>
</Box>
```

### Pattern: Header with Actions

```tsx
// ✅ CORRECT: Use Box with justify-content for headers
<Box
  className="flex"
  gap={4}
  alignItems={BoxAlignItems.Center}
  justifyContent={BoxJustifyContent.SpaceBetween}
>
  <Text variant={TextVariant.HeadingLg}>Dashboard</Text>
  <Box className="flex" gap={2}>
    <Button variant={ButtonVariant.Secondary} size={ButtonBaseSize.Md}>
      Settings
    </Button>
    <Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
      New Transaction
    </Button>
  </Box>
</Box>
```

---

## Anti-Patterns

### ❌ NEVER: Use Native HTML Elements for UI

```tsx
// ❌ WRONG
<div className="container">
  <button onClick={onClick}>Click me</button>
  <span>Some text</span>
</div>

// ✅ CORRECT
<Box className="container">
  <Button variant={ButtonVariant.Primary} onClick={onClick}>
    Click me
  </Button>
  <Text variant={TextVariant.BodyMd}>Some text</Text>
</Box>
```

**Why it's wrong:** Native elements bypass the design system, leading to inconsistent styling, poor theming, and maintenance issues.

---

### ❌ NEVER: Use Inline Styles

```tsx
// ❌ WRONG
<Box style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
  <Text style={{ color: '#333', fontSize: '14px' }}>Content</Text>
</Box>

// ✅ CORRECT
<Box paddingHorizontal={4} paddingVertical={4}>
  <Text variant={TextVariant.BodyMd}>Content</Text>
</Box>
```

**Why it's wrong:** Inline styles use arbitrary values, are hard to maintain, don't respect design tokens, and prevent theming.

---

### ❌ NEVER: Use Raw Hex Colors

```tsx
// ❌ WRONG
<button style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
  Submit
</button>

// ✅ CORRECT
<Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>
  Submit
</Button>
```

**Why it's wrong:** Hardcoded colors don't update with theme changes, create inconsistency, and bypass semantic meaning.

---

### ❌ NEVER: Use Arbitrary Tailwind Color/Typography Classes

```tsx
// ❌ WRONG
<div className="text-blue-500 text-lg font-bold bg-gray-100 p-4">
  Important message
</div>

// ✅ CORRECT
<Box paddingHorizontal={4} paddingVertical={4}>
  <Text variant={TextVariant.BodyLgMedium}>Important message</Text>
</Box>
```

**Why it's wrong:** Tailwind utility classes for colors and typography bypass the design system tokens. Only structural utilities (flex, rounded-lg) are acceptable.

---

### ❌ NEVER: Manually Implement Loading States

```tsx
// ❌ WRONG
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// ✅ CORRECT
<Button
  variant={ButtonVariant.Primary}
  isLoading={loading}
  loadingText="Loading"
>
  Submit
</Button>
```

**Why it's wrong:** Design system components have built-in loading states with consistent UX. Don't reinvent them.

---

### ❌ NEVER: Use Magic Numbers for Spacing

```tsx
// ❌ WRONG
<div style={{ padding: '17px', gap: '13px' }}>

// ✅ CORRECT
<Box paddingHorizontal={4} paddingVertical={4} gap={3}>
```

**Why it's wrong:** Design system uses a spacing scale (2, 3, 4, etc.). Arbitrary pixel values break consistency.

---

### ❌ NEVER: Mix Design System with Custom Components

```tsx
// ❌ WRONG: Mixing native and design system components
<Box>
  <Button variant={ButtonVariant.Primary}>OK</Button>
  <button className="custom-button">Cancel</button>
</Box>

// ✅ CORRECT: Use design system consistently
<Box className="flex" gap={2}>
  <Button variant={ButtonVariant.Primary}>OK</Button>
  <Button variant={ButtonVariant.Secondary}>Cancel</Button>
</Box>
```

**Why it's wrong:** Mixing component types creates inconsistent styling and behavior. Be consistent.

---

## Quick Reference

| Instead of... | Use... | Why |
|--------------|--------|-----|
| `<div>` | `<Box>` | Design system primitive |
| `<button>` | `<Button variant={...}>` | Consistent styling, built-in states |
| `<span>`, `<p>`, `<h1>` | `<Text variant={...}>` | Semantic typography system |
| `style={{ padding: '16px' }}` | `paddingHorizontal={4}` | Design system spacing scale |
| `style={{ color: '#3b82f6' }}` | `variant={ButtonVariant.Primary}` | Semantic tokens |
| `className="text-blue-500"` | `variant={TextVariant.BodyMd}` | Design system typography |
| `{loading ? '...' : 'Text'}` | `isLoading={loading}` | Built-in component states |
| Magic numbers (17px, 13px) | Scale values (2, 3, 4) | Consistent spacing system |

---

## AI Agent Guidelines

When generating or suggesting code changes, follow this checklist:

### Before Generating Code

1. ✅ **Check component hierarchy** - Does `@metamask/design-system-react` have this component?
2. ✅ **Prefer variant components** - Use Button over ButtonBase, etc.
3. ✅ **Use component props first** - variant, size, color before className
4. ✅ **Use Box props for layout** - flexDirection, alignItems, padding before className
5. ✅ **Reference existing patterns** - Look at real-world examples in the codebase

### Code Review Checklist

Before suggesting or accepting code:

- [ ] No native HTML elements for UI (`<div>`, `<button>`, `<span>`)
- [ ] Design system components used appropriately
- [ ] Variant components used over base components when possible
- [ ] No inline styles for static values
- [ ] No arbitrary color values (hex codes)
- [ ] No arbitrary spacing values (17px, 13px)
- [ ] Box static colors use `backgroundColor`/`borderColor` props
- [ ] Box interactive states use className (`hover:`, `active:`)
- [ ] Component-specific props used before className
- [ ] Text component uses TextVariant, not Tailwind text utilities
- [ ] Button component uses ButtonVariant, not custom styling

### Pattern Detection

**Flag these patterns immediately:**

```tsx
// ❌ RED FLAG: Native elements
<div>, <button>, <span>, <p>

// ❌ RED FLAG: Inline styles
style={{ backgroundColor: '#xxx', padding: '12px' }}

// ❌ RED FLAG: Arbitrary colors
className="bg-[#3B82F6]" or style={{ color: '#000' }}

// ❌ RED FLAG: Box using className for props
<Box className="bg-default flex flex-row items-center">

// ❌ RED FLAG: Tailwind typography on Box
<Box className="text-lg font-bold text-blue-500">
```

### Suggested Corrections

When you detect anti-patterns, suggest corrections:

```tsx
// If you see:
<div style={{ padding: '16px' }}>

// Suggest:
<Box paddingHorizontal={4} paddingVertical={4}>

// If you see:
<button style={{ backgroundColor: '#3b82f6' }}>

// Suggest:
<Button variant={ButtonVariant.Primary} size={ButtonBaseSize.Md}>

// If you see:
<Box className="bg-default border border-muted flex items-center">

// Suggest:
<Box
  backgroundColor={BoxBackgroundColor.BackgroundDefault}
  borderColor={BoxBorderColor.BorderMuted}
  borderWidth={1}
  className="flex"
  alignItems={BoxAlignItems.Center}
>
```

### Explanation Template

When correcting code, explain WHY:

> "I'm using `<Box>` instead of `<div>` because Box is the design system's layout primitive, which ensures consistent styling and enables cross-platform compatibility."

> "I'm using `backgroundColor={BoxBackgroundColor.BackgroundDefault}` instead of `className="bg-default"` because Box has dedicated color props that should be used for static colors."

> "I'm using `<Button variant={ButtonVariant.Primary}>` instead of `<ButtonBase>` because variant components should always be preferred - they provide semantic meaning and consistent styling."

### Learning from Context

When generating code:

1. **Read the codebase** - Look for existing patterns
2. **Check similar components** - How do they handle this use case?
3. **Reference design system** - Check component type definitions
4. **Validate consistency** - Does this match existing code style?

### Priority Order Reminder

**Always follow this priority:**

1. Design system variant components (Button, Text, Box)
2. Component-specific props (variant, size, color)
3. Box utility props (flexDirection, padding, backgroundColor)
4. className for extras (width, positioning, interactive states)

---

## Summary

When generating UI code:

1. ✅ **ALWAYS** use MetaMask Design System components (`Box`, `Button`, `Text`)
2. ✅ **ALWAYS** use semantic variants (`ButtonVariant.Primary`, `TextVariant.BodyMd`)
3. ✅ **ALWAYS** use design system spacing scale (2, 3, 4, not arbitrary px values)
4. ❌ **NEVER** use native HTML elements for UI (`<div>`, `<button>`, `<span>`)
5. ❌ **NEVER** use inline styles or raw CSS values
6. ❌ **NEVER** use raw hex colors or Tailwind color utilities
7. ❌ **NEVER** use arbitrary font sizes or Tailwind typography utilities

Following these patterns ensures consistency, maintainability, and adherence to design system principles at scale.
