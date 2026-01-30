#!/bin/bash

# Token Transfer App Scaffolding Script
# Creates a React + TypeScript + Vite project with mocked Web3

set -e

echo "🚀 Scaffolding Token Transfer App..."

# Create directory structure
mkdir -p src/components
mkdir -p src/services
mkdir -p src/types
mkdir -p src/hooks

# Create package.json
cat > package.json << 'EOF'
{
  "name": "token-transfer-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "~5.6.2",
    "vite": "^6.0.1"
  }
}
EOF

# Create vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"]
}
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Token Transfer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create src/main.tsx
cat > src/main.tsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# Create src/vite-env.d.ts
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />
EOF

# Create types
cat > src/types/index.ts << 'EOF'
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
EOF

# Create mock Web3 service
cat > src/services/mockWeb3.ts << 'EOF'
import { Wallet, Token, TransferRequest, TransferResult } from '../types'

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

    if (!request.to.startsWith('0x') || request.to.length !== 42) {
      return { success: false, error: 'Invalid recipient address' }
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

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },
}
EOF

# Create useWallet hook
cat > src/hooks/useWallet.ts << 'EOF'
import { useState, useCallback } from 'react'
import { Wallet, Token } from '../types'
import { web3Service } from '../services/mockWeb3'

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const connectedWallet = await web3Service.connectWallet()
      setWallet(connectedWallet)
      const walletTokens = await web3Service.getTokens()
      setTokens(walletTokens)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    setLoading(true)
    try {
      await web3Service.disconnectWallet()
      setWallet(null)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTokens = useCallback(async () => {
    if (!wallet) return
    const walletTokens = await web3Service.getTokens()
    setTokens(walletTokens)
  }, [wallet])

  return {
    wallet,
    tokens,
    loading,
    error,
    connect,
    disconnect,
    refreshTokens,
  }
}
EOF

# Create WalletButton component
cat > src/components/WalletButton.tsx << 'EOF'
import { Wallet } from '../types'
import { web3Service } from '../services/mockWeb3'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'wait' : 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: wallet ? '#ef4444' : '#3b82f6',
    color: 'white',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  const addressStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
  }

  if (wallet) {
    return (
      <div style={containerStyle}>
        <span style={addressStyle}>
          {web3Service.formatAddress(wallet.address)}
        </span>
        <button
          style={buttonStyle}
          onClick={onDisconnect}
          disabled={loading}
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    )
  }

  return (
    <button
      style={buttonStyle}
      onClick={onConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
EOF

# Create TokenList component
cat > src/components/TokenList.tsx << 'EOF'
import { Token } from '../types'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  }

  const getTokenStyle = (token: Token): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: selectedToken?.symbol === token.symbol ? '#dbeafe' : '#f9fafb',
    border: selectedToken?.symbol === token.symbol ? '2px solid #3b82f6' : '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  })

  const tokenInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const tokenSymbolStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
  }

  const tokenNameStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  }

  const balanceStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#111827',
  }

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>Select Token</span>
      {tokens.map(token => (
        <div
          key={token.symbol}
          style={getTokenStyle(token)}
          onClick={() => onSelectToken(token)}
        >
          <div style={tokenInfoStyle}>
            <span style={tokenSymbolStyle}>{token.symbol}</span>
            <span style={tokenNameStyle}>{token.name}</span>
          </div>
          <span style={balanceStyle}>{token.balance}</span>
        </div>
      ))}
    </div>
  )
}
EOF

# Create TransferForm component
cat > src/components/TransferForm.tsx << 'EOF'
import { useState } from 'react'
import { Token, TransferResult } from '../types'
import { web3Service } from '../services/mockWeb3'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  }

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: !token || loading ? 'not-allowed' : 'pointer',
    backgroundColor: !token || loading ? '#9ca3af' : '#10b981',
    color: 'white',
    marginTop: '8px',
    transition: 'all 0.2s ease',
  }

  const maxButtonStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#e5e7eb',
    color: '#374151',
  }

  const amountHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    try {
      const result = await web3Service.transfer({
        to: recipient,
        amount,
        token,
      })
      onTransferComplete(result)
      if (result.success) {
        setRecipient('')
        setAmount('')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMaxClick = () => {
    if (token) {
      setAmount(token.balance)
    }
  }

  return (
    <form style={containerStyle} onSubmit={handleSubmit}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Recipient Address</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          disabled={!token || loading}
        />
      </div>
      <div style={inputGroupStyle}>
        <div style={amountHeaderStyle}>
          <label style={labelStyle}>Amount {token && `(${token.symbol})`}</label>
          {token && (
            <button type="button" style={maxButtonStyle} onClick={handleMaxClick}>
              MAX
            </button>
          )}
        </div>
        <input
          style={inputStyle}
          type="number"
          step="any"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={!token || loading}
        />
      </div>
      <button style={buttonStyle} type="submit" disabled={!token || loading}>
        {loading ? 'Sending...' : `Send ${token?.symbol || 'Tokens'}`}
      </button>
    </form>
  )
}
EOF

# Create TransferStatus component
cat > src/components/TransferStatus.tsx << 'EOF'
import { TransferResult } from '../types'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  if (!result) return null

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: result.success ? '#d1fae5' : '#fee2e2',
    border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  }

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: result.success ? '#065f46' : '#991b1b',
  }

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: result.success ? '#047857' : '#b91c1c',
    fontFamily: result.txHash ? 'monospace' : 'inherit',
    wordBreak: 'break-all',
  }

  const dismissStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: result.success ? '#065f46' : '#991b1b',
    fontWeight: 600,
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <span style={titleStyle}>
          {result.success ? 'Transfer Successful!' : 'Transfer Failed'}
        </span>
        <span style={messageStyle}>
          {result.success ? `TX: ${result.txHash}` : result.error}
        </span>
      </div>
      <button style={dismissStyle} onClick={onDismiss}>
        ✕
      </button>
    </div>
  )
}
EOF

# Create main App component
cat > src/App.tsx << 'EOF'
import { useState } from 'react'
import { useWallet } from './hooks/useWallet'
import { WalletButton } from './components/WalletButton'
import { TokenList } from './components/TokenList'
import { TransferForm } from './components/TransferForm'
import { TransferStatus } from './components/TransferStatus'
import { Token, TransferResult } from './types'

export default function App() {
  const { wallet, tokens, loading, connect, disconnect, refreshTokens } = useWallet()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '480px',
    margin: '0 auto',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  }

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '24px 0',
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#6b7280',
  }

  const handleTransferComplete = (result: TransferResult) => {
    setTransferResult(result)
    if (result.success) {
      refreshTokens()
      const updatedToken = tokens.find(t => t.symbol === selectedToken?.symbol)
      if (updatedToken) {
        setSelectedToken(updatedToken)
      }
    }
  }

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Token Transfer</h1>
          <WalletButton
            wallet={wallet}
            loading={loading}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </header>

        <div style={cardStyle}>
          {!wallet ? (
            <div style={emptyStateStyle}>
              Connect your wallet to start transferring tokens
            </div>
          ) : (
            <>
              {transferResult && (
                <div style={sectionStyle}>
                  <TransferStatus
                    result={transferResult}
                    onDismiss={() => setTransferResult(null)}
                  />
                </div>
              )}

              <div style={sectionStyle}>
                <TokenList
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </div>

              <div style={dividerStyle} />

              <TransferForm
                token={selectedToken}
                onTransferComplete={handleTransferComplete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
EOF

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Scaffolding complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
