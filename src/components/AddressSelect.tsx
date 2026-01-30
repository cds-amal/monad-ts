import { useState } from 'react'
import { Box, Text, TextVariant, FontWeight, TextColor, FontFamily } from '@metamask/design-system-react'
import { MOCK_ACCOUNTS, MockAccount, AccountType } from '../services/mockAccounts'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_COLORS: Record<AccountType, string> = {
  eoa: 'bg-success-muted text-success-default border-success-default',
  contract: 'bg-info-muted text-info-default border-info-default',
  invalid: 'bg-error-muted text-error-default border-error-default',
  blacklisted: 'bg-warning-muted text-warning-default border-warning-default',
  sanctioned: 'bg-error-alternative text-error-default border-error-default',
}

const TYPE_LABELS: Record<AccountType, string> = {
  eoa: 'Wallet',
  contract: 'Contract',
  invalid: 'Invalid',
  blacklisted: 'Blacklisted',
  sanctioned: 'Sanctioned',
}

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedAccount = MOCK_ACCOUNTS.find(a => a.address === value)

  const handleSelect = (account: MockAccount) => {
    onChange(account.address)
    setIsOpen(false)
  }

  const formatAddress = (addr: string) => {
    if (addr.length <= 16) return addr
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  // Group accounts by type for organized display
  const groupedAccounts = MOCK_ACCOUNTS.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type]!.push(account)
    return acc
  }, {} as Record<AccountType, MockAccount[]>)

  const typeOrder: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

  return (
    <Box className="relative">
      <button
        type="button"
        className={`w-full p-3 text-sm border-2 border-gray-200 rounded-lg text-left flex justify-between items-center ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedAccount ? (
          <Box className="flex" gap={2}>
            <Text variant={TextVariant.BodySm} fontWeight={FontWeight.Medium}>
              {selectedAccount.label}
            </Text>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${TYPE_COLORS[selectedAccount.type]}`}>
              {TYPE_LABELS[selectedAccount.type]}
            </span>
          </Box>
        ) : (
          <Text variant={TextVariant.BodySm} color={TextColor.TextMuted}>
            Select recipient...
          </Text>
        )}
        <Text variant={TextVariant.BodySm} color={TextColor.TextMuted}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </button>

      {isOpen && (
        <Box className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {typeOrder.map(type => {
            const accounts = groupedAccounts[type]
            if (!accounts?.length) return null

            return (
              <Box key={type}>
                <Box className="py-2 px-3 border-b border-gray-200 bg-gray-50">
                  <Text
                    variant={TextVariant.BodyXs}
                    fontWeight={FontWeight.Bold}
                    color={TextColor.TextMuted}
                    className="uppercase tracking-wider"
                  >
                    {TYPE_LABELS[type]} Addresses
                  </Text>
                </Box>
                {accounts.map(account => (
                  <Box
                    key={account.address}
                    className="py-2.5 px-3 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                    onClick={() => handleSelect(account)}
                  >
                    <Box className="flex" gap={2} marginBottom={1}>
                      <Text variant={TextVariant.BodySm} fontWeight={FontWeight.Medium}>
                        {account.label}
                      </Text>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${TYPE_COLORS[account.type]}`}>
                        {TYPE_LABELS[account.type]}
                      </span>
                    </Box>
                    <Text
                      variant={TextVariant.BodyXs}
                      color={TextColor.TextMuted}
                      fontFamily={FontFamily.Default}
                      className="font-mono"
                    >
                      {formatAddress(account.address)}
                    </Text>
                    <Text variant={TextVariant.BodyXs} color={TextColor.TextMuted} className="mt-0.5">
                      {account.description}
                    </Text>
                  </Box>
                ))}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
