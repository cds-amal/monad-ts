import { Wallet, Token, TransferRequest, TransferResult } from '../types'
import { MockAccount, AccountType } from './mockAccounts'
import { AddressValidationResult } from '../validation/addressValidation'

/**
 * Service interface for dependency injection.
 * Components depend on this interface, not concrete implementations.
 */
export interface Services {
  // Wallet operations
  connectWallet: () => Promise<Wallet>
  disconnectWallet: () => Promise<void>
  getWallet: () => Promise<Wallet | null>
  getTokens: () => Promise<Token[]>
  transfer: (request: TransferRequest) => Promise<TransferResult>

  // Address operations
  validateAddress: (address: string) => AddressValidationResult
  getAccounts: () => MockAccount[]
  getAccountByAddress: (address: string) => MockAccount | undefined
  getAccountsByType: (type: AccountType) => MockAccount[]

  // Formatting
  formatAddress: (address: string, maxLength?: number) => string

  // Flag details
  getFlagDetails: (address: string) => { reason: string; details: string } | null
}
