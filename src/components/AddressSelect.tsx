import { useState } from 'react'
import { Box, Text, TextVariant, FontWeight, TextColor, FontFamily } from '@metamask/design-system-react'
import { MOCK_ACCOUNTS, MockAccount, AccountType } from '../services/mockAccounts'
import { AccountBadge, getTypeLabel } from './AccountBadge'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_ORDER: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

function formatAddress(addr: string): string {
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 10)}...${addr.slice(-8)}`
}

function groupAccountsByType(accounts: MockAccount[]): Record<AccountType, MockAccount[]> {
  return accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type]!.push(account)
    return acc
  }, {} as Record<AccountType, MockAccount[]>)
}

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedAccount = MOCK_ACCOUNTS.find(a => a.address === value)
  const groupedAccounts = groupAccountsByType(MOCK_ACCOUNTS)

  const handleSelect = (account: MockAccount) => {
    onChange(account.address)
    setIsOpen(false)
  }

  return (
    <Box className="relative">
      {/* Trigger button */}
      <button
        type="button"
        className={`w-full p-3 text-sm border-2 border-default rounded-lg text-left flex justify-between items-center
          ${disabled ? 'bg-muted cursor-not-allowed' : 'bg-default cursor-pointer'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedAccount ? (
          <Box className="flex" gap={2}>
            <Text variant={TextVariant.BodySm} fontWeight={FontWeight.Medium}>
              {selectedAccount.label}
            </Text>
            <AccountBadge type={selectedAccount.type} />
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

      {/* Dropdown */}
      {isOpen && (
        <Box className="absolute top-full left-0 right-0 mt-1 bg-default border-2 border-default rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {TYPE_ORDER.map(type => {
            const accounts = groupedAccounts[type]
            if (!accounts?.length) return null

            return (
              <Box key={type}>
                <Box className="py-2 px-3 border-b border-default bg-muted">
                  <Text
                    variant={TextVariant.BodyXs}
                    fontWeight={FontWeight.Bold}
                    color={TextColor.TextMuted}
                    className="uppercase tracking-wider"
                  >
                    {getTypeLabel(type)} Addresses
                  </Text>
                </Box>
                {accounts.map(account => (
                  <Box
                    key={account.address}
                    className="py-2.5 px-3 cursor-pointer border-b border-default/50 transition-colors hover:bg-muted"
                    onClick={() => handleSelect(account)}
                  >
                    <Box className="flex" gap={2} marginBottom={1}>
                      <Text variant={TextVariant.BodySm} fontWeight={FontWeight.Medium}>
                        {account.label}
                      </Text>
                      <AccountBadge type={account.type} />
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
