import { Token } from '../types'
import { useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const { Box, Text, Pressable } = useRender()
  const { normalize } = useStyle()
  const c = useColors()

  const containerStyle = normalize({
    gap: 8,
  })

  const labelStyle = normalize({
    fontSize: 14,
    fontWeight: '600',
    color: c.textSecondary,
    marginBottom: 4,
  })

  const getTokenStyle = (token: Token) => normalize({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: selectedToken?.symbol === token.symbol ? c.bgSelected : c.bgHover,
    borderWidth: 2,
    borderColor: selectedToken?.symbol === token.symbol ? c.borderSelected : 'transparent',
    borderRadius: 8,
  })

  const tokenInfoStyle = normalize({
    gap: 4,
  })

  const tokenSymbolStyle = normalize({
    fontSize: 16,
    fontWeight: '600',
    color: c.text,
  })

  const tokenNameStyle = normalize({
    fontSize: 12,
    color: c.textSecondary,
  })

  const balanceStyle = normalize({
    fontSize: 16,
    fontWeight: '500',
    color: c.text,
  })

  return (
    <Box style={containerStyle}>
      <Text style={labelStyle}>Select Token</Text>
      {tokens.map(token => (
        <Pressable
          key={token.symbol}
          style={getTokenStyle(token)}
          onPress={() => onSelectToken(token)}
        >
          <Box style={tokenInfoStyle}>
            <Text style={tokenSymbolStyle}>{token.symbol}</Text>
            <Text style={tokenNameStyle}>{token.name}</Text>
          </Box>
          <Text style={balanceStyle}>{token.balance}</Text>
        </Pressable>
      ))}
    </Box>
  )
}
