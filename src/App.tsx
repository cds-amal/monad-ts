import { useState } from 'react'
import { useWallet } from './hooks/useWallet'
import { WalletButton } from './components/WalletButton'
import { TokenList } from './components/TokenList'
import { TransferForm } from './components/TransferForm'
import { TransferStatus } from './components/TransferStatus'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider, useColors } from './context/ThemeContext'
import { useRender, useStyle } from './context/AdapterContext'
import { Token, TransferResult } from './types'

function AppContent() {
  const { Box, Text } = useRender()
  const { normalize, select } = useStyle()
  const c = useColors()
  const { wallet, tokens, loading, connect, disconnect, refreshTokens } = useWallet()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)

  const appStyle = normalize({
    flex: 1,
    backgroundColor: c.bg,
    padding: 20,
    paddingTop: 60,
  })

  const containerStyle = normalize({
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  })

  const headerStyle = normalize({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
    ...select({ native: { flexWrap: 'wrap' } }),
  })

  const titleStyle = normalize({
    fontSize: 24,
    fontWeight: '700',
    color: c.text,
    ...select({ native: { flexShrink: 1 } }),
  })

  const headerRightStyle = normalize({
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  })

  const cardStyle = normalize({
    backgroundColor: c.bgCard,
    borderRadius: 16,
    padding: 24,
  })

  const sectionStyle = normalize({
    marginBottom: 24,
  })

  const dividerStyle = normalize({
    height: 1,
    backgroundColor: c.border,
    marginVertical: 24,
  })

  const emptyStateStyle = normalize({
    alignItems: 'center',
    padding: 48,
  })

  const emptyTextStyle = normalize({
    color: c.textSecondary,
    textAlign: 'center',
  })

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
    <Box style={appStyle}>
      <Box style={containerStyle}>
        <Box style={headerStyle}>
          <Text style={titleStyle}>Token Transfer</Text>
          <Box style={headerRightStyle}>
            <ThemeToggle />
            <WalletButton
              wallet={wallet}
              loading={loading}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </Box>
        </Box>

        <Box style={cardStyle}>
          {!wallet ? (
            <Box style={emptyStateStyle}>
              <Text style={emptyTextStyle}>
                Connect your wallet to start transferring tokens
              </Text>
            </Box>
          ) : (
            <>
              {transferResult && (
                <Box style={sectionStyle}>
                  <TransferStatus
                    result={transferResult}
                    onDismiss={() => setTransferResult(null)}
                  />
                </Box>
              )}

              <Box style={sectionStyle}>
                <TokenList
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </Box>

              <Box style={dividerStyle} />

              <TransferForm
                token={selectedToken}
                onTransferComplete={handleTransferComplete}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
