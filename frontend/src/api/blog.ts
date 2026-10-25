import { apiClient } from './client'

export interface BlogPostListItem {
  id: number
  slug: string
  title: string
  dek: string
  cover_image_url: string
  tags: string[]
  published: boolean
  created_at: string
  reading_time_minutes: number
}

export interface BlogPostFull extends BlogPostListItem {
  content_md: string
  updated_at: string
}

export interface BlogPostInput {
  title: string
  slug: string
  dek: string
  cover_image_url: string
  content_md: string
  tags: string[]
  published: boolean
}

export async function fetchPublicPosts(tag?: string): Promise<BlogPostListItem[]> {
  const { data } = await apiClient.get<BlogPostListItem[]>('/blog', {
    params: tag ? { tag } : undefined,
  })
  return data
}

export async function fetchPublicPost(slug: string): Promise<BlogPostFull> {
  const { data } = await apiClient.get<BlogPostFull>(`/blog/${slug}`)
  return data
}

export async function fetchAdminPosts(): Promise<BlogPostListItem[]> {
  const { data } = await apiClient.get<BlogPostListItem[]>('/admin/blog')
  return data
}

export async function fetchAdminPost(id: number): Promise<BlogPostFull> {
  const { data } = await apiClient.get<BlogPostFull>(`/admin/blog/${id}`)
  return data
}

export async function createPost(input: BlogPostInput): Promise<BlogPostFull> {
  const { data } = await apiClient.post<BlogPostFull>('/admin/blog', input)
  return data
}

export async function updatePost(
  id: number,
  input: Partial<BlogPostInput>,
): Promise<BlogPostFull> {
  const { data } = await apiClient.put<BlogPostFull>(`/admin/blog/${id}`, input)
  return data
}

export async function deletePost(id: number): Promise<void> {
  await apiClient.delete(`/admin/blog/${id}`)
}
