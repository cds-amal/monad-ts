import { useTheme, useColors } from '../context/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const c = useColors()

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 500,
    border: `1px solid ${c.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: c.bgCard,
    color: c.text,
    transition: 'all 0.2s ease',
  }

  return (
    <button style={buttonStyle} onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
