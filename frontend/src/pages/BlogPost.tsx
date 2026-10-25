import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { motion } from 'framer-motion'
import { fetchPublicPost, type BlogPostFull } from '../api/blog'
import { colors } from '../theme/theme'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function BlogPost() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogPostFull | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setPost(null)
    setNotFound(false)
    fetchPublicPost(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <Container maxWidth="sm" sx={{ pt: 22, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Post not found
        </Typography>
        <Typography component={RouterLink} to="/blog" sx={{ color: colors.accentText }}>
          ← Back to writing
        </Typography>
      </Container>
    )
  }

  if (!post) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 24 }}>
        <CircularProgress sx={{ color: colors.accentText }} />
      </Box>
    )
  }

  return (
    <Box
      component={motion.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{ pt: { xs: 16, md: 20 }, pb: 14 }}
    >
      <Container maxWidth="md">
        <Typography
          component={RouterLink}
          to="/blog"
          variant="body2"
          sx={{ color: colors.inkFaint, textDecoration: 'none', '&:hover': { color: colors.accentText } }}
        >
          ← All writing
        </Typography>

        <Typography variant="h1" sx={{ mt: 3, mb: 2, fontSize: { xs: '2.3rem', md: '3.2rem' } }}>
          {post.title}
        </Typography>

        {post.dek && (
          <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', color: colors.inkSoft, mb: 3 }}>
            {post.dek}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontFamily: '"Inter Variable", sans-serif', color: colors.inkFaint }}>
            {formatDate(post.created_at)} · {post.reading_time_minutes} min read
          </Typography>
        </Stack>

        <Stack direction="row" sx={{ mb: 6, pb: 5, borderBottom: `1px solid ${colors.hairline}`, flexWrap: 'wrap', gap: 0.75 }}>
          {post.tags.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ background: colors.paperAlt, color: colors.inkSoft }} />
          ))}
        </Stack>

        <Box
          sx={{
            fontSize: '1.08rem',
            lineHeight: 1.8,
            color: colors.inkSoft,
            '& h2': { fontFamily: '"Instrument Serif", "Helvetica Neue", sans-serif', color: colors.ink, mt: 5, mb: 2, fontSize: '1.7rem' },
            '& h3': { fontFamily: '"Instrument Serif", "Helvetica Neue", sans-serif', color: colors.ink, mt: 4, mb: 1.5, fontSize: '1.35rem' },
            '& p': { mb: 2.5 },
            '& ul, & ol': { mb: 2.5, pl: 3 },
            '& li': { mb: 1 },
            '& a': { color: colors.accentText },
            '& strong': { color: colors.ink },
            '& blockquote': {
              borderLeft: `3px solid ${colors.gold}`,
              pl: 3,
              ml: 0,
              fontStyle: 'italic',
              color: colors.inkSoft,
            },
            '& code': {
              fontFamily: '"Inter Variable", sans-serif',
              fontSize: '0.85em',
              background: colors.paperAlt,
              px: 0.6,
              borderRadius: 0.5,
            },
            '& pre': {
              background: colors.paperAlt,
              p: 2.5,
              borderRadius: 2,
              overflowX: 'auto',
              mb: 2.5,
            },
            '& pre code': { background: 'none', p: 0 },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content_md}
          </ReactMarkdown>
        </Box>
      </Container>
    </Box>
  )
}
