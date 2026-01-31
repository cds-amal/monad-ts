import { forwardRef, useId } from 'react'
import { Box, Text, TextVariant, FontWeight, TextColor, BoxBackgroundColor, BoxBorderColor } from '@metamask/design-system-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  onChange?: (value: string) => void
  endAdornment?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    onChange,
    endAdornment,
    disabled,
    className,
    id: providedId,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = providedId ?? generatedId

  const borderColor = error
    ? 'border-error-default focus:border-error-default'
    : 'border-default focus:border-primary-default'

  return (
    <Box className="flex flex-col" gap={1}>
      {label && (
        <Text variant={TextVariant.BodyMd} fontWeight={FontWeight.Medium} asChild>
          <label htmlFor={id}>{label}</label>
        </Text>
      )}

      <Box className="relative">
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          className={`w-full p-3 text-base border-2 rounded-lg outline-none transition-colors
            ${borderColor}
            disabled:bg-muted disabled:cursor-not-allowed
            ${endAdornment ? 'pr-16' : ''}
            ${className ?? ''}`}
          onChange={e => onChange?.(e.target.value)}
          {...props}
        />
        {endAdornment && (
          <Box className="absolute right-2 top-1/2 -translate-y-1/2">
            {endAdornment}
          </Box>
        )}
      </Box>

      {error && (
        <Box
          className="rounded-md"
          paddingVertical={1}
          paddingHorizontal={2}
          backgroundColor={BoxBackgroundColor.ErrorMuted}
          borderWidth={1}
          borderColor={BoxBorderColor.ErrorDefault}
        >
          <Text variant={TextVariant.BodyXs} color={TextColor.ErrorDefault}>
            {error}
          </Text>
        </Box>
      )}

      {hint && !error && (
        <Text variant={TextVariant.BodyXs} color={TextColor.TextAlternative}>
          {hint}
        </Text>
      )}
    </Box>
  )
})
