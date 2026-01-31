import { Box, Button, Text, ButtonVariant, ButtonBaseSize, BoxAlignItems, TextVariant, FontFamily } from '@metamask/design-system-react'
import { Wallet } from '../types'
import { web3Service } from '../services/mockWeb3'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  if (wallet) {
    return (
      <Box className="flex" gap={3} alignItems={BoxAlignItems.Center}>
        <Box className="rounded-lg" paddingVertical={2} paddingHorizontal={4}>
          <Text variant={TextVariant.BodySm} fontFamily={FontFamily.Default} className="font-mono">
            {web3Service.formatAddress(wallet.address)}
          </Text>
        </Box>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonBaseSize.Md}
          onClick={onDisconnect}
          isDisabled={loading}
          isLoading={loading}
          loadingText="Disconnecting"
          isDanger
        >
          Disconnect
        </Button>
      </Box>
    )
  }

  return (
    <Button
      variant={ButtonVariant.Primary}
      size={ButtonBaseSize.Md}
      onClick={onConnect}
      isDisabled={loading}
      isLoading={loading}
      loadingText="Connecting"
    >
      Connect Wallet
    </Button>
  )
}
