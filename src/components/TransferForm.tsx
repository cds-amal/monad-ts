import { useState } from 'react'
import { Token, TransferResult } from '../types'
import { web3Service } from '../services/mockWeb3'
import { AddressSelect } from './AddressSelect'
import { validateAddress, getAccountByAddress } from '../services/mockAccounts'
import { useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const { Box, Text, Pressable, TextInput } = useRender()
  const { normalize } = useStyle()
  const c = useColors()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedAccount = getAccountByAddress(recipient)
  const validation = recipient ? validateAddress(recipient) : null
  const isContractWarning = validation?.valid && validation.accountType === 'contract'

  const containerStyle = normalize({
    gap: 16,
  })

  const inputGroupStyle = normalize({
    gap: 6,
  })

  const labelStyle = normalize({
    fontSize: 14,
    fontWeight: '600',
    color: c.textSecondary,
  })

  const inputStyle = normalize({
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: 8,
    backgroundColor: c.bgInput,
    color: c.text,
  })

  const buttonStyle = normalize({
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: !token || loading ? c.textMuted : c.success,
    marginTop: 8,
    alignItems: 'center',
  })

  const buttonTextStyle = normalize({
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  })

  const maxButtonStyle = normalize({
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: c.bgHover,
  })

  const maxButtonTextStyle = normalize({
    fontSize: 12,
    fontWeight: '600',
    color: c.textSecondary,
  })

  const amountHeaderStyle = normalize({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  })

  const warningStyle = normalize({
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: c.warningBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.primary,
  })

  const warningTextStyle = normalize({
    fontSize: 12,
    color: c.warningText,
  })

  const handleSubmit = async () => {
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
    <Box style={containerStyle}>
      <Box style={inputGroupStyle}>
        <Text style={labelStyle}>Recipient Address</Text>
        <AddressSelect
          value={recipient}
          onChange={setRecipient}
          disabled={!token || loading}
        />
        {isContractWarning && selectedAccount && (
          <Box style={warningStyle}>
            <Text style={warningTextStyle}>
              ⚠️ This is a contract address ({selectedAccount.label}). Make sure the contract can receive tokens.
            </Text>
          </Box>
        )}
      </Box>
      <Box style={inputGroupStyle}>
        <Box style={amountHeaderStyle}>
          <Text style={labelStyle}>Amount {token && `(${token.symbol})`}</Text>
          {token && (
            <Pressable style={maxButtonStyle} onPress={handleMaxClick}>
              <Text style={maxButtonTextStyle}>MAX</Text>
            </Pressable>
          )}
        </Box>
        <TextInput
          style={inputStyle}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={c.textMuted}
          value={amount}
          onChangeText={setAmount}
          editable={!!token && !loading}
        />
      </Box>
      <Pressable
        style={buttonStyle}
        onPress={handleSubmit}
        disabled={!token || loading}
      >
        <Text style={buttonTextStyle}>
          {loading ? 'Sending...' : `Send ${token?.symbol || 'Tokens'}`}
        </Text>
      </Pressable>
    </Box>
  )
}
