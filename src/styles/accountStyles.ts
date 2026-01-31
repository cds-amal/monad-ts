import { AccountType } from '../services/mockAccounts'

// Style configuration - separates data from presentation
export interface StyleConfig {
  bg: string
  text: string
  border: string
}

// Functor: AccountType → StyleConfig
// This is a pure mapping that can be composed/transformed
export const accountTypeStyle = (type: AccountType): StyleConfig => {
  const styles: Record<AccountType, StyleConfig> = {
    eoa: { bg: 'bg-success-muted', text: 'text-success-default', border: 'border-success-default' },
    contract: { bg: 'bg-info-muted', text: 'text-info-default', border: 'border-info-default' },
    invalid: { bg: 'bg-error-muted', text: 'text-error-default', border: 'border-error-default' },
    blacklisted: { bg: 'bg-warning-muted', text: 'text-warning-default', border: 'border-warning-default' },
    sanctioned: { bg: 'bg-error-alternative', text: 'text-error-default', border: 'border-error-default' },
  }
  return styles[type]
}

// Functor: AccountType → label string
export const accountTypeLabel = (type: AccountType): string => {
  const labels: Record<AccountType, string> = {
    eoa: 'Wallet',
    contract: 'Contract',
    invalid: 'Invalid',
    blacklisted: 'Blacklisted',
    sanctioned: 'Sanctioned',
  }
  return labels[type]
}

// Compose style config into className string
export const styleToClassName = (style: StyleConfig): string =>
  `${style.bg} ${style.text} ${style.border}`

// Composed: AccountType → className (functor composition)
export const accountTypeBadgeClass = (type: AccountType): string =>
  styleToClassName(accountTypeStyle(type))

// Pure function: format address with ellipsis
export const formatAddress = (addr: string, maxLength = 16): string =>
  addr.length <= maxLength ? addr : `${addr.slice(0, 10)}...${addr.slice(-8)}`

// Pure function: group items by key (generic, reusable)
export const groupBy = <T, K extends string>(
  items: T[],
  keyFn: (item: T) => K
): Partial<Record<K, T[]>> =>
  items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key]!.push(item)
    return acc
  }, {} as Partial<Record<K, T[]>>)
