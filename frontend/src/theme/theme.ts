import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    accentGold: Palette['primary']
  }
  interface PaletteOptions {
    accentGold?: PaletteOptions['primary']
  }
  interface TypographyVariants {
    kicker: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    kicker?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    kicker: true
  }
}

export const colors = {
  paper: '#FFFFFF',
  paperAlt: '#FAFAFB',
  surface: '#FFFFFF',
  ink: '#17191c',
  inkSoft: '#615D59',
  inkFaint: '#615D59',
  hairline: '#ECECEC',
  // Kept as `red`/`gold`/`cobalt` so existing imports keep working; values are the soft light palette.
  // Darker coral for small text on the sand surfaces (4.5:1); `red` stays for fills and large display type.
  accentText: '#5d2a1a',
  red: '#5d2a1a',
  redDeep: '#3d1c11',
  gold: '#fbe1d1',
  cobalt: '#17191c',
  mint: '#fafafb',
  lilac: '#ececec',
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.paper,
      paper: colors.surface,
    },
    primary: {
      main: colors.cobalt,
      dark: '#3d1c11',
      light: '#4a4d55',
      contrastText: '#FFFFFF',
    },
    accentGold: {
      main: colors.gold,
      dark: '#8A6A1E',
      light: '#C9A75C',
      contrastText: '#1B1508',
    },
    text: {
      primary: colors.ink,
      secondary: colors.inkSoft,
      disabled: colors.inkFaint,
    },
    divider: colors.hairline,
  },
  typography: {
    fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.02,
    },
    h2: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.08,
    },
    h3: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.14,
    },
    h4: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Inter Variable", sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.65,
    },
    kicker: {
      fontFamily: '"Inter Variable", sans-serif',
      fontSize: '0.9rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          kicker: 'span',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          fontSize: '0.8rem',
          paddingInline: '1.8em',
          paddingBlock: '0.75em',
        },
        outlined: {
          borderColor: colors.hairline,
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 8px 24px ${alpha(colors.cobalt, 0.28)}`,
            },
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontFamily: '"Inter Variable", sans-serif',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.01em',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: alpha(colors.red, 0.18),
        },
        body: {
          backgroundColor: colors.paper,
        },
      },
    },
  },
})
