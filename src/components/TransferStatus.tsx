import { TransferResult } from '../types'
import { useColors } from '../context/ThemeContext'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  const c = useColors()

  if (!result) return null

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: result.success ? c.successBg : c.errorBg,
    border: `2px solid ${result.success ? c.success : c.error}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  }

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: result.success ? c.successText : c.errorText,
  }

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: result.success ? c.successText : c.errorText,
    fontFamily: result.txHash ? 'monospace' : 'inherit',
    wordBreak: 'break-all',
  }

  const dismissStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: result.success ? c.successText : c.errorText,
    fontWeight: 600,
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <span style={titleStyle}>
          {result.success ? 'Transfer Successful!' : 'Transfer Failed'}
        </span>
        <span style={messageStyle}>
          {result.success ? `TX: ${result.txHash}` : result.error}
        </span>
      </div>
      <button style={dismissStyle} onClick={onDismiss}>
        ✕
      </button>
    </div>
  )
}
