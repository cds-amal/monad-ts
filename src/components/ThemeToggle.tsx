import { ButtonIcon, IconName, ButtonIconSize } from '@metamask/design-system-react'
import { useTheme } from '../theme/useTheme'

export function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <ButtonIcon
      iconName={isDark ? IconName.Light : IconName.Dark}
      size={ButtonIconSize.Sm}
      onClick={toggle}
      ariaLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  )
}
