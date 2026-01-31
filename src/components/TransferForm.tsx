import { useState, useMemo } from 'react'
import { usePrimitives } from '../adapters'
import { Token, TransferResult } from '../types'
import { useServices } from '../services/ServicesContext'
import { AddressSelect } from './AddressSelect'
import { Input } from './Input'
import { ValidationResult, Validators } from '../validation'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const { Box, Text, Button, Pressable } = usePrimitives()
  const { transfer, validateAddress, getAccountByAddress } = useServices()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedAccount = getAccountByAddress(recipient)
  const validation = recipient ? validateAddress(recipient) : null
  const isContractWarning = validation?.valid && validation.accountType === 'contract'

  // Compose amount validation: numeric + positive + within balance
  const amountValidator = useMemo(() => {
    const maxBalance = token ? parseFloat(token.balance) : Infinity
    return ValidationResult.chain(
      Validators.numeric('Enter a valid amount'),
      Validators.positive('Amount must be greater than 0'),
      (value: string) => {
        const num = parseFloat(value)
        return num <= maxBalance
          ? ValidationResult.ok()
          : ValidationResult.err(`Exceeds balance of ${token?.balance} ${token?.symbol}`)
      }
    )
  }, [token])

  const handleSubmit = async () => {
    if (!token) return

    // Check validation before submitting
    if (validation && !validation.valid) {
      onTransferComplete({ success: false, error: validation.error })
      return
    }

    setLoading(true)
    try {
      const result = await transfer({
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
    <Box flexDirection="column" gap={4}>
      <Box flexDirection="column" gap={1}>
        <Text variant="bodyMd" fontWeight="medium">
          Recipient Address
        </Text>
        <AddressSelect
          value={recipient}
          onChange={setRecipient}
          disabled={!token || loading}
        />
        {isContractWarning && selectedAccount && (
          <Box
            paddingVertical={2}
            paddingHorizontal={3}
            borderRadius={6}
            backgroundColor="infoMuted"
            borderWidth={1}
            borderColor="info"
          >
            <Text variant="bodyXs" color="info">
              ⚠️ This is a contract address ({selectedAccount.label}). Make sure the contract can receive tokens.
            </Text>
          </Box>
        )}
      </Box>

      <Input
        label={`Amount ${token ? `(${token.symbol})` : ''}`}
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={setAmount}
        disabled={!token || loading}
        validate={amountValidator}
        hint={token ? `Balance: ${token.balance} ${token.symbol}` : undefined}
        endAdornment={token && (
          <Pressable onPress={handleMaxClick}>
            <Box
              paddingVertical={1}
              paddingHorizontal={2}
              borderRadius={4}
              backgroundColor="muted"
            >
              <Text variant="bodyXs" fontWeight="semibold">
                MAX
              </Text>
            </Box>
          </Pressable>
        )}
      />

      <Box style={{ marginTop: 8 }}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={!token || loading}
          loading={loading}
          loadingText="Sending"
          fullWidth
        >
          {`Send ${token?.symbol || 'Tokens'}`}
        </Button>
      </Box>
    </Box>
  )
}
