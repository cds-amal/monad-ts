import type { Meta, StoryObj } from '@storybook/react'
import { TransferStatus } from '../components/TransferStatus'

const meta = {
  title: 'Components/TransferStatus',
  component: TransferStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onDismiss: () => console.log('dismiss'),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransferStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    result: {
      success: true,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
  },
}

export const Error: Story = {
  args: {
    result: {
      success: false,
      error: 'Insufficient balance',
    },
  },
}

export const ValidationError: Story = {
  args: {
    result: {
      success: false,
      error: 'Address is blacklisted: Flagged for suspicious activity',
    },
  },
}

export const Hidden: Story = {
  args: {
    result: null,
  },
}
