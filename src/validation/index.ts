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
