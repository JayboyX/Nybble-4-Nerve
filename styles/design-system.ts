export const colors = {
  // Brand — SafeCheck SA
  primary: "#DC2626",        // Red — danger/urgency/fear
  primaryDark: "#991B1B",    // Deep red — hover states
  primaryLight: "#F87171",   // Light red — accents
  primaryPale: "#FEF2F2",   // Pale red — backgrounds

  // Secondary — trust/authority
  secondary: "#1E3A5F",     // Navy — professionalism
  secondaryLight: "#2563EB", // Blue — links/info
  secondaryPale: "#EFF6FF", // Pale blue — info backgrounds

  // Surfaces
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceDark: "#111827",

  // Text
  text: "#111827",
  textMuted: "#6B7280",
  textOnPrimary: "#FFFFFF",
  textOnDark: "#F9FAFB",

  // Borders
  border: "#E5E7EB",
  borderFocus: "#DC2626",

  // Feedback
  error: "#DC2626",
  errorBg: "#FEF2F2",
  success: "#16A34A",
  successBg: "#F0FDF4",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  info: "#2563EB",
  infoBg: "#EFF6FF",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.07)",
  lg: "0 10px 24px rgba(0, 0, 0, 0.1)",
  card: "0 2px 8px rgba(0, 0, 0, 0.06)",
  danger: "0 4px 14px rgba(220, 38, 38, 0.25)",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: "'Inter', 'Geist', system-ui, -apple-system, sans-serif",
  fontMono: "'Geist Mono', 'Fira Code', monospace",
  sizes: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem",    // 48px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

export const spacing = {
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const transitions = {
  fast: "150ms ease",
  base: "200ms ease",
  slow: "300ms ease",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;
