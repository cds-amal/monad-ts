import { useStyle, useTheme } from '../context'
import { Box, VStack, Flex } from '../adapters/browser'
import { TransferResult } from '../ports'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  const style = useStyle()
  const { colors: c } = useTheme()

  if (!result) return null

  const intent = result.success ? 'success' : 'error'

  return (
    <Flex justify="between" align="start" gap={3} styles={style.alert({ intent })}>
      <VStack gap={1}>
        <Box
          as="span"
          styles={{ fontSize: '16px', fontWeight: 600 }}
        >
          {result.success ? 'Transfer Successful!' : 'Transfer Failed'}
        </Box>
        <Box
          as="span"
          styles={{
            fontSize: '14px',
            fontFamily: result.txHash ? 'monospace' : 'inherit',
            wordBreak: 'break-all',
          }}
        >
          {result.success ? `TX: ${result.txHash}` : result.error}
        </Box>
      </VStack>
      <Box
        as="button"
        styles={{
          padding: '4px 8px',
          fontSize: '14px',
          fontWeight: 600,
          border: 'none',
          backgroundColor: 'transparent',
          color: c.text,
          cursor: 'pointer',
        }}
        onClick={onDismiss}
      >
        ✕
      </Box>
    </Flex>
  )
}
