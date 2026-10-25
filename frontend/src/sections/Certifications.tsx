import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { certGroups } from '../data/showcase'
import { LogoMark } from '../components/LogoMark'
import { colors } from '../theme/theme'

export function Certifications() {
  const [open, setOpen] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const active = certGroups.find((g) => g.slug === open)

  return (
    <Box component="section" aria-label="Certifications" sx={{ pt: { xs: 7, md: 14 }, pb: { xs: 5, md: 8 }, background: colors.paper }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '4rem' }, mb: { xs: 3.5, md: 7 }, textAlign: 'center' }}>
          Certified across every major cloud
        </Typography>

        <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, '--cert-h': { xs: '112px', md: '170px' }, gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' } }}>
          {certGroups.map((g, i) => {
            const selected = open === g.slug
            return (
              <Box key={g.slug} sx={{ perspective: '800px' }}>
                <motion.button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${g.provider}, ${g.names.length} certification${g.names.length > 1 ? 's' : ''}`}
                  onClick={() => setOpen(selected ? null : g.slug)}
                  initial={reduced ? false : { opacity: 0, rotateY: -70 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  whileHover={reduced ? undefined : { rotateY: 14, rotateX: -8, scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    width: '100%',
                    cursor: 'pointer',
                    height: 'var(--cert-h, 170px)',
                    borderRadius: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                    color: selected ? colors.gold : colors.inkSoft,
                    background: 'rgba(255,255,255,0.9)', boxShadow: '0 20px 40px -24px rgba(40,70,140,0.35)',
                    border: `1px solid ${selected ? colors.gold : colors.hairline}`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <LogoMark name={g.provider} slug={g.slug} height={44} color="currentColor" />
                  <span style={{ fontFamily: '"Instrument Serif", sans-serif', fontWeight: 400, fontSize: '1.9rem', color: colors.ink }}>
                    {g.names.length}
                  </span>
                </motion.button>
              </Box>
            )
          })}
        </Box>

        <Box role="status" aria-live="polite" sx={{ minHeight: { xs: active ? 60 : 0, md: 90 }, mt: { xs: 2.5, md: 4 }, textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.ul
                key={active.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
              >
                {active.names.map((n) => (
                  <li key={n} style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${colors.gold}66`, color: colors.ink }}>
                    {n}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  )
}
