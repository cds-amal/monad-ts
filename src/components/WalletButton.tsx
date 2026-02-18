import { usePrimitives } from '../adapters'
import { Wallet } from '../types'
import { useServices } from '../services/ServicesContext'
import { useConfigurable, LongPressWrapper } from '../config'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const { Box, Text, Button } = usePrimitives()
  const { formatAddress } = useServices()

  const { values, onLongPress } = useConfigurable({
    elementId: 'wallet-button',
    elementType: 'WalletButton',
    displayName: 'Wallet Button',
    properties: {
      variant: {
        type: 'select',
        label: 'Button Variant',
        currentValue: 'danger',
        options: ['primary', 'secondary', 'tertiary', 'danger'],
      },
      size: {
        type: 'select',
        label: 'Button Size',
        currentValue: 'md',
        options: ['sm', 'md', 'lg'],
      },
    },
  })

  if (wallet) {
    return (
      <LongPressWrapper onLongPress={onLongPress}>
        <Box flexDirection="row" gap={3} alignItems="center">
          <Box
            paddingVertical={2}
            paddingHorizontal={4}
            borderRadius={8}
            backgroundColor="muted"
          >
            <Text variant="bodySm" fontFamily="mono">
              {formatAddress(wallet.address)}
            </Text>
          </Box>
          <Button
            variant={values.variant as 'primary' | 'secondary' | 'tertiary' | 'danger'}
            size={values.size as 'sm' | 'md' | 'lg'}
            onPress={onDisconnect}
            disabled={loading}
            loading={loading}
            loadingText="Disconnecting"
          >
            Disconnect
          </Button>
        </Box>
      </LongPressWrapper>
    )
  }

  return (
    <LongPressWrapper onLongPress={onLongPress}>
      <Button
        variant="primary"
        size={values.size as 'sm' | 'md' | 'lg'}
        onPress={onConnect}
        disabled={loading}
        loading={loading}
        loadingText="Connecting"
      >
        Connect Wallet
      </Button>
    </LongPressWrapper>
  )
}
