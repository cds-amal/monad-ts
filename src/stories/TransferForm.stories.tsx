import type { Meta, StoryObj } from '@storybook/react'
import { TransferForm } from '../components/TransferForm'
import { Token } from '../ports'

const MOCK_TOKEN: Token = { symbol: 'ETH', name: 'Ethereum', balance: '2.5', decimals: 18 }

const meta = {
  title: 'Components/TransferForm',
  component: TransferForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onTransferComplete: (result) => console.log('transfer complete', result),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransferForm>

export default meta
type Story = StoryObj<typeof meta>

export const NoTokenSelected: Story = {
  args: {
    token: null,
  },
}

export const WithToken: Story = {
  args: {
    token: MOCK_TOKEN,
  },
}

export const WithUSDC: Story = {
  args: {
    token: { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', decimals: 6 },
  },
}
