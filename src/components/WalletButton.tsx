import { Wallet } from '../types'
import { web3Service } from '../services/mockWeb3'
import { useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const { Box, Text, Pressable } = useRender()
  const { normalize, monoFont } = useStyle()
  const c = useColors()

  const buttonStyle = normalize({
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: wallet ? c.error : c.primary,
  })

  const buttonTextStyle = normalize({
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  })

  const containerStyle = normalize({
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  })

  const addressStyle = normalize({
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: c.bgHover,
    borderRadius: 8,
  })

  const addressTextStyle = normalize({
    fontFamily: monoFont(),
    fontSize: 14,
    color: c.text,
  })

  if (wallet) {
    return (
      <Box style={containerStyle}>
        <Box style={addressStyle}>
          <Text style={addressTextStyle}>
            {web3Service.formatAddress(wallet.address)}
          </Text>
        </Box>
        <Pressable
          style={buttonStyle}
          onPress={onDisconnect}
          disabled={loading}
        >
          <Text style={buttonTextStyle}>
            {loading ? 'Disconnecting...' : 'Disconnect'}
          </Text>
        </Pressable>
      </Box>
    )
  }

  return (
    <Pressable
      style={buttonStyle}
      onPress={onConnect}
      disabled={loading}
    >
      <Text style={buttonTextStyle}>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </Text>
    </Pressable>
  )
}
