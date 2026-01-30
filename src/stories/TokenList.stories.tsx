import type { Meta, StoryObj } from '@storybook/react'
import { TokenList } from '../components/TokenList'

const MOCK_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', balance: '2.5', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', decimals: 6 },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '500.00', decimals: 18 },
]

const meta = {
  title: 'Components/TokenList',
  component: TokenList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelectToken: (token) => console.log('selected', token),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tokens: MOCK_TOKENS,
    selectedToken: null,
  },
}

export const WithSelection: Story = {
  args: {
    tokens: MOCK_TOKENS,
    selectedToken: MOCK_TOKENS[0]!,
  },
}

export const SingleToken: Story = {
  args: {
    tokens: [MOCK_TOKENS[0]!],
    selectedToken: null,
  },
}

export const Empty: Story = {
  args: {
    tokens: [],
    selectedToken: null,
  },
}
