import { useState } from 'react'
import { Box, Text, Button, ButtonVariant, ButtonBaseSize, TextVariant, FontWeight, TextColor, BoxJustifyContent, BoxAlignItems, BoxBackgroundColor, BoxBorderColor } from '@metamask/design-system-react'
import { Token, TransferResult } from '../types'
import { web3Service } from '../services/mockWeb3'
import { AddressSelect } from './AddressSelect'
import { validateAddress, getAccountByAddress } from '../services/mockAccounts'

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
          <label>
            <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium}>
              Recipient Address
            </Text>
          </label>
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

        <Box className="flex flex-col" gap={1}>
          <Box className="flex" justifyContent={BoxJustifyContent.Between} alignItems={BoxAlignItems.Center}>
            <label>
              <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium}>
                Amount {token && `(${token.symbol})`}
              </Text>
            </label>
            {token && (
              <button
                type="button"
                onClick={handleMaxClick}
                className="px-2 py-1 text-xs font-semibold rounded border-0 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                MAX
              </button>
            )}
          </Box>
          <input
            className="p-3 text-base border-2 border-gray-200 rounded-lg outline-none transition-colors focus:border-primary-default disabled:bg-gray-100 disabled:cursor-not-allowed"
            type="number"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={!token || loading}
          />
        </Box>

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
