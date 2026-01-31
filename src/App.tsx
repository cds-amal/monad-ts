import { useState } from 'react'
import { usePrimitives } from './adapters'
import { useWallet } from './hooks/useWallet'
import { WalletButton } from './components/WalletButton'
import { TokenList } from './components/TokenList'
import { TransferForm } from './components/TransferForm'
import { TransferStatus } from './components/TransferStatus'
import { ThemeToggle } from './components/ThemeToggle'
import { Token, TransferResult } from './types'

export default function App() {
  const { Box, Text, Button } = usePrimitives()
  const { wallet, tokens, loading, connect, disconnect, refreshTokens } = useWallet()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)

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
    <Box
      style={{ minHeight: '100%' }}
      backgroundColor="alternative"
      paddingVertical={10}
      paddingHorizontal={5}
    >
      <Box style={{ maxWidth: 512, marginHorizontal: 'auto', width: '100%' }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={8}
        >
          <Text variant="headingLg">
            Token Transfer
          </Text>
          <Box flexDirection="row" gap={2} alignItems="center">
            <ThemeToggle />
            <WalletButton
              wallet={wallet}
              loading={loading}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </Box>
        </Box>

        <Box
          backgroundColor="default"
          borderRadius={16}
          padding={6}
          style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}
        >
          {!wallet ? (
            <Box
              flexDirection="column"
              alignItems="center"
              paddingVertical={12}
              paddingHorizontal={6}
              gap={4}
            >
              <Text style={{ fontSize: 48 }}>👛</Text>
              <Box flexDirection="column" gap={2} alignItems="center">
                <Text variant="headingMd">
                  Connect Your Wallet
                </Text>
                <Text variant="bodyMd" color="muted" style={{ textAlign: 'center' }}>
                  Connect your wallet to start transferring tokens
                </Text>
              </Box>
              <Button
                variant="primary"
                size="lg"
                onPress={connect}
                disabled={loading}
                loading={loading}
                loadingText="Connecting"
              >
                Connect Wallet
              </Button>
            </Box>
          ) : (
            <>
              {transferResult && (
                <Box marginBottom={6}>
                  <TransferStatus
                    result={transferResult}
                    onDismiss={() => setTransferResult(null)}
                  />
                </Box>
              )}

              <Box marginBottom={6}>
                <TokenList
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
              </Box>

              <Box
                style={{ height: 1 }}
                backgroundColor="muted"
                marginVertical={6}
              />

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
