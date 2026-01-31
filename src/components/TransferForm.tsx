import { useState } from 'react'
import { Box, Text, Button, ButtonVariant, ButtonBaseSize, TextVariant, FontWeight, TextColor, BoxBackgroundColor, BoxBorderColor } from '@metamask/design-system-react'
import { Token, TransferResult } from '../types'
import { web3Service } from '../services/mockWeb3'
import { AddressSelect } from './AddressSelect'
import { validateAddress, getAccountByAddress } from '../services/mockAccounts'
import { Input } from './Input'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedAccount = getAccountByAddress(recipient)
  const validation = recipient ? validateAddress(recipient) : null
  const isContractWarning = validation?.valid && validation.accountType === 'contract'
  const [amountTouched, setAmountTouched] = useState(false)

  // Inline amount validation
  const getAmountError = (): string | undefined => {
    if (!amountTouched || !amount) return undefined
    const num = parseFloat(amount)
    if (isNaN(num)) return 'Enter a valid amount'
    if (num <= 0) return 'Amount must be greater than 0'
    if (token && num > parseFloat(token.balance)) {
      return `Exceeds balance of ${token.balance} ${token.symbol}`
    }
    return undefined
  }
  const amountError = getAmountError()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    // Check validation before submitting
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
    <form onSubmit={handleSubmit}>
      <Box className="flex flex-col" gap={4}>
        <Box className="flex flex-col" gap={1}>
          <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium} asChild>
            <label htmlFor="recipient-address">Recipient Address</label>
          </Text>
          <AddressSelect
            value={recipient}
            onChange={setRecipient}
            disabled={!token || loading}
          />
          {isContractWarning && selectedAccount && (
            <Box
              className="rounded-md"
              paddingVertical={2}
              paddingHorizontal={3}
              backgroundColor={BoxBackgroundColor.InfoMuted}
              borderWidth={1}
              borderColor={BoxBorderColor.InfoDefault}
            >
              <Text variant={TextVariant.BodyXs} color={TextColor.InfoDefault}>
                ⚠️ This is a contract address ({selectedAccount.label}). Make sure the contract can receive tokens.
              </Text>
            </Box>
          )}
        </Box>

        <Input
          label={`Amount ${token ? `(${token.symbol})` : ''}`}
          type="number"
          step="any"
          placeholder="0.00"
          value={amount}
          onChange={setAmount}
          onBlur={() => setAmountTouched(true)}
          disabled={!token || loading}
          error={amountError}
          hint={token ? `Balance: ${token.balance} ${token.symbol}` : undefined}
          endAdornment={token && (
            <button
              type="button"
              onClick={handleMaxClick}
              className="px-2 py-1 text-xs font-semibold rounded border-0 cursor-pointer bg-muted text-default hover:bg-alternative"
            >
              MAX
            </button>
          )}
        />

        <Button
          variant={ButtonVariant.Primary}
          size={ButtonBaseSize.Lg}
          type="submit"
          isDisabled={!token || loading}
          isLoading={loading}
          loadingText="Sending"
          isFullWidth
          className="mt-2"
        >
          {`Send ${token?.symbol || 'Tokens'}`}
        </Button>
      </Box>
    </form>
  )
}
