import { getPosts } from '@/lib/sanity-client'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Deep Ceramics',
  description: 'Explore tiles, design trends, and inspiration from Deep Ceramics.',
  openGraph: {
    title: 'Blog | Deep Ceramics',
    description: 'Explore tiles, design trends, and inspiration from Deep Ceramics.',
  },
}

function urlFor(source: any) {
  // Basic image URL builder - works without @sanity/image-url for simple cases
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 bg-[#FFF7F3] min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-[#1F1F1F]">Blog</h1>
      <p className="text-gray-500 mb-12 text-lg">
        Design inspiration, tile trends, and ideas for your space.
      </p>
{/* mock  */}
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-24">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post: any) => {
            const imageUrl = urlFor(post.mainImage)
            return (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
              >
                {imageUrl && (
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.categories?.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-600"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-[#1F1F1F] group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.author && (
                    <p className="text-sm text-gray-400 mt-2">By {post.author}</p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}