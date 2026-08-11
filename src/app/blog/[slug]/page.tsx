import { getPost, getPosts } from '@/lib/sanity-client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { PortableText } from '@portabletext/react'

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post: any) => ({ slug: post.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Deep Ceramics Blog`,
    openGraph: {
      title: post.title,
    },
  }
}

function urlFor(source: any) {
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post = null
  try {
    post = await getPost(params.slug)
  } catch (e) {
    console.error('Failed to fetch post:', e)
  }

  if (!post) return notFound()

  const imageUrl = urlFor(post.mainImage)

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 bg-white min-h-screen text-[#1F1F1F]">
      {post.categories?.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {post.categories.map((cat: string) => (
            <span key={cat} className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-600">
              {cat}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-bold text-[#1F1F1F] mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
        {post.author && <span>By {post.author}</span>}
        {post.publishedAt && (
          <span>
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
      </div>

      {imageUrl && (
        <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-10">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.body && (
        <article className="prose prose-lg max-w-none prose-headings:text-[#1F1F1F] prose-a:text-orange-600">
          <PortableText value={post.body} />
        </article>
      )}
    </main>
  )
}