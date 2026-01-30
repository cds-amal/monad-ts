import { useStyle, useWeb3 } from '../context'
import { Box, HStack } from '../adapters/browser'
import { Wallet } from '../ports'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const style = useStyle()
  const web3 = useWeb3()

  if (wallet) {
    return (
      <HStack gap={3}>
        <Box styles={style.badge({ intent: 'neutral', size: 'md' })}>
          {web3.formatAddress(wallet.address)}
        </Box>
        <Box
          as="button"
          styles={style.button({ intent: 'error', loading })}
          onClick={onDisconnect}
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </Box>
      </HStack>
    )
  }

  return (
    <Box
      as="button"
      styles={style.button({ intent: 'primary', loading })}
      onClick={onConnect}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Box>
  )
}
