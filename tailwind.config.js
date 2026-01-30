/** @type {import('tailwindcss').Config} */
export default {
  presets: ['@metamask/design-system-tailwind-preset'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@metamask/design-system-react/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
    extend: {
      // The preset will add design system colors, typography, and shadows
    },
  },
  plugins: [],
};
