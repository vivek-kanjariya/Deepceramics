import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function getPosts() {
  try {
    return await client.fetch(`
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        "author": author->name,
        "categories": categories[]->title,
        body
      }
    `)
  } catch (e) {
    console.error('Error fetching posts:', e)
    return []
  }
}

export async function getPost(slug: string) {
  try {
    return await client.fetch(`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        "author": author->name,
        "categories": categories[]->title,
        body
      }
    `, { slug })
  } catch (e) {
    console.error('Error fetching post:', e)
    return null
  }
}