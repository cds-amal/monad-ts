import { Wallet } from '../types'
import { web3Service } from '../services/mockWeb3'
import { useColors } from '../context/ThemeContext'

interface WalletButtonProps {
  wallet: Wallet | null
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ wallet, loading, onConnect, onDisconnect }: WalletButtonProps) {
  const c = useColors()

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'wait' : 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: wallet ? c.error : c.primary,
    color: 'white',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  const addressStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: c.bgHover,
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: c.text,
  }

  if (wallet) {
    return (
      <div style={containerStyle}>
        <span style={addressStyle}>
          {web3Service.formatAddress(wallet.address)}
        </span>
        <button
          style={buttonStyle}
          onClick={onDisconnect}
          disabled={loading}
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    )
  }

  return (
    <button
      style={buttonStyle}
      onClick={onConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
