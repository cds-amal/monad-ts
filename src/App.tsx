import { useState } from 'react'
import { AdapterProvider, useStyle } from './context'
import { Box, VStack, Flex, Divider } from './adapters/browser'
import { useWallet } from './hooks/useWallet'
import { WalletButton } from './components/WalletButton'
import { TokenList } from './components/TokenList'
import { TransferForm } from './components/TransferForm'
import { TransferStatus } from './components/TransferStatus'
import { Token, TransferResult } from './ports'

function AppContent() {
  const style = useStyle()
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
    <Box styles={style.page()}>
      <Box styles={style.container()}>
        {/* Header */}
        <Flex justify="between" align="center" styles={{ marginBottom: '32px' }}>
          <Box as="h1" styles={style.heading()}>
            Token Transfer
          </Box>
          <WalletButton
            wallet={wallet}
            loading={loading}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </Flex>

        {/* Card */}
        <Box styles={style.card()}>
          {!wallet ? (
            <Box styles={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
              Connect your wallet to start transferring tokens
            </Box>
          ) : (
            <VStack gap={6}>
              {transferResult && (
                <TransferStatus
                  result={transferResult}
                  onDismiss={() => setTransferResult(null)}
                />
              )}

              <TokenList
                tokens={tokens}
                selectedToken={selectedToken}
                onSelectToken={setSelectedToken}
              />

              <Divider />

              <TransferForm
                token={selectedToken}
                onTransferComplete={handleTransferComplete}
              />
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <AdapterProvider>
      <AppContent />
    </AdapterProvider>
  )
}
