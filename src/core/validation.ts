/**
 * Core validation logic - pure functions, no platform dependencies.
 * Uses Result monad for composable validation.
 */

// Result monad for validation
export type Result<E, A> =
  | { tag: 'ok'; value: A }
  | { tag: 'err'; error: E }

export const Result = {
  ok<E, A>(value: A): Result<E, A> {
    return { tag: 'ok', value }
  },

  err<E, A>(error: E): Result<E, A> {
    return { tag: 'err', error }
  },

  isOk<E, A>(result: Result<E, A>): result is { tag: 'ok'; value: A } {
    return result.tag === 'ok'
  },

  isErr<E, A>(result: Result<E, A>): result is { tag: 'err'; error: E } {
    return result.tag === 'err'
  },

  map<E, A, B>(result: Result<E, A>, f: (a: A) => B): Result<E, B> {
    return result.tag === 'ok' ? Result.ok(f(result.value)) : result
  },

  flatMap<E, A, B>(result: Result<E, A>, f: (a: A) => Result<E, B>): Result<E, B> {
    return result.tag === 'ok' ? f(result.value) : result
  },
}

// Validation error type
export interface ValidationError {
  field: string
  message: string
  code: string
}

export type ValidationResult<T> = Result<ValidationError[], T>

// Validator type - a function that validates a value
export type Validator<T> = (value: T) => ValidationResult<T>

// Create a passing validation
export const pass = <T>(value: T): ValidationResult<T> => Result.ok(value)

// Create a failing validation
export const fail = <T>(error: ValidationError): ValidationResult<T> => Result.err([error])

// Create a validator from a predicate
export function check<T>(
  predicate: (value: T) => boolean,
  error: Omit<ValidationError, 'field'> & { field?: string }
): Validator<T> {
  return (value: T) =>
    predicate(value)
      ? pass(value)
      : fail({ field: error.field ?? 'value', message: error.message, code: error.code })
}

// Compose validators - runs all and collects errors
export function all<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    const errors: ValidationError[] = []

    for (const validator of validators) {
      const result = validator(value)
      if (Result.isErr(result)) {
        errors.push(...result.error)
      }
    }

    return errors.length > 0 ? Result.err(errors) : pass(value)
  }
}

// Chain validators - short-circuits on first error
export function chain<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    for (const validator of validators) {
      const result = validator(value)
      if (Result.isErr(result)) {
        return result
      }
    }
    return pass(value)
  }
}

// Conditional validator
export function when<T>(
  condition: (value: T) => boolean,
  validator: Validator<T>
): Validator<T> {
  return (value: T) => (condition(value) ? validator(value) : pass(value))
}

// --- Common validators ---

export const required = (field: string) =>
  check<string>(
    (v) => v !== null && v !== undefined && v.trim() !== '',
    { field, message: `${field} is required`, code: 'REQUIRED' }
  )

export const minLength = (field: string, min: number) =>
  check<string>(
    (v) => v.length >= min,
    { field, message: `${field} must be at least ${min} characters`, code: 'MIN_LENGTH' }
  )

export const pattern = (field: string, regex: RegExp, message: string) =>
  check<string>(
    (v) => regex.test(v),
    { field, message, code: 'PATTERN' }
  )

export const min = (field: string, minVal: number) =>
  check<number>(
    (v) => v >= minVal,
    { field, message: `${field} must be at least ${minVal}`, code: 'MIN' }
  )

export const positive = (field: string) =>
  check<number>(
    (v) => v > 0,
    { field, message: `${field} must be positive`, code: 'POSITIVE' }
  )

// --- Ethereum-specific validators ---

export const ethereumAddress = (field: string) =>
  chain(
    required(field),
    pattern(field, /^0x/, 'Address must start with 0x'),
    check<string>(
      (v) => v.length === 42,
      { field, message: 'Address must be 42 characters', code: 'ADDRESS_LENGTH' }
    )
  )

export const notInSet = (field: string, set: Set<string>, errorMsg: string, code: string) =>
  check<string>(
    (v) => !set.has(v.toLowerCase()),
    { field, message: errorMsg, code }
  )
