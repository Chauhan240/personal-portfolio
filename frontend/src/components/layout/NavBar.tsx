import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { colors } from '../../theme/theme'

const homeLinks = [
  { label: 'Platforms', href: '#platforms' },
  { label: 'Ask', href: '#ask' },
  { label: 'Clients', href: '#clients' },
]

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const dark = false

  // On the home page the name jumps back to the hero instead of re-navigating to the same route.
  const toHero = (e: React.MouseEvent) => {
    if (!isHome) return
    e.preventDefault()
    if (location.hash) history.replaceState(null, '', '/')
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: { duration?: number }) => void } }).__lenis
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={0}
      component={motion.div}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        background: scrolled ? 'rgba(246, 245, 244, 0.86)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.hairline}` : '1px solid transparent',
        transition: 'all 0.35s ease',
        color: dark ? '#ffffff' : colors.ink,
      }}
    >
      <Toolbar sx={{ maxWidth: 1240, width: '100%', mx: 'auto', py: 1 }}>
        <Typography
          component={RouterLink}
          to="/"
          onClick={toHero}
          sx={{
            fontFamily: '"Instrument Serif", "Helvetica Neue", sans-serif',
            fontWeight: 600,
            fontSize: '1.15rem',
            color: dark ? '#ffffff' : colors.ink,
            textDecoration: 'none',
            mr: 'auto',
          }}
        >
          Manish Chauhan
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          {isHome &&
            homeLinks.map((link) => (
              <Typography
                key={link.href}
                component="a"
                href={link.href}
                variant="body2"
                sx={{
                  color: dark ? 'rgba(255,255,255,0.78)' : colors.inkSoft,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  fontWeight: 400,
                  '&:hover': { color: dark ? '#ffffff' : colors.ink },
                }}
              >
                {link.label}
              </Typography>
            ))}
          <Button component={RouterLink} to={isHome ? '#contact' : '/#contact'} variant="contained" color="primary" size="small">
            Get in touch
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
