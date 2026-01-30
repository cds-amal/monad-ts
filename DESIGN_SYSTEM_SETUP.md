# MetaMask Design System Setup

This document describes the MetaMask Design System setup in this project.

## Installation

The following packages have been installed:

```bash
npm install @metamask/design-system-react @metamask/design-system-tailwind-preset @metamask/design-tokens
npm install -D tailwindcss postcss autoprefixer
```

## Configuration

### Tailwind CSS Configuration

The `tailwind.config.js` file is configured to use the MetaMask design system preset:

- Uses `@metamask/design-system-tailwind-preset` as the base preset
- Restricts default Tailwind colors to enforce design system tokens
- Removes default font sizes and weights to encourage using the Text component
- Scans component files from the design system package

### PostCSS Configuration

The `postcss.config.js` file includes:
- `tailwindcss` plugin
- `autoprefixer` plugin

### CSS Entry Point

The `src/index.css` file imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This file is imported in `src/main.tsx`.

## Available Components

The MetaMask design system provides the following components:

### Layout & Typography
- `Box` - Layout container component
- `Text` - Typography component with design system styles

### Buttons
- `Button` - Primary action buttons with variants (primary, secondary, outline)
- `ButtonBase` - Base button component
- `ButtonHero` - Hero-style buttons
- `ButtonIcon` - Icon-only buttons

### Avatars
- `AvatarAccount` - Account/address avatars
- `AvatarBase` - Base avatar component
- `AvatarFavicon` - Favicon avatars
- `AvatarGroup` - Grouped avatars
- `AvatarIcon` - Icon avatars
- `AvatarNetwork` - Network avatars
- `AvatarToken` - Token avatars

### Badges
- `BadgeCount` - Count badges
- `BadgeIcon` - Icon badges
- `BadgeNetwork` - Network badges
- `BadgeStatus` - Status badges
- `BadgeWrapper` - Badge wrapper component

### Form Elements
- `Checkbox` - Checkbox input
- `Icon` - Icon component

## Usage Example

See `src/components/DesignSystemExample.tsx` for a comprehensive example of using the design system components.

```tsx
import { Box, Button, Text, AvatarAccount } from '@metamask/design-system-react';

function MyComponent() {
  return (
    <Box className="p-6">
      <Text className="text-xl font-bold">Welcome</Text>
      <AvatarAccount address="0x1234..." size="md" />
      <Button variant="primary">Click Me</Button>
    </Box>
  );
}
```

## Design Tokens

The design system includes design tokens from `@metamask/design-tokens` which provide:
- Color tokens (semantic colors for UI elements)
- Spacing tokens
- Typography tokens
- Border radius tokens
- Shadow tokens
- Breakpoint tokens

These tokens are automatically available through the Tailwind preset.

## Resources

- [MetaMask Design System Repository](https://github.com/MetaMask/metamask-design-system)
- [Storybook Examples](https://github.com/MetaMask/metamask-design-system/tree/main/apps/storybook-react)

## Notes

- The configuration intentionally restricts default Tailwind utilities to encourage using design system components
- Always prefer using the `Text` component over arbitrary font utilities
- Use design system color tokens instead of arbitrary color values
- The design system enforces consistency across MetaMask products
