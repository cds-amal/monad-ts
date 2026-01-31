import { useState, useCallback } from 'react'
import { usePrimitives } from '../adapters'

// Validation Result monad - composable validation
export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string }

export const ValidationResult = {
  ok: (): ValidationResult => ({ valid: true }),
  err: (error: string): ValidationResult => ({ valid: false, error }),

  // Functor: map over success
  map: (result: ValidationResult, fn: () => ValidationResult): ValidationResult =>
    result.valid ? fn() : result,

  // Chain multiple validators (monadic bind)
  chain: (...validators: ((value: string) => ValidationResult)[]): (value: string) => ValidationResult =>
    (value: string) => validators.reduce(
      (acc, validator) => ValidationResult.map(acc, () => validator(value)),
      ValidationResult.ok()
    ),
}

// Common validators (composable building blocks)
export const Validators = {
  required: (message = 'This field is required'): ((value: string) => ValidationResult) =>
    (value: string) => value.trim() ? ValidationResult.ok() : ValidationResult.err(message),

  minLength: (min: number, message?: string): ((value: string) => ValidationResult) =>
    (value: string) => value.length >= min
      ? ValidationResult.ok()
      : ValidationResult.err(message ?? `Must be at least ${min} characters`),

  maxLength: (max: number, message?: string): ((value: string) => ValidationResult) =>
    (value: string) => value.length <= max
      ? ValidationResult.ok()
      : ValidationResult.err(message ?? `Must be at most ${max} characters`),

  pattern: (regex: RegExp, message: string): ((value: string) => ValidationResult) =>
    (value: string) => regex.test(value) ? ValidationResult.ok() : ValidationResult.err(message),

  numeric: (message = 'Must be a valid number'): ((value: string) => ValidationResult) =>
    (value: string) => value === '' || !isNaN(parseFloat(value))
      ? ValidationResult.ok()
      : ValidationResult.err(message),

  positive: (message = 'Must be a positive number'): ((value: string) => ValidationResult) =>
    (value: string) => value === '' || parseFloat(value) > 0
      ? ValidationResult.ok()
      : ValidationResult.err(message),
}

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

      <Box style={{ position: 'relative' }}>
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
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
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
