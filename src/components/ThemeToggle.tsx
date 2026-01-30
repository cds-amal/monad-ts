import { useStyle, useTheme } from '../context'
import { Box } from '../adapters/browser'

export function ThemeToggle() {
  const style = useStyle()
  const { isDark, toggleTheme } = useTheme()

  return (
    <Box
      as="button"
      styles={style.button({ intent: 'neutral', size: 'md' })}
      onClick={toggleTheme}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </Box>
  )
}
