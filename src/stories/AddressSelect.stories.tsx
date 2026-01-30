import type { Meta, StoryObj } from '@storybook/react'
import { AddressSelect } from '../components/AddressSelect'

const meta = {
  title: 'Components/AddressSelect',
  component: AddressSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: (address) => console.log('address changed', address),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddressSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    value: '',
    disabled: false,
  },
}

export const WithValidAddress: Story = {
  args: {
    value: '0x1234567890abcdef1234567890abcdef12345678',
    disabled: false,
  },
}

export const WithContractAddress: Story = {
  args: {
    value: '0x6B175474E89094C44Da98b954EescdcE505d05dF',
    disabled: false,
  },
}

export const WithInvalidAddress: Story = {
  args: {
    value: '0xinvalid1234567890abcdef1234567890abcdef',
    disabled: false,
  },
}

export const WithBlacklistedAddress: Story = {
  args: {
    value: '0xBLACK1234567890abcdef1234567890abcd1111',
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    value: '',
    disabled: true,
  },
}
