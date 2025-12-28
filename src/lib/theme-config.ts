// theme-config.ts
// Matches your About Us page theming exactly

export const themeClasses = {
  // Background gradients (matching your About Us)
  bgGradient: "bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950",
  bgGradientReverse: "bg-gradient-to-tl from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950",
  
  // Background solids
  bgPrimary: "bg-primary-bg",
  bgSecondary: "bg-secondary-bg",
  bgBase: "bg-base-bg",
  
  // Borders (using your CSS variables)
  border: "border border-theme",
  borderReverse: "border border-reverse-theme",
  borderAccent: "border-accent",
  borderCyber: "border-cyber",
  
  // Text colors (semantic from your CSS)
  textPrimary: "text-primary-text",
  textSecondary: "text-secondary-text",
  textHeading: "text-heading",
  textSecondaryHeading: "text-secondary-heading",
  textAccent: "text-accent",
  textCyber: "text-cyber",
  
  // Buttons
  btnPrimary: "bg-accent hover:bg-accent/90 text-white",
  btnSecondary: "bg-primary-bg border-theme text-primary-text hover:bg-secondary-bg",
  btnGhost: "hover:bg-secondary-bg",
  
  // Cards/Overlays (matching your About Us cards)
  card: "bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme",
  cardInset: "bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 shadow-inner border-l-4 border-cyber",
  
  // Shadows (matching your About Us)
  shadow: "shadow-lg",
  shadowHeavy: "shadow-2xl",
  shadowTheme: "shadow-theme",
  
  // Rounded (matching your About Us)
  rounded: "rounded-2xl",
  roundedHeavy: "rounded-3xl",
  roundedLarge: "rounded-xl",
};

export type Theme = 'light' | 'dark' | 'system';