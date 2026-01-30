import { useState } from 'react'
import { useStyle } from '../context'
import { Box, HStack, Flex } from '../adapters/browser'
import { MOCK_ACCOUNTS, AccountType, MockAccount } from '../adapters/browser'
import { ColorIntent } from '../ports'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

// Map account types to semantic intents
const typeToIntent: Record<AccountType, ColorIntent> = {
  eoa: 'success',
  contract: 'primary',
  invalid: 'error',
  blacklisted: 'warning',
  sanctioned: 'error',
}

const TYPE_LABELS: Record<AccountType, string> = {
  eoa: 'Wallet',
  contract: 'Contract',
  invalid: 'Invalid',
  blacklisted: 'Blacklisted',
  sanctioned: 'Sanctioned',
}

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const style = useStyle()
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

  const groupedAccounts = MOCK_ACCOUNTS.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type]!.push(account)
    return acc
  }, {} as Record<AccountType, MockAccount[]>)

  const typeOrder: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

  return (
    <Box styles={style.dropdownContainer()}>
      <Flex
        as="button"
        justify="between"
        align="center"
        styles={style.dropdownTrigger({ disabled })}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedAccount ? (
          <HStack gap={2}>
            <Box as="span" styles={{ fontWeight: 500 }}>
              {selectedAccount.label}
            </Box>
            <Box as="span" styles={style.badge({ intent: typeToIntent[selectedAccount.type], size: 'sm' })}>
              {TYPE_LABELS[selectedAccount.type]}
            </Box>
          </HStack>
        ) : (
          <Box as="span" styles={{ color: '#9ca3af' }}>
            Select recipient...
          </Box>
        )}
        <Box as="span" styles={{ color: '#9ca3af' }}>
          {isOpen ? '▲' : '▼'}
        </Box>
      </Flex>

      {isOpen && (
        <Box styles={style.dropdownMenu()}>
          {typeOrder.map(type => {
            const accounts = groupedAccounts[type]
            if (!accounts?.length) return null

            return (
              <Box key={type}>
                <Box styles={style.dropdownGroup()}>
                  {TYPE_LABELS[type]} Addresses
                </Box>
                {accounts.map(account => (
                  <Box
                    key={account.address}
                    styles={style.dropdownItem()}
                    onClick={() => handleSelect(account)}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'white'
                    }}
                  >
                    <HStack gap={2} styles={{ marginBottom: '4px' }}>
                      <Box as="span" styles={{ fontWeight: 500 }}>
                        {account.label}
                      </Box>
                      <Box as="span" styles={style.badge({ intent: typeToIntent[account.type], size: 'sm' })}>
                        {TYPE_LABELS[account.type]}
                      </Box>
                    </HStack>
                    <Box styles={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                      {formatAddress(account.address)}
                    </Box>
                    <Box styles={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {account.description}
                    </Box>
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
