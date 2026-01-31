import { usePrimitives } from '../adapters'
import { AccountType } from '../services/mockAccounts'
import { accountTypeStyle, accountTypeLabel } from '../styles/accountStyles'

interface AccountBadgeProps {
  type: AccountType
}

// Renders account type badge using style functor
export function AccountBadge({ type }: AccountBadgeProps) {
  const { Box, Text } = usePrimitives()
  const style = accountTypeStyle(type)

  return (
    <Box
      paddingVertical={1}
      paddingHorizontal={2}
      borderRadius={4}
      borderWidth={1}
      backgroundColor={style.background}
      borderColor={style.border}
    >
      <Text variant="bodyXs" fontWeight="semibold" color={style.text}>
        {accountTypeLabel(type)}
      </Text>
    </Box>
  )
}
