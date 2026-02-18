import React from 'react'
import {
  Box as MDSBox,
  Text as MDSText,
  Button as MDSButton,
  ButtonIcon as MDSButtonIcon,
  TextVariant,
  TextColor,
  FontWeight,
  BoxBackgroundColor,
  BoxBorderColor,
  ButtonVariant,
  ButtonBaseSize,
  ButtonIconSize,
  IconName,
} from '@metamask/design-system-react'
import type {
  UIAdapter,
  BoxProps,
  TextProps,
  PressableProps,
  TextInputProps,
  ScrollViewProps,
  ButtonProps,
  IconButtonProps,
  TextVariant as AdapterTextVariant,
  SemanticColor,
  BackgroundColor,
  BorderColor,
  ButtonVariant as AdapterButtonVariant,
  ButtonSize,
  IconName as AdapterIconName,
} from './types'

// Map adapter text variants to MDS TextVariant
const textVariantMap: Record<AdapterTextVariant, TextVariant> = {
  headingLg: TextVariant.HeadingLg,
  headingMd: TextVariant.HeadingMd,
  headingSm: TextVariant.HeadingSm,
  bodyLg: TextVariant.BodyLg,
  bodyMd: TextVariant.BodyMd,
  bodySm: TextVariant.BodySm,
  bodyXs: TextVariant.BodyXs,
}

// Map adapter semantic colors to MDS TextColor
const textColorMap: Record<SemanticColor, TextColor> = {
  default: TextColor.TextDefault,
  alternative: TextColor.TextAlternative,
  muted: TextColor.TextMuted,
  primary: TextColor.PrimaryDefault,
  error: TextColor.ErrorDefault,
  success: TextColor.SuccessDefault,
  warning: TextColor.WarningDefault,
  info: TextColor.InfoDefault,
}

// Map adapter background colors to MDS BoxBackgroundColor
const backgroundColorMap: Record<BackgroundColor, BoxBackgroundColor> = {
  default: BoxBackgroundColor.BackgroundDefault,
  alternative: BoxBackgroundColor.BackgroundAlternative,
  muted: BoxBackgroundColor.BackgroundMuted,
  primaryMuted: BoxBackgroundColor.PrimaryMuted,
  errorMuted: BoxBackgroundColor.ErrorMuted,
  successMuted: BoxBackgroundColor.SuccessMuted,
  warningMuted: BoxBackgroundColor.WarningMuted,
  infoMuted: BoxBackgroundColor.InfoMuted,
}

// Map adapter border colors to MDS BoxBorderColor
const borderColorMap: Record<BorderColor, BoxBorderColor> = {
  default: BoxBorderColor.BorderDefault,
  muted: BoxBorderColor.BorderMuted,
  primary: BoxBorderColor.PrimaryDefault,
  error: BoxBorderColor.ErrorDefault,
  success: BoxBorderColor.SuccessDefault,
  warning: BoxBorderColor.WarningDefault,
  info: BoxBorderColor.InfoDefault,
  transparent: BoxBorderColor.Transparent,
}

// Map adapter border colors to CSS custom properties (for directional borders passed via style)
const borderColorCSSMap: Record<BorderColor, string> = {
  default: 'var(--color-border-default)',
  muted: 'var(--color-border-muted)',
  primary: 'var(--color-primary-default)',
  error: 'var(--color-error-default)',
  success: 'var(--color-success-default)',
  warning: 'var(--color-warning-default)',
  info: 'var(--color-info-default)',
  transparent: 'transparent',
}

// Map adapter button variants to MDS ButtonVariant
const buttonVariantMap: Record<AdapterButtonVariant, ButtonVariant> = {
  primary: ButtonVariant.Primary,
  secondary: ButtonVariant.Secondary,
  tertiary: ButtonVariant.Tertiary,
  danger: ButtonVariant.Primary, // MDS doesn't have danger, use Primary with isDanger
}

// Map adapter button sizes to MDS ButtonBaseSize
const buttonSizeMap: Record<ButtonSize, ButtonBaseSize> = {
  sm: ButtonBaseSize.Sm,
  md: ButtonBaseSize.Md,
  lg: ButtonBaseSize.Lg,
}

// Map adapter icon names to MDS IconName
const iconNameMap: Record<AdapterIconName, IconName> = {
  wallet: IconName.Wallet,
  light: IconName.Light,
  dark: IconName.Dark,
  close: IconName.Close,
  check: IconName.Check,
  warning: IconName.Warning,
  info: IconName.Info,
  error: IconName.Danger,
}

// Map adapter button sizes to MDS ButtonIconSize
const buttonIconSizeMap: Record<ButtonSize, ButtonIconSize> = {
  sm: ButtonIconSize.Sm,
  md: ButtonIconSize.Md,
  lg: ButtonIconSize.Lg,
}

// Map font weight to MDS FontWeight
const fontWeightMap: Record<string, FontWeight> = {
  normal: FontWeight.Regular,
  medium: FontWeight.Medium,
  semibold: FontWeight.Bold,
  bold: FontWeight.Bold,
}

// Web adapter - wraps MetaMask Design System for web platform
export const webAdapter: UIAdapter = {
  Box: function Box({
    children,
    style,
    className,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
    marginBottom,
    marginTop,
    flexDirection,
    alignItems,
    justifyContent,
    backgroundColor,
    borderWidth,
    borderColor,
    borderRadius,
    onPress,
    position,
    top,
    right,
    bottom,
    left,
    zIndex,
    flex,
    flexWrap,
    flexGrow,
    width,
    height,
    maxWidth,
    minWidth,
    maxHeight,
    minHeight,
    overflow,
    opacity,
    borderBottomWidth,
    borderBottomColor,
    borderTopWidth,
    borderTopColor,
  }: BoxProps) {
    const extraStyle: React.CSSProperties = {
      ...(borderRadius && { borderRadius }),
      ...(position && { position }),
      ...(top !== undefined && { top }),
      ...(right !== undefined && { right }),
      ...(bottom !== undefined && { bottom }),
      ...(left !== undefined && { left }),
      ...(zIndex !== undefined && { zIndex }),
      ...(flex !== undefined && { flex }),
      ...(flexWrap && { flexWrap }),
      ...(flexGrow !== undefined && { flexGrow }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(minWidth !== undefined && { minWidth }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(minHeight !== undefined && { minHeight }),
      ...(overflow && { overflow }),
      ...(opacity !== undefined && { opacity }),
      ...(borderBottomWidth !== undefined && { borderBottomWidth }),
      ...(borderBottomColor && { borderBottomColor: borderColorCSSMap[borderBottomColor] }),
      ...(borderTopWidth !== undefined && { borderTopWidth }),
      ...(borderTopColor && { borderTopColor: borderColorCSSMap[borderTopColor] }),
      ...style as React.CSSProperties,
    }

    const content = (
      <MDSBox
        className={className}
        style={extraStyle}
        gap={gap as never}
        padding={padding as never}
        paddingVertical={paddingVertical as never}
        paddingHorizontal={paddingHorizontal as never}
        margin={margin as never}
        marginVertical={marginVertical as never}
        marginHorizontal={marginHorizontal as never}
        marginBottom={marginBottom as never}
        marginTop={marginTop as never}
        flexDirection={flexDirection as never}
        alignItems={alignItems as never}
        justifyContent={justifyContent as never}
        backgroundColor={backgroundColor ? backgroundColorMap[backgroundColor] : undefined}
        borderWidth={borderWidth as never}
        borderColor={borderColor ? borderColorMap[borderColor] : undefined}
      >
        {children}
      </MDSBox>
    )

    if (onPress) {
      return <button type="button" onClick={onPress} style={{ all: 'unset', cursor: 'pointer', display: 'contents' }}>{content}</button>
    }
    return content
  },

  Text: function Text({ children, style, className, variant = 'bodyMd', color, fontWeight, fontFamily, textAlign }: TextProps) {
    // MDS doesn't have a monospace font family, so we use inline style
    const monoStyle = fontFamily === 'mono' ? { fontFamily: 'ui-monospace, monospace' } : {}
    return (
      <MDSText
        className={className}
        variant={textVariantMap[variant]}
        color={color ? textColorMap[color] : undefined}
        fontWeight={fontWeight ? fontWeightMap[fontWeight] : undefined}
        style={{ ...monoStyle, ...(textAlign && { textAlign }), ...style as React.CSSProperties }}
      >
        {children}
      </MDSText>
    )
  },

  Pressable: function Pressable({ children, style, className, onPress, disabled }: PressableProps) {
    return (
      <button
        type="button"
        className={className}
        style={{ all: 'unset', cursor: disabled ? 'not-allowed' : 'pointer', ...style as React.CSSProperties }}
        onClick={onPress}
        disabled={disabled}
      >
        {children}
      </button>
    )
  },

  TextInput: function TextInput({ value, onChangeText, onBlur, placeholder, disabled, style, className, type, hasError }: TextInputProps) {
    const borderClass = hasError
      ? 'border-error-default focus:border-error-default'
      : 'border-default focus:border-primary-default'

    return (
      <input
        type={type ?? 'text'}
        value={value}
        onChange={e => onChangeText?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 text-base border-2 rounded-lg outline-none transition-colors
          ${borderClass}
          disabled:bg-muted disabled:cursor-not-allowed
          ${className ?? ''}`}
        style={style as React.CSSProperties}
      />
    )
  },

  ScrollView: function ScrollView({ children, style, className }: ScrollViewProps) {
    return (
      <div className={className} style={{ overflow: 'auto', ...style as React.CSSProperties }}>
        {children}
      </div>
    )
  },

  Button: function Button({
    children,
    variant = 'primary',
    size = 'md',
    onPress,
    disabled,
    loading,
    loadingText,
    fullWidth,
    type = 'button',
  }: ButtonProps) {
    return (
      <MDSButton
        variant={buttonVariantMap[variant]}
        size={buttonSizeMap[size]}
        onClick={onPress}
        isDisabled={disabled}
        isLoading={loading}
        loadingText={loadingText}
        isFullWidth={fullWidth}
        isDanger={variant === 'danger'}
        type={type}
      >
        {children}
      </MDSButton>
    )
  },

  IconButton: function IconButton({ icon, size = 'md', onPress, disabled, label }: IconButtonProps) {
    return (
      <MDSButtonIcon
        iconName={iconNameMap[icon]}
        size={buttonIconSizeMap[size]}
        onClick={onPress}
        isDisabled={disabled}
        ariaLabel={label}
      />
    )
  },

  applyTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  },

  getSystemTheme: () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },
}
