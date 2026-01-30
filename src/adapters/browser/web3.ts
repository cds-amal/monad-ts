/**
 * Browser Web3Adapter - Mock implementation for development/testing.
 * In production, this would use ethers.js, viem, or wagmi.
 */

import { Web3Port, Wallet, Token, TransferRequest, TransferResult, AddressValidation } from '../../ports'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock account types for testing different scenarios
export type AccountType = 'eoa' | 'contract' | 'invalid' | 'blacklisted' | 'sanctioned'

export interface MockAccount {
  address: string
  label: string
  type: AccountType
  description: string
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  // Valid EOA accounts
  { address: '0x1234567890abcdef1234567890abcdef12345678', label: 'Alice', type: 'eoa', description: 'Valid wallet address' },
  { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', label: 'Bob', type: 'eoa', description: 'Valid wallet address' },
  { address: '0x9876543210fedcba9876543210fedcba98765432', label: 'Charlie', type: 'eoa', description: 'Valid wallet address' },

  // Contract addresses
  { address: '0x6B175474E89094C44Da98b954EescdcE505d05dF', label: 'DAI Contract', type: 'contract', description: 'ERC-20 token contract' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', label: 'USDC Contract', type: 'contract', description: 'ERC-20 token contract' },
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', label: 'Uniswap Router', type: 'contract', description: 'DEX router contract' },

  // Invalid addresses
  { address: '0xinvalid1234567890abcdef1234567890abcdef', label: 'Bad Checksum', type: 'invalid', description: 'Invalid checksum' },
  { address: '0x123', label: 'Too Short', type: 'invalid', description: 'Address too short' },
  { address: '1234567890abcdef1234567890abcdef12345678', label: 'Missing Prefix', type: 'invalid', description: 'Missing 0x prefix' },

  // Blacklisted addresses
  { address: '0xBLACK1234567890abcdef1234567890abcd1111', label: 'Flagged Wallet', type: 'blacklisted', description: 'Flagged for suspicious activity' },
  { address: '0xBLACK9876543210fedcba9876543210fedc2222', label: 'Reported Scammer', type: 'blacklisted', description: 'Reported phishing address' },

  // Sanctioned addresses
  { address: '0x8589427373D6D84E98730D7795D8f6f8731FDA16', label: 'Tornado Cash', type: 'sanctioned', description: 'OFAC sanctioned address' },
  { address: '0xSANC7890abcdef1234567890abcdef1234567890', label: 'Sanctioned Entity', type: 'sanctioned', description: 'Government sanctions list' },
]

// Initial mock state
const MOCK_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '2.5', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', decimals: 6 },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '500.00', decimals: 18 },
]

let mockWallet: Wallet | null = null
let mockTokens = [...MOCK_TOKENS]

// Helper to find account by address
const getAccountByAddress = (address: string): MockAccount | undefined =>
  MOCK_ACCOUNTS.find(a => a.address.toLowerCase() === address.toLowerCase())

// Browser Web3 adapter (mock implementation)
export const browserWeb3Adapter: Web3Port = {
  async connectWallet(): Promise<Wallet> {
    await delay(800)
    mockWallet = {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78',
      balance: '2.5 ETH',
      connected: true,
    }
    return mockWallet
  },

  async disconnectWallet(): Promise<void> {
    await delay(300)
    mockWallet = null
  },

  async getWallet(): Promise<Wallet | null> {
    return mockWallet
  },

  async getTokens(): Promise<Token[]> {
    await delay(400)
    return mockTokens
  },

  async getTokenBalance(token: Token): Promise<string> {
    const found = mockTokens.find(t => t.symbol === token.symbol)
    return found?.balance ?? '0'
  },

  async transfer(request: TransferRequest): Promise<TransferResult> {
    await delay(1500)

    const tokenIndex = mockTokens.findIndex(t => t.symbol === request.token.symbol)
    if (tokenIndex === -1) {
      return { success: false, error: 'Token not found' }
    }

    const currentBalance = parseFloat(mockTokens[tokenIndex]!.balance)
    const transferAmount = parseFloat(request.amount)

    if (transferAmount > currentBalance) {
      return { success: false, error: 'Insufficient balance' }
    }

    // Validate address
    const validation = this.validateAddress(request.to)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Update balance
    mockTokens[tokenIndex] = {
      ...mockTokens[tokenIndex]!,
      balance: (currentBalance - transferAmount).toFixed(2),
    }

    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
    }
  },

  async estimateGas(_request: TransferRequest): Promise<string> {
    await delay(200)
    return '21000'
  },

  validateAddress(address: string): AddressValidation {
    const account = getAccountByAddress(address)

    if (account) {
      switch (account.type) {
        case 'invalid':
          return { valid: false, error: `Invalid address: ${account.description}`, accountType: 'invalid' }
        case 'blacklisted':
          return { valid: false, error: `Address is blacklisted: ${account.description}`, accountType: 'blacklisted' }
        case 'sanctioned':
          return { valid: false, error: `Address is sanctioned: ${account.description}`, accountType: 'sanctioned' }
        case 'contract':
          return { valid: true, accountType: 'contract' }
        case 'eoa':
          return { valid: true, accountType: 'eoa' }
      }
    }

    // Basic format validation for unknown addresses
    if (!address.startsWith('0x')) {
      return { valid: false, error: 'Address must start with 0x' }
    }
    if (address.length !== 42) {
      return { valid: false, error: 'Address must be 42 characters' }
    }

    return { valid: true, accountType: 'eoa' }
  },

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  async getChainId(): Promise<number> {
    return 1 // Mainnet
  },

  async getBlockNumber(): Promise<number> {
    return 12345678
  },
}

// Export mock accounts for UI
export { getAccountByAddress }
