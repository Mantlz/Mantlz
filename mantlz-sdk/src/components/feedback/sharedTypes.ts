// Shared types to avoid circular dependencies

// Preset theme names
export const FEEDBACK_THEMES = {
  MINIMAL: 'minimal',
  ROUNDED: 'rounded',
  GLASS: 'glass',
} as const;

export type FeedbackTheme = typeof FEEDBACK_THEMES[keyof typeof FEEDBACK_THEMES]; 