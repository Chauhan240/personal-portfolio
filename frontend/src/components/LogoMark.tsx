import Box from '@mui/material/Box'
import { logoFiles } from '../data/clients'

interface LogoMarkProps {
  name: string
  slug: string
  height?: number
  /** Colour of the mark. Defaults to the current text colour. */
  color?: string
}

// Logos whose artwork is a wide wordmark inside a square viewBox: render the mask at full box width
// and let the box crop the empty space above and below.
const wide: Record<string, number> = { 'coca-cola': 4 }

// Width-to-height ratio of each shipped SVG, so the mask box matches the artwork.
const aspect: Record<string, number> = {
  'coca-cola': 4,
  amazon: 1.7,
  dell: 1,
  unilever: 1,
  aws: 1.4,
  azure: 1,
  gcp: 1.1,
  databricks: 0.9,
  snowflake: 1,
}

/**
 * Renders a client logo as a tintable CSS mask when an SVG exists in /public/logos, otherwise a
 * clean typographic wordmark. The mask approach lets one asset work on any background.
 */
export function LogoMark({ name, slug, height = 28, color = 'currentColor' }: LogoMarkProps) {
  if (logoFiles.has(slug)) {
    return (
      <Box
        role="img"
        aria-label={name}
        sx={{
          height,
          width: height * (aspect[slug] ?? 1.5),
          backgroundColor: color,
          maskImage: `url(/logos/${slug}.svg)`,
          WebkitMaskImage: `url(/logos/${slug}.svg)`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: wide[slug] ? '100% auto' : 'contain',
          WebkitMaskSize: wide[slug] ? '100% auto' : 'contain',
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <Box
      component="span"
      role="img"
      aria-label={name}
      sx={{
        fontFamily: '"Instrument Serif", "Helvetica Neue", sans-serif',
        fontWeight: 700,
        fontSize: `${height * 0.72}px`,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </Box>
  )
}
