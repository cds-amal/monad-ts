import { useState } from 'react'
import { Token, TransferResult } from '../types'
import { web3Service } from '../services/mockWeb3'
import { AddressSelect } from './AddressSelect'
import { validateAddress, getAccountByAddress } from '../services/mockAccounts'
import { useColors } from '../context/ThemeContext'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const c = useColors()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedAccount = getAccountByAddress(recipient)
  const validation = recipient ? validateAddress(recipient) : null
  const isContractWarning = validation?.valid && validation.accountType === 'contract'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: c.textSecondary,
  }

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '16px',
    border: `2px solid ${c.border}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: c.bgInput,
    color: c.text,
  }

  const buttonStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: !token || loading ? 'not-allowed' : 'pointer',
    backgroundColor: !token || loading ? c.textMuted : c.success,
    color: 'white',
    marginTop: '8px',
    transition: 'all 0.2s ease',
  }

  const maxButtonStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: c.bgHover,
    color: c.textSecondary,
  }

  const amountHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const warningStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '12px',
    backgroundColor: c.warningBg,
    color: c.warningText,
    borderRadius: '6px',
    border: `1px solid ${c.primary}`,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (validation && !validation.valid) {
      onTransferComplete({ success: false, error: validation.error })
      return
    }

    setLoading(true)
    try {
      const result = await web3Service.transfer({
        to: recipient,
        amount,
        token,
      })
      onTransferComplete(result)
      if (result.success) {
        setRecipient('')
        setAmount('')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMaxClick = () => {
    if (token) {
      setAmount(token.balance)
    }
  }

  return (
    <form style={containerStyle} onSubmit={handleSubmit}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Recipient Address</label>
        <AddressSelect
          value={recipient}
          onChange={setRecipient}
          disabled={!token || loading}
        />
        {isContractWarning && selectedAccount && (
          <div style={warningStyle}>
            ⚠️ This is a contract address ({selectedAccount.label}). Make sure the contract can receive tokens.
          </div>
        )}
      </div>
      <div style={inputGroupStyle}>
        <div style={amountHeaderStyle}>
          <label style={labelStyle}>Amount {token && `(${token.symbol})`}</label>
          {token && (
            <button type="button" style={maxButtonStyle} onClick={handleMaxClick}>
              MAX
            </button>
          )}
        </div>
        <input
          style={inputStyle}
          type="number"
          step="any"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={!token || loading}
        />
      </div>
      <button style={buttonStyle} type="submit" disabled={!token || loading}>
        {loading ? 'Sending...' : `Send ${token?.symbol || 'Tokens'}`}
      </button>
    </form>
  )
}
