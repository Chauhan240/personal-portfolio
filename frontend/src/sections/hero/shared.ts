import { colors } from '../../theme/theme'

export const DISPLAY = '"Anton", "Impact", sans-serif'
export const CREAM = '#F6F0E7'
export const EXTRUDE = '#BFAF9B'
export const SAND = '#D8CBBB'
export const stageBackground = `radial-gradient(80% 70% at 50% 30%, #E6DACB 0%, ${SAND} 55%, #C9BBA9 100%)`

/** Display type shared by the hero, About and Experience headings so the letters can hand off exactly. */
export const LETTER = {
  fontFamily: DISPLAY,
  fontWeight: 400,
  lineHeight: 0.9,
  letterSpacing: '0.01em',
  textTransform: 'uppercase' as const,
}

export const headSize = 'clamp(2.8rem, min(7.2vw, 10.5svh), 6.5rem)'

/** Layout of the full-screen section stage, so every heading lands on the same pixels. */
export const stagePadding = { px: { xs: 2, md: 5 }, pt: { xs: 9, md: 10 } }

export const headingColor = colors.ink
