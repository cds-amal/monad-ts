import { useState, useRef, useEffect } from 'react'
import { usePrimitives } from '../adapters'
import { useServices } from '../services/ServicesContext'
import { useFeatureFlag } from '../features'

interface FlaggedAddressTooltipProps {
  address: string
  onDismiss?: () => void
}

/**
 * Web tooltip component for flagged addresses.
 * Shows info icon that reveals explanation on hover/click.
 */
export function FlaggedAddressTooltip({ address, onDismiss }: FlaggedAddressTooltipProps) {
  const { Box, Text, Pressable } = usePrimitives()
  const { getFlagDetails } = useServices()
  const enableFlaggedAddressExplanation = useFeatureFlag('enableFlaggedAddressExplanation')
  const [showDetails, setShowDetails] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!showDetails) return

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowDetails(false)
        onDismiss?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDetails, onDismiss])

  if (!enableFlaggedAddressExplanation) return null

  const details = getFlagDetails(address)
  if (!details) return null

  return (
    <Box position="relative" style={{ display: 'inline-flex' }}>
      <Pressable
        onPress={() => setShowDetails(!showDetails)}
        style={{
          cursor: 'pointer',
          padding: 2,
          borderRadius: 4,
          opacity: 0.7,
        }}
      >
        <Text variant="bodyXs" color="muted" style={{ fontSize: 12 }}>
          ⓘ
        </Text>
      </Pressable>

      {showDetails && (
        <div ref={tooltipRef}>
          <Box
            position="absolute"
            top="100%"
            left={0}
            marginTop={1}
            zIndex={1000}
            minWidth={240}
            maxWidth={320}
            backgroundColor="default"
            borderWidth={1}
            borderColor="muted"
            borderRadius={8}
            padding={3}
          >
            {/* Header with close button */}
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-start"
              marginBottom={2}
            >
              <Text variant="bodySm" fontWeight="semibold" color="error">
                {details.reason}
              </Text>
              <Pressable
                onPress={() => {
                  setShowDetails(false)
                  onDismiss?.()
                }}
                style={{ padding: 2, marginLeft: 8 }}
              >
                <Text variant="bodyXs" color="muted">
                  ✕
                </Text>
              </Pressable>
            </Box>

            {/* Details text */}
            <Text variant="bodyXs" color="alternative" style={{ lineHeight: 1.4 }}>
              {details.details}
            </Text>
          </Box>
        </div>
      )}
    </Box>
  )
}
