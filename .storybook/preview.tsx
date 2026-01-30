import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { AdapterProvider } from '../src/context'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <AdapterProvider>
        <Story />
      </AdapterProvider>
    ),
  ],
}

export default preview
