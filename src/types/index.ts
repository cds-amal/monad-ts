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
