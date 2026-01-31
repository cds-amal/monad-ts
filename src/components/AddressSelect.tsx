import { usePrimitives } from '../adapters'
import { MOCK_ACCOUNTS, MockAccount, AccountType } from '../services/mockAccounts'
import { Dropdown } from './Dropdown'
import { AccountBadge } from './AccountBadge'
import { formatAddress, groupBy, accountTypeLabel } from '../styles/accountStyles'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_ORDER: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const { Box, Text } = usePrimitives()
  const selectedAccount = MOCK_ACCOUNTS.find(a => a.address === value)
  const groupedAccounts = groupBy(MOCK_ACCOUNTS, a => a.type)

  const handleSelect = (account: MockAccount, close: () => void) => {
    onChange(account.address)
    close()
  }

  return (
    <Dropdown<MockAccount>
      value={selectedAccount}
      disabled={disabled}
      placeholder="Select recipient..."
      renderTrigger={(account: MockAccount) => (
        <Box flexDirection="row" gap={2} alignItems="center">
          <Text variant="bodySm" fontWeight="medium">
            {account.label}
          </Text>
          <AccountBadge type={account.type} />
        </Box>
      )}
    >
      {close =>
        TYPE_ORDER.map(type => {
          const accounts = groupedAccounts[type]
          if (!accounts?.length) return null

          return (
            <Dropdown.Group key={type} label={`${accountTypeLabel(type)} Addresses`}>
              {accounts.map(account => (
                <Dropdown.Item key={account.address} onPress={() => handleSelect(account, close)}>
                  <Box flexDirection="row" gap={2} alignItems="center" marginBottom={1}>
                    <Text variant="bodySm" fontWeight="medium">
                      {account.label}
                    </Text>
                    <AccountBadge type={account.type} />
                  </Box>
                  <Text variant="bodyXs" color="muted" fontFamily="mono">
                    {formatAddress(account.address)}
                  </Text>
                  <Text variant="bodyXs" color="muted" style={{ marginTop: 2 }}>
                    {account.description}
                  </Text>
                </Dropdown.Item>
              ))}
            </Dropdown.Group>
          )
        })
      }
    </Dropdown>
  )
}
