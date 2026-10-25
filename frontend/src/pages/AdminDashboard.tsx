import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { fetchAdminPosts, deletePost, type BlogPostListItem } from '../api/blog'
import { useAdminAuth } from '../context/AdminAuthContext'
import { colors } from '../theme/theme'

export function AdminDashboard() {
  const { logout } = useAdminAuth()
  const [posts, setPosts] = useState<BlogPostListItem[]>([])
  const [loading, setLoading] = useState(true)

  function refresh() {
    setLoading(true)
    fetchAdminPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    await deletePost(id)
    refresh()
  }

  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: 10, minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Stack direction="row" sx={{ mb: 6, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="kicker" sx={{ color: colors.red }}>
              Admin
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              Posts
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button onClick={logout} variant="text" sx={{ color: colors.inkFaint }}>
              Sign out
            </Button>
            <Button component={RouterLink} to="/admin/new" variant="contained" color="primary">
              New post
            </Button>
          </Stack>
        </Stack>

        {!loading && posts.length === 0 && (
          <Typography sx={{ color: colors.inkFaint }}>No posts yet — create your first one.</Typography>
        )}

        <Stack spacing={1.5}>
          {posts.map((post) => (
            <Stack
              key={post.id}
              direction="row"
              spacing={2}
              sx={{ p: 2.5, border: `1px solid ${colors.hairline}`, borderRadius: 2, background: colors.surface, alignItems: 'center' }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Inter Variable", sans-serif', fontSize: '1rem' }} noWrap>
                    {post.title}
                  </Typography>
                  <Chip
                    label={post.published ? 'Published' : 'Draft'}
                    size="small"
                    sx={{
                      background: post.published ? 'rgba(46,125,79,0.22)' : colors.paperAlt,
                      color: post.published ? '#6FD39A' : colors.inkFaint,
                    }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: colors.inkFaint }} noWrap>
                  /{post.slug}
                </Typography>
              </Box>
              <IconButton component={RouterLink} to={`/admin/edit/${post.id}`} size="small">
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(post.id, post.title)}>
                <DeleteOutlineIcon fontSize="small" sx={{ color: colors.red }} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
