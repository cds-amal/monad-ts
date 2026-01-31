import { Box, Text, TextVariant, TextColor, FontWeight, BoxJustifyContent, BoxAlignItems, BoxBackgroundColor, BoxBorderColor } from '@metamask/design-system-react'
import { Token } from '../types'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  return (
    <Box className="flex flex-col" gap={2} asChild>
      <section aria-labelledby="token-list-heading">
        <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium} color={TextColor.TextDefault} asChild>
          <h3 id="token-list-heading">Select Token</h3>
        </Text>
        {tokens.map(token => {
          const isSelected = selectedToken?.symbol === token.symbol
          return (
            <Box
              key={token.symbol}
              className="flex rounded-lg cursor-pointer transition-all hover:shadow-sm"
              justifyContent={BoxJustifyContent.Between}
              alignItems={BoxAlignItems.Center}
              padding={4}
              backgroundColor={isSelected ? BoxBackgroundColor.PrimaryMuted : BoxBackgroundColor.BackgroundSection}
              borderWidth={2}
              borderColor={isSelected ? BoxBorderColor.PrimaryDefault : BoxBorderColor.Transparent}
              asChild
            >
              <button
                type="button"
                onClick={() => onSelectToken(token)}
                aria-pressed={isSelected}
              >
                <Box className="flex flex-col" gap={1}>
                  <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium}>
                    {token.symbol}
                  </Text>
                  <Text variant={TextVariant.BodyXs} color={TextColor.TextMuted}>
                    {token.name}
                  </Text>
                </Box>
                <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium}>
                  {token.balance}
                </Text>
              </button>
            </Box>
          )
        })}
      </section>
    </Box>
  )
}
