/** @type {import('tailwindcss').Config} */
export default {
  presets: ['@metamask/design-system-tailwind-preset'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@metamask/design-system-react/dist/**/*.js',
  ],
  theme: {
    extend: {},
    // Override default Tailwind colors to enforce using design system tokens
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
    },
    // Override default Tailwind font sizes to enforce using design system Text component
    fontSize: {},
    fontWeight: {},
  },
  plugins: [],
};
