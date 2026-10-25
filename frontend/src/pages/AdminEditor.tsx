import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Alert from '@mui/material/Alert'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { createPost, fetchAdminPost, updatePost, type BlogPostInput } from '../api/blog'
import { colors } from '../theme/theme'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const empty: BlogPostInput = {
  title: '',
  slug: '',
  dek: '',
  cover_image_url: '',
  content_md: '',
  tags: [],
  published: false,
}

export function AdminEditor() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<BlogPostInput>(empty)
  const [tagsText, setTagsText] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchAdminPost(Number(id))
      .then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          dek: post.dek,
          cover_image_url: post.cover_image_url,
          content_md: post.content_md,
          tags: post.tags,
          published: post.published,
        })
        setTagsText(post.tags.join(', '))
        setSlugTouched(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  async function handleSave(publish?: boolean) {
    setSaving(true)
    setError(null)
    const payload: BlogPostInput = {
      ...form,
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published: publish ?? form.published,
    }
    try {
      if (isEditing) {
        await updatePost(Number(id), payload)
      } else {
        await createPost(payload)
      }
      navigate('/admin')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: 12 }}>
      <Container maxWidth="md">
        <Typography variant="kicker" sx={{ color: colors.red }}>
          Admin
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, mb: 4 }}>
          {isEditing ? 'Edit post' : 'New post'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
            }}
            fullWidth
            required
          />
          <TextField
            label="Dek (one-line summary)"
            value={form.dek}
            onChange={(e) => setForm((f) => ({ ...f, dek: e.target.value }))}
            fullWidth
            multiline
          />
          <TextField
            label="Cover image URL (optional)"
            value={form.cover_image_url}
            onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Tags (comma separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            fullWidth
          />

          <Box data-color-mode="light">
            <Typography variant="body2" sx={{ mb: 1, color: colors.inkFaint }}>
              Content (Markdown)
            </Typography>
            <MDEditor
              value={form.content_md}
              onChange={(v) => setForm((f) => ({ ...f, content_md: v ?? '' }))}
              height={480}
              preview="live"
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
            }
            label="Published"
          />

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => handleSave()} disabled={saving} sx={{ color: colors.ink, borderColor: colors.hairline }}>
              Save draft
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleSave(true)} disabled={saving}>
              {saving ? 'Saving…' : 'Save & publish'}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
