import { usePrimitives } from '../adapters'
import { Wallet } from '../types'
import { web3Service } from '../services/mockWeb3'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const { Box, Text, Button } = usePrimitives()

  if (wallet) {
    return (
      <Box flexDirection="row" gap={3} alignItems="center">
        <Box
          paddingVertical={2}
          paddingHorizontal={4}
          borderRadius={8}
          backgroundColor="muted"
        >
          <Text variant="bodySm" fontFamily="mono">
            {web3Service.formatAddress(wallet.address)}
          </Text>
        </Box>
        <Button
          variant="danger"
          size="md"
          onPress={onDisconnect}
          disabled={loading}
          loading={loading}
          loadingText="Disconnecting"
        >
          Disconnect
        </Button>
      </Box>
    )
  }

  return (
    <Button
      variant="primary"
      size="md"
      onPress={onConnect}
      disabled={loading}
      loading={loading}
      loadingText="Connecting"
    >
      Connect Wallet
    </Button>
  )
}
