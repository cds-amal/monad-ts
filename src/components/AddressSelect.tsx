import { useState } from 'react'
import { MOCK_ACCOUNTS, MockAccount, AccountType } from '../services/mockAccounts'

interface AddressSelectProps {
  value: string
  onChange: (address: string) => void
  disabled?: boolean
}

const TYPE_COLORS: Record<AccountType, { bg: string; text: string; border: string }> = {
  eoa: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
  contract: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  invalid: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
  blacklisted: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  sanctioned: { bg: '#fce7f3', text: '#9d174d', border: '#ec4899' },
}

const TYPE_LABELS: Record<AccountType, string> = {
  eoa: 'Wallet',
  contract: 'Contract',
  invalid: 'Invalid',
  blacklisted: 'Blacklisted',
  sanctioned: 'Sanctioned',
}

export function AddressSelect({ value, onChange, disabled }: AddressSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedAccount = MOCK_ACCOUNTS.find(a => a.address === value)

  const containerStyle: React.CSSProperties = {
    position: 'relative',
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: disabled ? '#f9fafb' : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    maxHeight: '300px',
    overflowY: 'auto',
  }

  const groupLabelStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  }

  const getOptionStyle = (_account: MockAccount): React.CSSProperties => ({
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.15s',
  })

  const optionLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  }

  const addressStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#6b7280',
  }

  const getBadgeStyle = (type: AccountType): React.CSSProperties => ({
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 600,
    borderRadius: '4px',
    backgroundColor: TYPE_COLORS[type].bg,
    color: TYPE_COLORS[type].text,
    border: `1px solid ${TYPE_COLORS[type].border}`,
  })

  const handleSelect = (account: MockAccount) => {
    onChange(account.address)
    setIsOpen(false)
  }

  const formatAddress = (addr: string) => {
    if (addr.length <= 16) return addr
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  // Group accounts by type for organized display
  const groupedAccounts = MOCK_ACCOUNTS.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type]!.push(account)
    return acc
  }, {} as Record<AccountType, MockAccount[]>)

  const typeOrder: AccountType[] = ['eoa', 'contract', 'invalid', 'blacklisted', 'sanctioned']

  return (
    <div style={containerStyle}>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedAccount ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>{selectedAccount.label}</span>
            <span style={getBadgeStyle(selectedAccount.type)}>
              {TYPE_LABELS[selectedAccount.type]}
            </span>
          </span>
        ) : (
          <span style={{ color: '#9ca3af' }}>Select recipient...</span>
        )}
        <span style={{ color: '#9ca3af' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          {typeOrder.map(type => {
            const accounts = groupedAccounts[type]
            if (!accounts?.length) return null

            return (
              <div key={type}>
                <div style={groupLabelStyle}>
                  {TYPE_LABELS[type]} Addresses
                </div>
                {accounts.map(account => (
                  <div
                    key={account.address}
                    style={getOptionStyle(account)}
                    onClick={() => handleSelect(account)}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    <div style={optionLabelStyle}>
                      <span style={{ fontWeight: 500 }}>{account.label}</span>
                      <span style={getBadgeStyle(account.type)}>
                        {TYPE_LABELS[account.type]}
                      </span>
                    </div>
                    <div style={addressStyle}>{formatAddress(account.address)}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {account.description}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
