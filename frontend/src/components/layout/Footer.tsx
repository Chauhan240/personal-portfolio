import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { profile, socials } from '../../data/profile'
import { colors } from '../../theme/theme'

export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The mailto button still works.
    }
  }

  return (
    <Box
      id="contact"
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 16 },
        pb: 5,
        background: colors.paperAlt,
        borderTop: `1px solid ${colors.hairline}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '3rem', sm: '5rem', md: '8rem' }, fontWeight: 400, lineHeight: 0.98 }}>
            Let’s build it.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <Button href={`mailto:${profile.email}`} variant="contained" color="primary" size="large">
              Email Manish
            </Button>
            <Button
              onClick={copyEmail}
              variant="outlined"
              size="large"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              sx={{ color: colors.ink, borderColor: 'rgba(23,25,28,0.25)' }}
            >
              {copied ? 'Copied' : 'Copy address'}
            </Button>
            {socials
              .filter((s) => s.label !== 'Email')
              .map((s) => (
                <Button key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" variant="text" size="large" sx={{ color: colors.ink }}>
                  {s.label}
                </Button>
              ))}
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ mt: { xs: 10, md: 14 }, pt: 3, borderTop: `1px solid ${colors.hairline}`, justifyContent: 'space-between' }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.role}, {profile.location}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
