import { useState, useCallback } from 'react'
import { usePrimitives } from '../adapters'
import { ValidationResult } from '../validation'

// Re-export for backwards compatibility
export { ValidationResult, Validators } from '../validation'

interface InputProps {
  label?: string
  error?: string
  hint?: string
  validate?: (value: string) => ValidationResult
  validateOnBlur?: boolean
  validateOnChange?: boolean
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'password'
  step?: string
  endAdornment?: React.ReactNode
}

export function Input({
  label,
  error: externalError,
  hint,
  validate,
  validateOnBlur = true,
  validateOnChange = false,
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  endAdornment,
}: InputProps) {
  const { Box, Text, TextInput } = usePrimitives()
  const [internalError, setInternalError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const error = externalError ?? internalError

  const runValidation = useCallback((val: string) => {
    if (validate) {
      const result = validate(val)
      setInternalError(result.valid ? null : result.error)
      return result
    }
    return ValidationResult.ok()
  }, [validate])

  const handleChange = useCallback((val: string) => {
    onChange?.(val)
    if (validateOnChange && touched) {
      runValidation(val)
    }
  }, [onChange, validateOnChange, touched, runValidation])

  const handleBlur = useCallback(() => {
    setTouched(true)
    if (validateOnBlur && value !== undefined) {
      runValidation(value)
    }
  }, [validateOnBlur, runValidation, value])

  const hasError = !!error && touched

  return (
    <Box flexDirection="column" gap={1}>
      {label && (
        <Text variant="bodyMd" fontWeight="medium">
          {label}
        </Text>
      )}

      <Box position="relative">
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          hasError={hasError}
          style={endAdornment ? { paddingRight: 64 } : undefined}
        />
        {endAdornment && (
          <Box
            position="absolute"
            right={8}
            top="50%"
            style={{ transform: [{ translateY: -12 }] }}
          >
            {endAdornment}
          </Box>
        )}
      </Box>

      {hasError && (
        <Box
          paddingVertical={1}
          paddingHorizontal={2}
          borderRadius={4}
          backgroundColor="errorMuted"
          borderWidth={1}
          borderColor="error"
        >
          <Text variant="bodyXs" color="error">
            {error}
          </Text>
        </Box>
      )}

      {hint && !hasError && (
        <Text variant="bodyXs" color="alternative">
          {hint}
        </Text>
      )}
    </Box>
  )
}
