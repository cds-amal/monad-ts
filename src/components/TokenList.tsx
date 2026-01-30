import { Token } from '../types'

interface TokenListProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
}

export function TokenList({ tokens, selectedToken, onSelectToken }: TokenListProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  }

  const getTokenStyle = (token: Token): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: selectedToken?.symbol === token.symbol ? '#dbeafe' : '#f9fafb',
    border: selectedToken?.symbol === token.symbol ? '2px solid #3b82f6' : '2px solid transparent',
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
    color: '#111827',
  }

  const tokenNameStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  }

  const balanceStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#111827',
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
