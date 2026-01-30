import { Token } from '../types'
import { useColors } from '../context/ThemeContext'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const c = useColors()

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: c.textSecondary,
    marginBottom: '4px',
  }

  const getTokenStyle = (token: Token): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: selectedToken?.symbol === token.symbol ? c.bgSelected : c.bgHover,
    border: selectedToken?.symbol === token.symbol ? `2px solid ${c.borderSelected}` : '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  })

  const tokenInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const tokenSymbolStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: c.text,
  }

  const tokenNameStyle: React.CSSProperties = {
    fontSize: '12px',
    color: c.textSecondary,
  }

  const balanceStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: c.text,
  }

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>Select Token</span>
      {tokens.map(token => (
        <div
          key={token.symbol}
          style={getTokenStyle(token)}
          onClick={() => onSelectToken(token)}
        >
          <div style={tokenInfoStyle}>
            <span style={tokenSymbolStyle}>{token.symbol}</span>
            <span style={tokenNameStyle}>{token.name}</span>
          </div>
          <span style={balanceStyle}>{token.balance}</span>
        </div>
      ))}
    </div>
  )
}
