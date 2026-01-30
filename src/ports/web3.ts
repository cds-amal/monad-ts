/**
 * Web3Port - Interface for blockchain interactions.
 * Core defines what operations are needed, adapters implement for specific chains/providers.
 */

// Domain types (platform agnostic)
export interface Wallet {
  address: string
  balance: string
  connected: boolean
}

export interface Token {
  symbol: string
  name: string
  balance: string
  decimals: number
}

export interface TransferRequest {
  to: string
  amount: string
  token: Token
}

export interface TransferResult {
  success: boolean
  txHash?: string
  error?: string
}

// Address validation result
export interface AddressValidation {
  valid: boolean
  error?: string
  accountType?: 'eoa' | 'contract' | 'invalid' | 'blacklisted' | 'sanctioned'
}

// Web3Port interface - what adapters must implement
export interface Web3Port {
  // Wallet operations
  connectWallet(): Promise<Wallet>
  disconnectWallet(): Promise<void>
  getWallet(): Promise<Wallet | null>

  // Token operations
  getTokens(): Promise<Token[]>
  getTokenBalance(token: Token): Promise<string>

  // Transfer operations
  transfer(request: TransferRequest): Promise<TransferResult>
  estimateGas(request: TransferRequest): Promise<string>

  // Address operations
  validateAddress(address: string): AddressValidation
  formatAddress(address: string): string

  // Chain info
  getChainId(): Promise<number>
  getBlockNumber(): Promise<number>
}
