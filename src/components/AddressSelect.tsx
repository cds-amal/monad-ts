import { useState } from 'react'
import { MOCK_ACCOUNTS, MockAccount, AccountType } from '../services/mockAccounts'
import { useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_COLORS: Record<AccountType, { bg: string; text: string; border: string }> = {
  eoa: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
  contract: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  invalid: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
  blacklisted: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  sanctioned: { bg: '#fce7f3', text: '#9d174d', border: '#ec4899' },
}

const TYPE_LABELS: Record<AccountType, string> = {
  eoa: 'Wallet',
  contract: 'Contract',
  invalid: 'Invalid',
  blacklisted: 'Blacklisted',
  sanctioned: 'Sanctioned',
}

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const { Box, Text, Pressable, ScrollBox } = useRender()
  const { normalize, monoFont } = useStyle()
  const c = useColors()
  const [isOpen, setIsOpen] = useState(false)

  const selectedAccount = MOCK_ACCOUNTS.find(a => a.address === value)

  const containerStyle = normalize({
    position: 'relative',
    zIndex: isOpen ? 50 : 1,
  })

  const buttonStyle = normalize({
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: 8,
    backgroundColor: disabled ? c.bgDisabled : c.bgInput,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  })

  const dropdownStyle = normalize({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: c.bgCard,
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: 8,
    maxHeight: 300,
    overflow: 'hidden',
  })

  const groupLabelStyle = normalize({
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: c.bgHover,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  })

  const groupLabelTextStyle = normalize({
    fontSize: 11,
    fontWeight: '700',
    color: c.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  })

  const optionStyle = normalize({
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    backgroundColor: c.bgCard,
  })

  const optionLabelStyle = normalize({
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  })

  const addressTextStyle = normalize({
    fontFamily: monoFont(),
    fontSize: 12,
    color: c.textSecondary,
  })

  const getBadgeStyle = (type: AccountType) => normalize({
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: TYPE_COLORS[type].bg,
    borderWidth: 1,
    borderColor: TYPE_COLORS[type].border,
  })

  const getBadgeTextStyle = (type: AccountType) => normalize({
    fontSize: 10,
    fontWeight: '600',
    color: TYPE_COLORS[type].text,
  })

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
    <Box style={containerStyle}>
      <Pressable
        style={buttonStyle}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedAccount ? (
          <Box style={normalize({ flexDirection: 'row', alignItems: 'center', gap: 8 })}>
            <Text style={normalize({ fontWeight: '500', color: c.text })}>{selectedAccount.label}</Text>
            <Box style={getBadgeStyle(selectedAccount.type)}>
              <Text style={getBadgeTextStyle(selectedAccount.type)}>
                {TYPE_LABELS[selectedAccount.type]}
              </Text>
            </Box>
          </Box>
        ) : (
          <Text style={normalize({ color: c.textMuted })}>Select recipient...</Text>
        )}
        <Text style={normalize({ color: c.textMuted })}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {isOpen && (
        <Box style={dropdownStyle}>
          <ScrollBox style={normalize({ maxHeight: 296 })}>
            {typeOrder.map(type => {
              const accounts = groupedAccounts[type]
              if (!accounts?.length) return null

              return (
                <Box key={type}>
                  <Box style={groupLabelStyle}>
                    <Text style={groupLabelTextStyle}>
                      {TYPE_LABELS[type]} Addresses
                    </Text>
                  </Box>
                  {accounts.map(account => (
                    <Pressable
                      key={account.address}
                      style={optionStyle}
                      onPress={() => handleSelect(account)}
                    >
                      <Box style={optionLabelStyle}>
                        <Text style={normalize({ fontWeight: '500', color: c.text })}>{account.label}</Text>
                        <Box style={getBadgeStyle(account.type)}>
                          <Text style={getBadgeTextStyle(account.type)}>
                            {TYPE_LABELS[account.type]}
                          </Text>
                        </Box>
                      </Box>
                      <Text style={addressTextStyle}>{formatAddress(account.address)}</Text>
                      <Text style={normalize({ fontSize: 11, color: c.textMuted, marginTop: 2 })}>
                        {account.description}
                      </Text>
                    </Pressable>
                  ))}
                </Box>
              )
            })}
          </ScrollBox>
        </Box>
      )}
    </Box>
  )
}
