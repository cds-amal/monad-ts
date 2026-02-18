import type { ReactNode } from 'react'
import { useLongPress } from './useLongPress'

interface LongPressWrapperProps {
  onLongPress: () => void
  children: ReactNode
}

export function LongPressWrapper({ onLongPress, children }: LongPressWrapperProps) {
  const handlers = useLongPress(onLongPress)
  return <div {...handlers}>{children}</div>
}
