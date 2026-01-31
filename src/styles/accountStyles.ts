import { AccountType } from '../services/mockAccounts'
import type { BackgroundColor, BorderColor, SemanticColor } from '../adapters/types'

// Style configuration using adapter semantic colors
export interface StyleConfig {
  background: BackgroundColor
  text: SemanticColor
  border: BorderColor
}

// Functor: AccountType → StyleConfig
// This is a pure mapping that can be composed/transformed
export const accountTypeStyle = (type: AccountType): StyleConfig => {
  const styles: Record<AccountType, StyleConfig> = {
    eoa: { background: 'successMuted', text: 'success', border: 'success' },
    contract: { background: 'infoMuted', text: 'info', border: 'info' },
    invalid: { background: 'errorMuted', text: 'error', border: 'error' },
    blacklisted: { background: 'warningMuted', text: 'warning', border: 'warning' },
    sanctioned: { background: 'errorMuted', text: 'error', border: 'error' },
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
