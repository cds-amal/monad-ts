import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

const theme = create({
  base: 'light',
  brandTitle: '🧩 MONADIC',
  brandUrl: '#',
  brandTarget: '_self',
})

addons.setConfig({
  theme,
})
