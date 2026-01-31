import { AccountType } from '../services/mockAccounts'

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

interface AccountBadgeProps {
  type: AccountType
}

export function AccountBadge({ type }: AccountBadgeProps) {
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${TYPE_COLORS[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  )
}

export function getTypeLabel(type: AccountType): string {
  return TYPE_LABELS[type]
}
