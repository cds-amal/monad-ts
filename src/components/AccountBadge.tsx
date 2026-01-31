import { AccountType } from '../services/mockAccounts'
import { accountTypeBadgeClass, accountTypeLabel } from '../styles/accountStyles'

interface AccountBadgeProps {
  type: AccountType
}

// Renders account type badge using style functor
export function AccountBadge({ type }: AccountBadgeProps) {
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${accountTypeBadgeClass(type)}`}>
      {accountTypeLabel(type)}
    </span>
  )
}
