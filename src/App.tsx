import { useState } from 'react'
import { Box, Text, BoxBackgroundColor, BoxAlignItems, BoxJustifyContent, TextVariant, TextColor } from '@metamask/design-system-react'
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
      className="min-h-screen"
      backgroundColor={BoxBackgroundColor.BackgroundAlternative}
      paddingVertical={10}
      paddingHorizontal={5}
    >
      <Box className="max-w-lg mx-auto">
        <Box
          className="flex"
          justifyContent={BoxJustifyContent.Between}
          alignItems={BoxAlignItems.Center}
          marginBottom={8}
        >
          <h1>
            <Text variant={TextVariant.HeadingLg}>
              Token Transfer
            </Text>
          </h1>
          <WalletButton
            wallet={wallet}
            loading={loading}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </Box>

        <Box
          backgroundColor={BoxBackgroundColor.BackgroundDefault}
          className="rounded-2xl shadow-md"
          padding={6}
        >
          {!wallet ? (
            <Box className="text-center" paddingVertical={12} paddingHorizontal={6}>
              <Text variant={TextVariant.BodyMd} color={TextColor.TextMuted}>
                Connect your wallet to start transferring tokens
              </Text>
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

              <Box className="h-px bg-border-muted" marginVertical={6} />

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
