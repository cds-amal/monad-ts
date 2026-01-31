import { useTheme, useColors } from '../context/ThemeContext'
import { useRender, useStyle } from '../context/AdapterContext'

export function ThemeToggle() {
  const { Text, Pressable } = useRender()
  const { normalize } = useStyle()
  const { isDark, toggleTheme } = useTheme()
  const c = useColors()

  const buttonStyle = normalize({
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.bgCard,
  })

  const textStyle = normalize({
    fontSize: 14,
    fontWeight: '500',
    color: c.text,
  })

  return (
    <Pressable style={buttonStyle} onPress={toggleTheme}>
      <Text style={textStyle}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </Text>
    </Pressable>
  )
}
