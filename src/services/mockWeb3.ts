import { Wallet, Token, TransferRequest, TransferResult } from '../types'
import { validateAddress } from '../validation/addressValidation'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const MOCK_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '2.5', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', balance: '1000.00', decimals: 6 },
  { symbol: 'DAI', name: 'Dai Stablecoin', balance: '500.00', decimals: 18 },
]

let mockWallet: Wallet | null = null
let mockTokens = [...MOCK_TOKENS]

export const web3Service = {
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

    // Validate address using mock accounts system
    const addressValidation = validateAddress(request.to)
    if (!addressValidation.valid) {
      return { success: false, error: addressValidation.error }
    }

    mockTokens[tokenIndex] = {
      ...mockTokens[tokenIndex]!,
      balance: (currentBalance - transferAmount).toFixed(2),
    }

    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
    }
  },
}
