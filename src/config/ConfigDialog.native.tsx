import { Modal, ScrollView } from 'react-native'
import { usePrimitives } from '../adapters'
import { useUIConfig } from './UIConfigContext'
import type { ConfigProperty } from './types'

export function ConfigDialog() {
  const { Box, Text, Button, Pressable } = usePrimitives()
  const { registry, overrides, activeElementId, closeDialog, setOverride, resetElement } = useUIConfig()

  if (!activeElementId) return null

  const config = registry.current.get(activeElementId)
  if (!config) return null

  const elementOverrides = overrides[activeElementId] ?? {}

  function resolveValue(key: string, prop: ConfigProperty): string | number | boolean {
    if (key in elementOverrides) return elementOverrides[key] as string | number | boolean
    return prop.currentValue
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={closeDialog}
    >
      {/* Backdrop */}
      <Pressable
        onPress={closeDialog}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        {/* Dialog (Pressable with no-op onPress to stop event propagation) */}
        <Pressable onPress={() => {}}>
          <Box
            backgroundColor="default"
            borderRadius={16}
            padding={6}
            style={{
              width: 320,
              maxHeight: 480,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Header */}
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={4}>
              <Box flexDirection="column" gap={1} style={{ flex: 1 }}>
                <Text variant="headingSm">
                  Configure {config.displayName}
                </Text>
                <Text variant="bodyXs" color="muted">
                  {config.elementType}
                </Text>
              </Box>
              <Button variant="tertiary" size="sm" onPress={closeDialog}>
                Close
              </Button>
            </Box>

            {/* Properties */}
            <ScrollView style={{ flexGrow: 0 }}>
              <Box flexDirection="column" gap={4}>
                {Object.entries(config.properties).map(([key, prop]) => {
                  const currentValue = resolveValue(key, prop)
                  return (
                    <Box key={key} flexDirection="column" gap={2}>
                      <Text variant="bodySm" fontWeight="medium">
                        {prop.label}
                      </Text>
                      <PropertyEditor
                        property={prop}
                        value={currentValue}
                        onChange={(val) => setOverride(activeElementId!, key, val)}
                      />
                    </Box>
                  )
                })}
              </Box>
            </ScrollView>

            {/* Reset button */}
            <Box marginVertical={4}>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onPress={() => resetElement(activeElementId!)}
              >
                Reset to Defaults
              </Button>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function PropertyEditor({
  property,
  value,
  onChange,
}: {
  property: ConfigProperty
  value: string | number | boolean
  onChange: (value: string | number | boolean) => void
}) {
  switch (property.type) {
    case 'boolean':
      return <BooleanEditor value={value as boolean} onChange={onChange} />
    case 'select':
      return <SelectEditor options={property.options} value={value as string} onChange={onChange} />
    case 'slider':
      return <SliderEditor value={value as number} min={property.min} max={property.max} step={property.step} onChange={onChange} />
    case 'text':
      return <TextEditor value={value as string} onChange={onChange} />
    case 'color':
      return <TextEditor value={value as string} onChange={onChange} />
  }
}

function ChipButton({
  label,
  selected,
  onPress,
}: {
  label: string
  selected: boolean
  onPress: () => void
}) {
  const { Box, Text, Pressable } = usePrimitives()
  return (
    <Pressable onPress={onPress}>
      <Box
        paddingVertical={2}
        paddingHorizontal={4}
        borderRadius={8}
        borderWidth={2}
        borderColor={selected ? 'primary' : 'muted'}
        backgroundColor={selected ? 'primaryMuted' : undefined}
      >
        <Text variant="bodySm">{label}</Text>
      </Box>
    </Pressable>
  )
}

function BooleanEditor({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { Box } = usePrimitives()
  return (
    <Box flexDirection="row" gap={2}>
      <ChipButton label="On" selected={value === true} onPress={() => onChange(true)} />
      <ChipButton label="Off" selected={value === false} onPress={() => onChange(false)} />
    </Box>
  )
}

function SelectEditor({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const { Box } = usePrimitives()
  return (
    <Box flexDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
      {options.map(opt => (
        <ChipButton key={opt} label={opt} selected={value === opt} onPress={() => onChange(opt)} />
      ))}
    </Box>
  )
}

function SliderEditor({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}) {
  const { Box, Text, Pressable } = usePrimitives()
  const s = step ?? 1
  return (
    <Box flexDirection="row" gap={3} alignItems="center">
      <Pressable onPress={() => onChange(Math.max(min, value - s))}>
        <Box
          paddingVertical={2}
          paddingHorizontal={4}
          borderRadius={8}
          borderWidth={2}
          borderColor="muted"
        >
          <Text variant="bodyMd" fontWeight="bold">−</Text>
        </Box>
      </Pressable>
      <Text variant="bodyMd" fontWeight="medium">{value}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + s))}>
        <Box
          paddingVertical={2}
          paddingHorizontal={4}
          borderRadius={8}
          borderWidth={2}
          borderColor="muted"
        >
          <Text variant="bodyMd" fontWeight="bold">+</Text>
        </Box>
      </Pressable>
    </Box>
  )
}

function TextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { Box, TextInput } = usePrimitives()
  return (
    <Box>
      <TextInput value={value} onChangeText={onChange} />
    </Box>
  )
}
