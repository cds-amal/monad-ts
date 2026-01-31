import { useState, useCallback, ReactNode } from 'react'
import { Box, Text, TextVariant, TextColor, FontWeight } from '@metamask/design-system-react'

interface DropdownProps<T> {
  value: T | undefined
  disabled?: boolean
  placeholder?: string
  renderTrigger: (value: T) => ReactNode
  children: (close: () => void) => ReactNode
}

// Generic Dropdown primitive - reusable for any dropdown use case
export function Dropdown<T>({
  value,
  disabled,
  placeholder = 'Select...',
  renderTrigger,
  children,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <Box className="relative">
      <button
        type="button"
        className={`w-full p-3 text-sm border-2 border-default rounded-lg text-left flex justify-between items-center
          ${disabled ? 'bg-muted cursor-not-allowed' : 'bg-default cursor-pointer'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {value !== undefined ? (
          renderTrigger(value)
        ) : (
          <Text variant={TextVariant.BodySm} color={TextColor.TextMuted}>
            {placeholder}
          </Text>
        )}
        <Text variant={TextVariant.BodySm} color={TextColor.TextMuted}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </button>

      {isOpen && (
        <Box className="absolute top-full left-0 right-0 mt-1 bg-default border-2 border-default rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {children(close)}
        </Box>
      )}
    </Box>
  )
}

// Dropdown.Group - for grouped options
interface DropdownGroupProps {
  label: string
  children: ReactNode
}

Dropdown.Group = function DropdownGroup({ label, children }: DropdownGroupProps) {
  return (
    <Box>
      <Box className="py-2 px-3 border-b border-default bg-muted">
        <Text
          variant={TextVariant.BodyXs}
          fontWeight={FontWeight.Bold}
          color={TextColor.TextMuted}
          className="uppercase tracking-wider"
        >
          {label}
        </Text>
      </Box>
      {children}
    </Box>
  )
}

// Dropdown.Item - for individual options
interface DropdownItemProps {
  onClick: () => void
  children: ReactNode
}

Dropdown.Item = function DropdownItem({ onClick, children }: DropdownItemProps) {
  return (
    <Box
      className="py-2.5 px-3 cursor-pointer border-b border-default/50 transition-colors hover:bg-muted"
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
