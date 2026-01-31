import { useState, useCallback, ReactNode } from 'react'
import { usePrimitives } from '../adapters'

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
  const { Box, Text, Pressable, ScrollView } = usePrimitives()
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <Box style={{ position: 'relative' }}>
      <Pressable
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={3}
          borderRadius={8}
          borderWidth={2}
          borderColor="default"
          backgroundColor={disabled ? 'muted' : 'default'}
          style={{ opacity: disabled ? 0.6 : 1 }}
        >
          {value !== undefined ? (
            renderTrigger(value)
          ) : (
            <Text variant="bodySm" color="muted">
              {placeholder}
            </Text>
          )}
          <Text variant="bodySm" color="muted">
            {isOpen ? '▲' : '▼'}
          </Text>
        </Box>
      </Pressable>

      {isOpen && (
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            zIndex: 50,
            maxHeight: 320,
          }}
          borderRadius={8}
          borderWidth={2}
          borderColor="default"
          backgroundColor="default"
        >
          <ScrollView style={{ maxHeight: 320 }}>
            {children(close)}
          </ScrollView>
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
  const { Box, Text } = usePrimitives()

  return (
    <Box>
      <Box
        paddingVertical={2}
        paddingHorizontal={3}
        borderColor="default"
        backgroundColor="muted"
        style={{ borderBottomWidth: 1 }}
      >
        <Text variant="bodyXs" fontWeight="bold" color="muted">
          {label.toUpperCase()}
        </Text>
      </Box>
      {children}
    </Box>
  )
}

// Dropdown.Item - for individual options
interface DropdownItemProps {
  onPress: () => void
  children: ReactNode
}

Dropdown.Item = function DropdownItem({ onPress, children }: DropdownItemProps) {
  const { Box, Pressable } = usePrimitives()

  return (
    <Pressable onPress={onPress}>
      <Box
        paddingVertical={3}
        paddingHorizontal={3}
        borderColor="muted"
        style={{ borderBottomWidth: 1 }}
      >
        {children}
      </Box>
    </Pressable>
  )
}
