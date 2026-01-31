import { usePrimitives } from '../adapters'
import { Token } from '../types'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const { Box, Text, Pressable } = usePrimitives()

  return (
    <Box flexDirection="column" gap={2}>
      <Text variant="bodyMd" fontWeight="medium">
        Select Token
      </Text>
      {tokens.map(token => {
        const isSelected = selectedToken?.symbol === token.symbol
        return (
          <Pressable
            key={token.symbol}
            onPress={() => onSelectToken(token)}
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              padding={4}
              borderRadius={8}
              backgroundColor={isSelected ? 'primaryMuted' : 'alternative'}
              borderWidth={2}
              borderColor={isSelected ? 'primary' : 'transparent'}
            >
              <Box flexDirection="column" gap={1}>
                <Text variant="bodyMd" fontWeight="medium">
                  {token.symbol}
                </Text>
                <Text variant="bodyXs" color="muted">
                  {token.name}
                </Text>
              </Box>
              <Text variant="bodyMd" fontWeight="medium">
                {token.balance}
              </Text>
            </Box>
          </Pressable>
        )
      })}
    </Box>
  )
}
