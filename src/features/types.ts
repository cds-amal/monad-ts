/**
 * Feature flags for controlling feature rollout.
 * These allow enabling/disabling features without code changes.
 */
export interface FeatureFlags {
  /**
   * When enabled, shows explanation UI for flagged (blacklisted/sanctioned) addresses.
   * - Web: Tooltip on hover/click
   * - iOS: Card that slides in from top
   */
  enableFlaggedAddressExplanation: boolean

  /**
   * When enabled, long-pressing configurable UI elements opens a configuration dialog
   * for adjusting properties like variant, size, density, and visibility.
   */
  enableUIConfig: boolean
}

export const defaultFlags: FeatureFlags = {
  enableFlaggedAddressExplanation: true,
  enableUIConfig: true,
}
