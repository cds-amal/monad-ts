import type { Services } from './types'
import { web3Service } from './mockWeb3'
import { MOCK_ACCOUNTS, getAccountByAddress, getAccountsByType } from './mockAccounts'
import { validateAddress } from '../validation/addressValidation'
import { formatAddress } from '../styles/accountStyles'

/**
 * Default services implementation using mock data.
 * In production, this could be swapped for real web3 implementations.
 */
export const defaultServices: Services = {
  // Wallet operations (delegating to web3Service)
  connectWallet: () => web3Service.connectWallet(),
  disconnectWallet: () => web3Service.disconnectWallet(),
  getWallet: () => web3Service.getWallet(),
  getTokens: () => web3Service.getTokens(),
  transfer: (request) => web3Service.transfer(request),

  // Address operations
  validateAddress,
  getAccounts: () => MOCK_ACCOUNTS,
  getAccountByAddress,
  getAccountsByType,

  // Formatting (using the shared implementation from accountStyles)
  formatAddress,
}
