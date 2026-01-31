import { usePrimitives } from '../adapters'
import { useTheme } from '../theme/useTheme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const { IconButton } = usePrimitives()

  return (
    <IconButton
      icon={isDark ? 'light' : 'dark'}
      size="sm"
      onPress={toggleTheme}
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  )
}
