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
}

export const defaultFlags: FeatureFlags = {
  enableFlaggedAddressExplanation: true,
}
