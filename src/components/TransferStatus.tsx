import { usePrimitives } from '../adapters'
import { TransferResult } from '../types'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  const { Box, Text, IconButton } = usePrimitives()

  if (!result) return null

  const isSuccess = result.success

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
      padding={4}
      gap={3}
      borderRadius={8}
      backgroundColor={isSuccess ? 'successMuted' : 'errorMuted'}
      borderWidth={2}
      borderColor={isSuccess ? 'success' : 'error'}
    >
      <Box flexDirection="column" gap={1} flex={1}>
        <Text
          variant="bodyMd"
          fontWeight="medium"
          color={isSuccess ? 'success' : 'error'}
        >
          {isSuccess ? 'Transfer Successful!' : 'Transfer Failed'}
        </Text>
        <Text
          variant="bodySm"
          color={isSuccess ? 'success' : 'error'}
          fontFamily={result.txHash ? 'mono' : 'default'}
        >
          {isSuccess ? `TX: ${result.txHash}` : result.error}
        </Text>
      </Box>
      <IconButton
        icon="close"
        size="sm"
        label="Dismiss"
        onPress={onDismiss}
      />
    </Box>
  )
}
