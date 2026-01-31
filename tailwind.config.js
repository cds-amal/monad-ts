/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@metamask/design-system-tailwind-preset')
  ],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@metamask/design-system-react/**/*.{mjs,cjs}',
  ],
  theme: {
    extend: {
      // The preset will add design system colors, typography, and shadows
    },
  },
  plugins: [],
};
