import { usePrimitives } from '../adapters'
import { MockAccount, AccountType } from '../services/mockAccounts'
import { useServices } from '../services/ServicesContext'
import { Dropdown } from './Dropdown'
import { AccountBadge } from './AccountBadge'
import { FlaggedAddressTooltip } from './FlaggedAddressTooltip'
import { groupBy, accountTypeLabel } from '../styles/accountStyles'

const isFlagged = (type: AccountType) => type === 'blacklisted' || type === 'sanctioned'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_ORDER: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const { Box, Text } = usePrimitives()
  const { getAccounts, formatAddress } = useServices()
  const accounts = getAccounts()
  const selectedAccount = accounts.find(a => a.address === value)
  const groupedAccounts = groupBy(accounts, a => a.type)

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
          {isFlagged(account.type) && (
            <FlaggedAddressTooltip address={account.address} />
          )}
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
                    {isFlagged(account.type) && (
                      <FlaggedAddressTooltip address={account.address} />
                    )}
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
