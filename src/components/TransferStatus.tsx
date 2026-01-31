import { TransferResult } from '../types'
import { useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  const { Box, Text, Pressable } = useRender()
  const { normalize, monoFont } = useStyle()
  const c = useColors()

  if (!result) return null

  const containerStyle = normalize({
    padding: 16,
    borderRadius: 8,
    backgroundColor: result.success ? c.successBg : c.errorBg,
    borderWidth: 2,
    borderColor: result.success ? c.success : c.error,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  })

  const contentStyle = normalize({
    flex: 1,
    gap: 4,
  })

  const titleStyle = normalize({
    fontSize: 16,
    fontWeight: '600',
    color: result.success ? c.successText : c.errorText,
  })

  const messageStyle = normalize({
    fontSize: 14,
    color: result.success ? c.successText : c.errorText,
    fontFamily: result.txHash ? monoFont() : undefined,
  })

  const dismissStyle = normalize({
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  })

  const dismissTextStyle = normalize({
    fontSize: 14,
    fontWeight: '600',
    color: result.success ? c.successText : c.errorText,
  })

  return (
    <Box style={containerStyle}>
      <Box style={contentStyle}>
        <Text style={titleStyle}>
          {result.success ? 'Transfer Successful!' : 'Transfer Failed'}
        </Text>
        <Text style={messageStyle}>
          {result.success ? `TX: ${result.txHash}` : result.error}
        </Text>
      </Box>
      <Pressable style={dismissStyle} onPress={onDismiss}>
        <Text style={dismissTextStyle}>✕</Text>
      </Pressable>
    </Box>
  )
}
