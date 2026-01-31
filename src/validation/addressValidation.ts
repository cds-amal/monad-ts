import { ValidationResult } from './index'
import { AccountType, getAccountByAddress } from '../services/mockAccounts'

// Extended validation result with account type information
export type AddressValidationResult = ValidationResult & { accountType?: AccountType }

export const AddressValidationResult = {
  ok: (accountType: AccountType): AddressValidationResult => ({ valid: true, accountType }),
  err: (error: string, accountType?: AccountType): AddressValidationResult => ({ valid: false, error, accountType }),
}

/**
 * Validates an Ethereum address and returns account type information.
 * Uses the unified ValidationResult monad pattern.
 */
export function validateAddress(address: string): AddressValidationResult {
  const account = getAccountByAddress(address)

  if (account) {
    switch (account.type) {
      case 'invalid':
        return AddressValidationResult.err(`Invalid address: ${account.description}`, 'invalid')
      case 'blacklisted':
        return AddressValidationResult.err(`Address is blacklisted: ${account.description}`, 'blacklisted')
      case 'sanctioned':
        return AddressValidationResult.err(`Address is sanctioned: ${account.description}`, 'sanctioned')
      case 'contract':
        return AddressValidationResult.ok('contract') // Valid but might want to warn
      case 'eoa':
        return AddressValidationResult.ok('eoa')
    }
  }

  // Basic format validation for unknown addresses
  if (!address.startsWith('0x')) {
    return AddressValidationResult.err('Address must start with 0x')
  }
  if (address.length !== 42) {
    return AddressValidationResult.err('Address must be 42 characters')
  }

  return AddressValidationResult.ok('eoa')
}
