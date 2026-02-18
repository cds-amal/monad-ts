import { usePrimitives } from '../adapters'
import { Token } from '../types'
import { useConfigurable, LongPressWrapper } from '../config'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const { Box, Text, Pressable } = usePrimitives()

  const { values, onLongPress } = useConfigurable({
    elementId: 'token-list',
    elementType: 'TokenList',
    displayName: 'Token List',
    properties: {
      density: {
        type: 'select',
        label: 'Display Density',
        currentValue: 'comfortable',
        options: ['compact', 'comfortable', 'spacious'],
      },
      showBalance: {
        type: 'boolean',
        label: 'Show Balance',
        currentValue: true,
      },
    },
  })

  const paddingMap: Record<string, number> = { compact: 2, comfortable: 4, spacious: 6 }
  const gapMap: Record<string, number> = { compact: 1, comfortable: 2, spacious: 3 }
  const itemPadding = paddingMap[values.density as string] ?? 4
  const listGap = gapMap[values.density as string] ?? 2

  return (
    <LongPressWrapper onLongPress={onLongPress}>
      <Box flexDirection="column" gap={listGap}>
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
                padding={itemPadding}
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
                {values.showBalance && (
                  <Text variant="bodyMd" fontWeight="medium">
                    {token.balance}
                  </Text>
                )}
              </Box>
            </Pressable>
          )
        })}
      </Box>
    </LongPressWrapper>
  )
}
