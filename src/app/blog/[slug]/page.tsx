import { getPost, getPosts } from '@/lib/sanity-client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { PortableText, PortableTextComponents } from '@portabletext/react'

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post: any) => ({ slug: post.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Deep Ceramics Blog`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.mainImage ? [{ url: urlFor(post.mainImage) || '' }] : [],
    },
  }
}

function urlFor(source: any): string | null {
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const parts = ref.split('-')
  // ref format: image-{id}-{dimensions}-{format}
  const format = parts[parts.length - 1]
  const dimensions = parts[parts.length - 2]
  const id = parts.slice(1, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`
}

// ── Custom PortableText components ───────────────────────────────────────────

const portableTextComponents: PortableTextComponents = {
  // Block-level overrides
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-12 mb-4 text-[#1F1F1F] leading-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-3 text-[#1F1F1F] leading-snug border-b border-gray-100 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-2 text-[#1F1F1F]">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-[#374151]">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-[17px] leading-[1.85] text-gray-700 mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-orange-400 pl-5 py-1 my-6 bg-orange-50 rounded-r-xl italic text-gray-600 text-[16px]">
        {children}
      </blockquote>
    ),
  },

  // List styles
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 mb-5 space-y-2 text-gray-700 text-[17px]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 mb-5 space-y-2 text-gray-700 text-[17px]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },

  // Inline marks
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#1F1F1F]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-orange-600 text-[13px] font-mono px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-600 underline underline-offset-2 hover:text-orange-700 transition-colors"
      >
        {children}
      </a>
    ),
  },

  // Custom types
  types: {
    // Sanity image blocks inside body
    image: ({ value }) => {
      const src = urlFor(value)
      if (!src) return null
      return (
        <figure className="my-10">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={src}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // Code blocks (if you have a `code` type from sanity-plugin-code-input)
    code: ({ value }) => (
      <div className="my-8">
        {value.filename && (
          <div className="bg-gray-800 text-gray-400 text-xs font-mono px-4 py-2 rounded-t-xl border-b border-gray-700">
            {value.filename}
          </div>
        )}
        <pre
          className={`bg-gray-900 text-green-300 text-[13px] font-mono leading-relaxed p-6 overflow-x-auto ${
            value.filename ? 'rounded-b-xl' : 'rounded-xl'
          }`}
        >
          <code>{value.code}</code>
        </pre>
      </div>
    ),

    // Table support (if using sanity-plugin-table)
    table: ({ value }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <tbody>
            {value.rows?.map((row: any, rowIdx: number) => (
              <tr
                key={rowIdx}
                className={rowIdx === 0 ? 'bg-gray-50 font-semibold text-[#1F1F1F]' : 'border-t border-gray-100 even:bg-gray-50/50'}
              >
                {row.cells?.map((cell: string, cellIdx: number) => (
                  rowIdx === 0 ? (
                    <th key={cellIdx} className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIdx} className="px-4 py-3 text-gray-600">
                      {cell}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),

    // Callout / tip boxes (if you have a custom `callout` schema)
    callout: ({ value }) => {
      const styles: Record<string, string> = {
        tip:     'bg-green-50 border-green-400 text-green-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        info:    'bg-blue-50 border-blue-400 text-blue-800',
        danger:  'bg-red-50 border-red-400 text-red-800',
      }
      const style = styles[value.tone] || styles.info
      return (
        <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-[15px] leading-relaxed ${style}`}>
          {value.text}
        </div>
      )
    },
  },
}

// ── Page ─────────────────────────────────────────────────────────────────────

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
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-14 pb-0">
        {/* Category badges */}
        {post.categories?.length > 0 && (
          <div className="flex gap-2 mb-5 flex-wrap">
            {post.categories.map((cat: string) => (
              <span
                key={cat}
                className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1F1F1F] leading-tight mb-5">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-10 border-b border-gray-100 pb-8">
          {post.author && (
            <span className="font-medium text-gray-600">By {post.author}</span>
          )}
          {post.author && post.publishedAt && <span>·</span>}
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
      </div>

      {/* Cover image — full bleed feel */}
      {imageUrl && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg" style={{ aspectRatio: '21/9' }}>
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        </div>
      )}

      {/* Body */}
      {post.body && (
        <article className="max-w-3xl mx-auto px-4 pb-24">
          <PortableText value={post.body} components={portableTextComponents} />
        </article>
      )}

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-orange-50 border border-orange-100 rounded-3xl px-8 py-10 text-center">
          <p className="text-lg font-semibold text-[#1F1F1F] mb-2">
            Have questions about tile selection?
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Visit our showroom in Ahmedabad or chat with us — we'll help you choose right the first time.
          </p>
          <a
            href="https://wa.me/919974165307?text=Hi%2C%20I'm%20interested%20in%20your%20tiles%20and%20sanitary%20solutions."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}