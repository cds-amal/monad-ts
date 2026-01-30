export type AccountType = 'eoa' | 'contract' | 'invalid' | 'blacklisted' | 'sanctioned'

export interface MockAccount {
  address: string
  label: string
  type: AccountType
  description: string
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  // Valid EOA accounts
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    label: 'Alice',
    type: 'eoa',
    description: 'Valid wallet address',
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    label: 'Bob',
    type: 'eoa',
    description: 'Valid wallet address',
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    label: 'Charlie',
    type: 'eoa',
    description: 'Valid wallet address',
  },

  // Contract addresses
  {
    address: '0x6B175474E89094C44Da98b954EescdcE505d05dF',
    label: 'DAI Contract',
    type: 'contract',
    description: 'ERC-20 token contract',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    label: 'USDC Contract',
    type: 'contract',
    description: 'ERC-20 token contract',
  },
  {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    label: 'Uniswap Router',
    type: 'contract',
    description: 'DEX router contract',
  },

  // Invalid addresses (checksum failures, wrong length, etc.)
  {
    address: '0xinvalid1234567890abcdef1234567890abcdef',
    label: 'Bad Checksum',
    type: 'invalid',
    description: 'Invalid checksum',
  },
  {
    address: '0x123',
    label: 'Too Short',
    type: 'invalid',
    description: 'Address too short',
  },
  {
    address: '1234567890abcdef1234567890abcdef12345678',
    label: 'Missing Prefix',
    type: 'invalid',
    description: 'Missing 0x prefix',
  },

  // Blacklisted addresses (internal policy)
  {
    address: '0xBLACK1234567890abcdef1234567890abcd1111',
    label: 'Flagged Wallet',
    type: 'blacklisted',
    description: 'Flagged for suspicious activity',
  },
  {
    address: '0xBLACK9876543210fedcba9876543210fedc2222',
    label: 'Reported Scammer',
    type: 'blacklisted',
    description: 'Reported phishing address',
  },

  // Sanctioned addresses (OFAC, etc.)
  {
    address: '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
    label: 'Tornado Cash',
    type: 'sanctioned',
    description: 'OFAC sanctioned address',
  },
  {
    address: '0xSANC7890abcdef1234567890abcdef1234567890',
    label: 'Sanctioned Entity',
    type: 'sanctioned',
    description: 'Government sanctions list',
  },
]

export function getAccountsByType(type: AccountType): MockAccount[] {
  return MOCK_ACCOUNTS.filter(a => a.type === type)
}

export function getAccountByAddress(address: string): MockAccount | undefined {
  return MOCK_ACCOUNTS.find(a => a.address.toLowerCase() === address.toLowerCase())
}

export function validateAddress(address: string): { valid: boolean; error?: string; accountType?: AccountType } {
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
        return { valid: true, accountType: 'contract' } // Valid but might want to warn
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
}
