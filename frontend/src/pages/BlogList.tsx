import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import { motion } from 'framer-motion'
import { RevealStagger, staggerItem } from '../components/motion/Reveal'
import { fetchPublicPosts, type BlogPostListItem } from '../api/blog'
import { colors } from '../theme/theme'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag)
      const matchesQuery =
        !query.trim() ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.dek.toLowerCase().includes(query.toLowerCase())
      return matchesTag && matchesQuery
    })
  }, [posts, activeTag, query])

  return (
    <Box component="main" sx={{ pt: { xs: 16, md: 20 }, pb: 12, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="kicker" sx={{ color: colors.accentText }}>
          Writing
        </Typography>
        <Typography variant="h1" sx={{ mt: 2, mb: 5, fontSize: { xs: '2.4rem', md: '3.4rem' }, maxWidth: 760 }}>
          Notes on data platforms, agentic AI, and shipping things that have to be trusted.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6, alignItems: { sm: 'center' } }}>
          <TextField
            placeholder="Search posts…"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: { sm: 260 }, background: colors.surface }}
          />
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => setActiveTag(null)}
              variant={activeTag === null ? 'filled' : 'outlined'}
              sx={{
                background: activeTag === null ? colors.ink : 'transparent',
                color: activeTag === null ? colors.paper : colors.inkSoft,
                borderColor: colors.hairline,
              }}
            />
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setActiveTag(tag)}
                variant={activeTag === tag ? 'filled' : 'outlined'}
                sx={{
                  background: activeTag === tag ? colors.red : 'transparent',
                  color: activeTag === tag ? '#fff' : colors.inkSoft,
                  borderColor: colors.hairline,
                }}
              />
            ))}
          </Stack>
        </Stack>

        {!loading && filtered.length === 0 && (
          <Typography variant="body1" sx={{ color: colors.inkFaint }}>
            No posts match yet.
          </Typography>
        )}

        <RevealStagger>
          <Grid container spacing={3}>
            {filtered.map((post) => (
              <Grid key={post.slug} size={{ xs: 12, md: 6 }}>
                <Box component={motion.div} variants={staggerItem}>
                  <Card post={post} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </Container>
    </Box>
  )
}

function Card({ post }: { post: BlogPostListItem }) {
  return (
    <Box
      component={RouterLink}
      to={`/blog/${post.slug}`}
      sx={{
        display: 'block',
        height: '100%',
        p: 4,
        border: `1px solid ${colors.hairline}`,
        borderRadius: 2,
        background: colors.surface,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' },
      }}
    >
      <Stack spacing={1.5} sx={{ height: '100%' }}>
        <Typography variant="body2" sx={{ fontFamily: '"Inter Variable", sans-serif', color: colors.inkFaint }}>
          {formatDate(post.created_at)} · {post.reading_time_minutes} min read
        </Typography>
        <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
          {post.title}
        </Typography>
        <Typography variant="body1" sx={{ color: colors.inkSoft, flexGrow: 1 }}>
          {post.dek}
        </Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
          {post.tags.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ background: colors.paperAlt, color: colors.inkSoft }} />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
