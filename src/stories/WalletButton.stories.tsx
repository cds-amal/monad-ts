import type { Meta, StoryObj } from '@storybook/react'
import { WalletButton } from '../components/WalletButton'

const meta = {
  title: 'Components/WalletButton',
  component: WalletButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onConnect: () => console.log('connect'),
    onDisconnect: () => console.log('disconnect'),
  },
} satisfies Meta<typeof WalletButton>

export default meta
type Story = StoryObj<typeof meta>

export const Disconnected: Story = {
  args: {
    wallet: null,
    loading: false,
  },
}

export const Connecting: Story = {
  args: {
    wallet: null,
    loading: true,
  },
}

export const Connected: Story = {
  args: {
    wallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78',
      balance: '2.5 ETH',
      connected: true,
    },
    loading: false,
  },
}

export const Disconnecting: Story = {
  args: {
    wallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78',
      balance: '2.5 ETH',
      connected: true,
    },
    loading: true,
  },
}
