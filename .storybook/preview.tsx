import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { AdapterProvider } from '../src/context'
import { Theme } from '../src/adapters/browser'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as Theme
      return (
        <AdapterProvider initialTheme={theme}>
          <div style={{
            padding: '24px',
            backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
            minHeight: '100vh',
          }}>
            <Story />
          </div>
        </AdapterProvider>
      )
    },
  ],
}

export default preview
