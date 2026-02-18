/**
 * Types for the UI configuration system.
 * Allows runtime configuration of component properties via long-press dialogs.
 */

/** A single configurable property, discriminated by type */
export type ConfigProperty =
  | {
      type: 'boolean'
      label: string
      currentValue: boolean
    }
  | {
      type: 'select'
      label: string
      currentValue: string
      options: string[]
    }
  | {
      type: 'slider'
      label: string
      currentValue: number
      min: number
      max: number
      step?: number
    }
  | {
      type: 'text'
      label: string
      currentValue: string
    }
  | {
      type: 'color'
      label: string
      currentValue: string
    }

/** Extracts the value type from a ConfigProperty */
export type ConfigPropertyValue<P extends ConfigProperty> =
  P extends { type: 'boolean' } ? boolean :
  P extends { type: 'slider' } ? number :
  string

/** Configuration definition for a single UI element */
export interface UIElementConfig {
  elementId: string
  elementType: string
  displayName: string
  properties: Record<string, ConfigProperty>
}

/** Map of property overrides for a single element (property key -> value) */
export type ElementOverrides = Record<string, string | number | boolean>

/** All persisted overrides keyed by elementId */
export type PersistedOverrides = Record<string, ElementOverrides>

/** Value exposed by the UIConfig context */
export interface UIConfigContextValue {
  /** Registry of all configurable elements (ref-backed, no re-renders on registration) */
  registry: React.MutableRefObject<Map<string, UIElementConfig>>
  /** Current overrides for all elements */
  overrides: PersistedOverrides
  /** Register or update a configurable element */
  registerElement: (config: UIElementConfig) => void
  /** Set a single property override */
  setOverride: (elementId: string, propertyKey: string, value: string | number | boolean) => void
  /** Reset all overrides for a given element */
  resetElement: (elementId: string) => void
  /** The element currently being configured (null if dialog is closed) */
  activeElementId: string | null
  /** Open the config dialog for a given element */
  openDialog: (elementId: string) => void
  /** Close the config dialog */
  closeDialog: () => void
}
