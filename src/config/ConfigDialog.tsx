import { usePrimitives } from '../adapters'
import { useUIConfig } from './UIConfigContext'
import type { ConfigProperty } from './types'

export function ConfigDialog() {
  const { Box, Text, Button } = usePrimitives()
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={closeDialog}
      />

      {/* Dialog */}
      <Box
        backgroundColor="default"
        borderRadius={16}
        padding={6}
        position="relative"
        width={360}
        maxHeight="80vh"
        overflow="scroll"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={4}>
          <Box flexDirection="column" gap={1}>
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
    </div>
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
      return (
        <SliderEditor
          value={value as number}
          min={property.min}
          max={property.max}
          step={property.step}
          onChange={onChange}
        />
      )
    case 'text':
      return <TextEditor value={value as string} onChange={onChange} />
    case 'color':
      return <ColorEditor value={value as string} onChange={onChange} />
  }
}

function BooleanEditor({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { Box, Text, Pressable } = usePrimitives()
  return (
    <Box flexDirection="row" gap={2}>
      {[true, false].map(opt => (
        <Pressable key={String(opt)} onPress={() => onChange(opt)}>
          <Box
            paddingVertical={2}
            paddingHorizontal={4}
            borderRadius={8}
            borderWidth={2}
            borderColor={value === opt ? 'primary' : 'default'}
            backgroundColor={value === opt ? 'primaryMuted' : undefined}
          >
            <Text variant="bodySm">{opt ? 'On' : 'Off'}</Text>
          </Box>
        </Pressable>
      ))}
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
  const { Box, Text, Pressable } = usePrimitives()
  return (
    <Box flexDirection="row" gap={2} flexWrap="wrap">
      {options.map(opt => (
        <Pressable key={opt} onPress={() => onChange(opt)}>
          <Box
            paddingVertical={2}
            paddingHorizontal={4}
            borderRadius={8}
            borderWidth={2}
            borderColor={value === opt ? 'primary' : 'default'}
            backgroundColor={value === opt ? 'primaryMuted' : undefined}
          >
            <Text variant="bodySm">{opt}</Text>
          </Box>
        </Pressable>
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
  const { Box, Text } = usePrimitives()
  return (
    <Box flexDirection="column" gap={1}>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <Text variant="bodyXs" color="muted">
        {value}
      </Text>
    </Box>
  )
}

function TextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { TextInput } = usePrimitives()
  return (
    <TextInput value={value} onChangeText={onChange} />
  )
}

function ColorEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { Box, TextInput } = usePrimitives()
  return (
    <Box flexDirection="row" gap={2} alignItems="center">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }}
      />
      <Box flex={1}>
        <TextInput value={value} onChangeText={onChange} />
      </Box>
    </Box>
  )
}
