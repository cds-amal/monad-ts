import { Box, Text, ButtonIcon, BoxJustifyContent, BoxAlignItems, BoxBackgroundColor, BoxBorderColor, TextVariant, TextColor, FontWeight, IconName, ButtonIconSize, FontFamily } from '@metamask/design-system-react'
import { TransferResult } from '../types'

interface TransferStatusProps {
  result: TransferResult | null
  onDismiss: () => void
}

export function TransferStatus({ result, onDismiss }: TransferStatusProps) {
  if (!result) return null

  const isSuccess = result.success

  return (
    <Box
      className="flex rounded-lg"
      justifyContent={BoxJustifyContent.Between}
      alignItems={BoxAlignItems.Start}
      padding={4}
      gap={3}
      backgroundColor={isSuccess ? BoxBackgroundColor.SuccessMuted : BoxBackgroundColor.ErrorMuted}
      borderWidth={2}
      borderColor={isSuccess ? BoxBorderColor.SuccessDefault : BoxBorderColor.ErrorDefault}
    >
      <Box className="flex flex-col" gap={1}>
        <Text
          variant={TextVariant.BodyMd}
          fontWeight={FontWeight.Medium}
          color={isSuccess ? TextColor.SuccessDefault : TextColor.ErrorDefault}
        >
          {isSuccess ? 'Transfer Successful!' : 'Transfer Failed'}
        </Text>
        <Text
          variant={TextVariant.BodySm}
          color={isSuccess ? TextColor.SuccessDefault : TextColor.ErrorDefault}
          fontFamily={result.txHash ? FontFamily.Default : undefined}
          className={result.txHash ? 'font-mono break-all' : 'break-all'}
        >
          {isSuccess ? `TX: ${result.txHash}` : result.error}
        </Text>
      </Box>
      <ButtonIcon
        iconName={IconName.Close}
        size={ButtonIconSize.Sm}
        ariaLabel="Dismiss"
        onClick={onDismiss}
        className="bg-transparent hover:bg-transparent"
      />
    </Box>
  )
}
