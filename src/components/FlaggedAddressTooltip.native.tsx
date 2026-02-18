import { useState, useRef } from 'react'
import { Animated, Dimensions, PanResponder, Modal, Platform, StatusBar } from 'react-native'
import { usePrimitives } from '../adapters'
import { useServices } from '../services/ServicesContext'
import { useFeatureFlag } from '../features'
import { useTheme } from '../theme/useTheme'
import { lightTheme, darkTheme } from '../adapters/tokens.native'

interface FlaggedAddressTooltipProps {
  address: string
  onDismiss?: () => void
}

const SCREEN_HEIGHT = Dimensions.get('window').height
const CARD_HEIGHT = SCREEN_HEIGHT / 3 // 1/3 of screen
// Safe area top inset (status bar + notch)
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 59 : (StatusBar.currentHeight || 24)

/**
 * Native tooltip for flagged addresses.
 * Shows warning icon that user can:
 * - Tap to view details card (slides in from top)
 * - Long press to dismiss
 */
export function FlaggedAddressTooltip({ address, onDismiss }: FlaggedAddressTooltipProps) {
  const { Box, Text, Pressable } = usePrimitives()
  const { getFlagDetails } = useServices()
  const enableFlaggedAddressExplanation = useFeatureFlag('enableFlaggedAddressExplanation')
  const { isDark } = useTheme()
  const tokens = isDark ? darkTheme : lightTheme
  const [showCard, setShowCard] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Animation for card - starts off screen
  const slideAnim = useRef(new Animated.Value(-CARD_HEIGHT)).current

  // Pan responder for swipe-to-dismiss on card
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -30) {
          hideCard()
        }
      },
    })
  ).current

  const showCardAnimated = () => {
    slideAnim.setValue(-CARD_HEIGHT) // Reset position
    setShowCard(true)
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const hideCard = () => {
    Animated.timing(slideAnim, {
      toValue: -CARD_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCard(false)
    })
  }

  const handleIconTap = () => {
    if (showCard) {
      hideCard()
    } else {
      showCardAnimated()
    }
  }

  const handleIconLongPress = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (!enableFlaggedAddressExplanation) return null
  if (dismissed) return null

  const details = getFlagDetails(address)
  if (!details) return null

  return (
    <>
      {/* Warning icon */}
      <Pressable
        onPress={handleIconTap}
        onLongPress={handleIconLongPress}
        style={{ padding: 4 }}
      >
        <Text variant="bodyXs" color="error">
          ⚠
        </Text>
      </Pressable>

      {/* Modal overlay with sliding card from top */}
      <Modal
        visible={showCard}
        transparent
        animationType="none"
        onRequestClose={hideCard}
      >
        <Box flex={1}>
          {/* Backdrop - tap to dismiss */}
          <Pressable
            onPress={hideCard}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />

          {/* Sliding card */}
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              top: STATUS_BAR_HEIGHT,
              left: 0,
              right: 0,
              height: CARD_HEIGHT,
              transform: [{ translateY: slideAnim }],
              backgroundColor: tokens.colors.error.muted,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 8,
              padding: 16,
              borderBottomWidth: 2,
              borderBottomColor: tokens.colors.error.default,
            }}
          >
            {/* Header */}
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={3}>
              <Box flexDirection="row" alignItems="center" gap={2}>
                <Text variant="headingSm" color="error">
                  ⚠
                </Text>
                <Text variant="headingSm" fontWeight="bold" color="error">
                  {details.reason}
                </Text>
              </Box>
              <Pressable onPress={hideCard} style={{ padding: 8 }}>
                <Text variant="bodyMd" color="muted">
                  ✕
                </Text>
              </Pressable>
            </Box>

            {/* Details - always visible */}
            <Box flex={1}>
              <Text variant="bodyMd" color="default" style={{ lineHeight: 22 }}>
                {details.details}
              </Text>
            </Box>

            {/* Hint at bottom */}
            <Box borderTopWidth={1} borderTopColor="muted" style={{ paddingTop: 12, marginTop: 12 }}>
              <Text variant="bodyXs" color="muted" textAlign="center">
                Swipe up or tap outside to dismiss
              </Text>
            </Box>
          </Animated.View>
        </Box>
      </Modal>
    </>
  )
}
