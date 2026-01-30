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
