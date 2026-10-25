import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { colors } from '../theme/theme'
import { DISPLAY } from '../sections/hero/shared'

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | Manish Chauhan'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  return (
    <Box sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2, pt: 10 }}>
      <Box>
        <Typography sx={{ fontFamily: DISPLAY, fontSize: 'clamp(7rem, 28vw, 18rem)', lineHeight: 0.85, color: '#CF4A33' }}>404</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' }, mt: 2 }}>
          This page doesn't exist
        </Typography>
        <Typography sx={{ color: colors.inkSoft, mt: 1, mb: 3 }}>The link may be old, or the address mistyped.</Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to home
        </Button>
      </Box>
    </Box>
  )
}
