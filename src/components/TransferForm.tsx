import { useState } from 'react'
import { useStyle, useWeb3 } from '../context'
import { Box, VStack, Flex, InputField } from '../adapters/browser'
import { getAccountByAddress } from '../adapters/browser'
import { AddressSelect } from './AddressSelect'
import { Token, TransferResult } from '../ports'

interface TransferFormProps {
  token: Token | null
  onTransferComplete: (result: TransferResult) => void
}

export function TransferForm({ token, onTransferComplete }: TransferFormProps) {
  const style = useStyle()
  const web3 = useWeb3()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedAccount = getAccountByAddress(recipient)
  const validation = recipient ? web3.validateAddress(recipient) : null
  const isContractWarning = validation?.valid && validation.accountType === 'contract'

  const handleSubmit = async () => {
    if (!token) return

    if (validation && !validation.valid) {
      onTransferComplete({ success: false, error: validation.error })
      return
    }

    setLoading(true)
    try {
      const result = await web3.transfer({ to: recipient, amount, token })
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

  const isDisabled = !token || loading

  return (
    <VStack gap={4}>
        {/* Recipient */}
        <VStack gap={2}>
          <Box as="label" styles={style.label()}>
            Recipient Address
          </Box>
          <AddressSelect
            value={recipient}
            onChange={setRecipient}
            disabled={isDisabled}
          />
          {isContractWarning && selectedAccount && (
            <Box styles={style.alert({ intent: 'primary' })}>
              ⚠️ This is a contract address ({selectedAccount.label}). Make sure the contract can receive tokens.
            </Box>
          )}
        </VStack>

        {/* Amount */}
        <VStack gap={2}>
          <Flex justify="between" align="center">
            <Box as="label" styles={style.label()}>
              Amount {token && `(${token.symbol})`}
            </Box>
            {token && (
              <Box
                as="button"
                styles={style.badge({ intent: 'neutral', size: 'sm' })}
                onClick={handleMaxClick}
              >
                MAX
              </Box>
            )}
          </Flex>
          <InputField
            type="number"
            value={amount}
            placeholder="0.00"
            disabled={isDisabled}
            styles={style.input({ disabled: isDisabled })}
            onChange={setAmount}
          />
        </VStack>

        {/* Submit */}
        <Box
          as="button"
          styles={style.button({
            intent: 'success',
            size: 'lg',
            disabled: isDisabled,
            loading,
          })}
          onClick={handleSubmit}
        >
          {loading ? 'Sending...' : `Send ${token?.symbol || 'Tokens'}`}
        </Box>
    </VStack>
  )
}
