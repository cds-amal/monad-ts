import { useStyle } from '../context'
import { Box, VStack, Flex } from '../adapters/browser'
import { Token } from '../ports'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const style = useStyle()

  return (
    <VStack gap={2}>
      <Box as="span" styles={style.label()}>
        Select Token
      </Box>
      {tokens.map(token => (
        <Flex
          key={token.symbol}
          justify="between"
          align="center"
          styles={style.selectable({ selected: selectedToken?.symbol === token.symbol })}
          onClick={() => onSelectToken(token)}
        >
          <VStack gap={1}>
            <Box as="span" styles={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              {token.symbol}
            </Box>
            <Box as="span" styles={{ fontSize: '12px', color: '#6b7280' }}>
              {token.name}
            </Box>
          </VStack>
          <Box as="span" styles={{ fontSize: '16px', fontWeight: 500, color: '#111827' }}>
            {token.balance}
          </Box>
        </Flex>
      ))}
    </VStack>
  )
}
