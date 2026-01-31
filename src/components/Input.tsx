import { forwardRef, useId, useState, useCallback } from 'react'
import { Box, Text, TextVariant, FontWeight, TextColor, BoxBackgroundColor, BoxBorderColor } from '@metamask/design-system-react'

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

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  validate?: (value: string) => ValidationResult
  validateOnBlur?: boolean
  validateOnChange?: boolean
  onChange?: (value: string) => void
  endAdornment?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error: externalError,
    hint,
    validate,
    validateOnBlur = true,
    validateOnChange = false,
    onChange,
    onBlur,
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
  const [internalError, setInternalError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const error = externalError ?? internalError

  const runValidation = useCallback((value: string) => {
    if (validate) {
      const result = validate(value)
      setInternalError(result.valid ? null : result.error)
      return result
    }
    return ValidationResult.ok()
  }, [validate])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange?.(value)
    if (validateOnChange && touched) {
      runValidation(value)
    }
  }, [onChange, validateOnChange, touched, runValidation])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)
    if (validateOnBlur) {
      runValidation(e.target.value)
    }
    onBlur?.(e)
  }, [validateOnBlur, runValidation, onBlur])

  const hasError = !!error && touched
  const borderColor = hasError
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
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {endAdornment && (
          <Box className="absolute right-2 top-1/2 -translate-y-1/2">
            {endAdornment}
          </Box>
        )}
      </Box>

      {hasError && (
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

      {hint && !hasError && (
        <Text variant={TextVariant.BodyXs} color={TextColor.TextAlternative}>
          {hint}
        </Text>
      )}
    </Box>
  )
})
