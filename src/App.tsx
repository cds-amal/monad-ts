import { useState } from 'react'
import { useWallet } from './hooks/useWallet'
import { WalletButton } from './components/WalletButton'
import { TokenList } from './components/TokenList'
import { TransferForm } from './components/TransferForm'
import { TransferStatus } from './components/TransferStatus'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider, useColors } from './context/ThemeContext'
import { Token, TransferResult } from './types'

function AppContent() {
  const c = useColors()
  const { wallet, tokens, loading, connect, disconnect, refreshTokens } = useWallet()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: c.bg,
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'background-color 0.2s ease',
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
    gap: '12px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: c.text,
    margin: 0,
  }

  const headerRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: c.bgCard,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s ease',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  }

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: c.border,
    margin: '24px 0',
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '48px 24px',
    color: c.textSecondary,
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
          <div style={headerRightStyle}>
            <ThemeToggle />
            <WalletButton
              wallet={wallet}
              loading={loading}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
