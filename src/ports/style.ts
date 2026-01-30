/**
 * StylePort - Interface for style resolution.
 * Core defines semantic intent, adapters resolve to platform-specific styles.
 */

// Semantic tokens - platform agnostic
export type ColorIntent = 'primary' | 'success' | 'error' | 'warning' | 'neutral'
export type Size = 'sm' | 'md' | 'lg'

// Component variant descriptors (pure data, no platform specifics)
export interface ButtonVariant {
  intent?: ColorIntent
  size?: Size
  disabled?: boolean
  loading?: boolean
}

export interface BadgeVariant {
  intent?: ColorIntent
  size?: Size
}

export interface InputVariant {
  size?: Size
  error?: boolean
  disabled?: boolean
}

export interface CardVariant {
  elevated?: boolean
}

export interface AlertVariant {
  intent?: ColorIntent
}

export interface SelectableVariant {
  selected?: boolean
}

export interface DropdownVariant {
  disabled?: boolean
  open?: boolean
}

// StylePort interface - what adapters must implement
export interface StylePort<TStyle> {
  // Resolve semantic variants to platform style
  button(variant?: ButtonVariant): TStyle
  badge(variant?: BadgeVariant): TStyle
  input(variant?: InputVariant): TStyle
  card(variant?: CardVariant): TStyle
  alert(variant?: AlertVariant): TStyle
  selectable(variant?: SelectableVariant): TStyle

  // Layout styles
  page(): TStyle
  container(): TStyle
  label(): TStyle
  heading(): TStyle

  // Dropdown
  dropdownContainer(): TStyle
  dropdownTrigger(variant?: DropdownVariant): TStyle
  dropdownMenu(): TStyle
  dropdownGroup(): TStyle
  dropdownItem(): TStyle

  // Primitives for composition
  text(content: string): TStyle
  compose(...styles: TStyle[]): TStyle
}
