/** FoodieFriends' native design tokens. Keep colors aligned with the web brand. */
export const colors = {
  coral50: '#FFF5F0',
  coral100: '#FFE8DC',
  coral200: '#FFD1BD',
  coral300: '#FFB294',
  coral400: '#FF8D63',
  coral500: '#FF6B35',
  coral600: '#E8521A',
  coral700: '#C23E0E',
  cream50: '#FFFFFF',
  cream100: '#FFFAF5',
  cream200: '#FFF8F0',
  cream300: '#FDEFD9',
  cream400: '#FBE4BE',
  teal50: '#F0F9FA',
  teal100: '#D5F0F2',
  teal500: '#2EC4B6',
  teal700: '#1A535C',
  teal800: '#143F46',
  charcoal800: '#3D4447',
  charcoal900: '#2D3436',
  herb: '#557A46',
  herb500: '#557A46',
  herb700: '#3D6334',
  herb800: '#31502B',
  saffron: '#E7A92B',
  saffron100: '#FFF2CF',
  white: '#FFFFFF',
  muted: '#737B7D',
  border: '#EEE4D9',
  danger: '#B42318',
  success: '#2F6B43',
} as const;

export const spacing = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, section: 40 } as const;

export const radii = { sm: 8, md: 12, card: 16, xl: 24, pill: 999 } as const;

export const typeScale = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  bodyLarge: 18,
  titleSmall: 20,
  title: 24,
  display: 30,
} as const;

export const elevation = {
  card: {
    shadowColor: colors.charcoal900,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowColor: colors.coral600,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
} as const;

export const theme = { colors, spacing, radii, typeScale, elevation } as const;
export type AppTheme = typeof theme;
