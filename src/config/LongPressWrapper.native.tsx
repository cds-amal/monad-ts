import type { ReactNode } from 'react'
import { Pressable } from 'react-native'

interface LongPressWrapperProps {
  onLongPress: () => void
  children: ReactNode
}

export function LongPressWrapper({ onLongPress, children }: LongPressWrapperProps) {
  return (
    <Pressable onLongPress={onLongPress}>
      {children}
    </Pressable>
  )
}
