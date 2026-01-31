import { Box, Text, TextVariant, FontWeight, TextColor, FontFamily } from '@metamask/design-system-react'
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
        <Box className="flex" gap={2}>
          <Text variant={TextVariant.BodySm} fontWeight={FontWeight.Medium}>
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
                <Dropdown.Item key={account.address} onClick={() => handleSelect(account, close)}>
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
                </Dropdown.Item>
              ))}
            </Dropdown.Group>
          )
        })
      }
    </Dropdown>
  )
}
