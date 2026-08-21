import { getPost, getPosts } from '@/lib/sanity-client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { PortableText, PortableTextComponents } from '@portabletext/react'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

/* ─────────────────────────────────────────────────────────────
   Static Params
───────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  try {
    const posts = await getPosts()

    if (!Array.isArray(posts)) return []

    return posts
      .filter((post: any) => post?.slug?.current)
      .map((post: any) => ({
        slug: post.slug.current,
      }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

/* ─────────────────────────────────────────────────────────────
   Metadata
───────────────────────────────────────────────────────────── */

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const params = await props.params
  const post = await getPost(params.slug)

  if (!post) return {}

  const image = post.mainImage ? urlFor(post.mainImage) : undefined

  return {
    title: `${post.title} | Deep Ceramics`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      images: image ? [{ url: image }] : [],
    },
  }
}

/* ─────────────────────────────────────────────────────────────
   Sanity Image URL Builder
───────────────────────────────────────────────────────────── */

function urlFor(source: any): string | null {
  if (!source?.asset?._ref) return null

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) return null

  const ref = source.asset._ref
  const parts = ref.split('-')

  if (parts.length < 4) return null

  const format = parts[parts.length - 1]
  const dimensions = parts[parts.length - 2]
  const id = parts.slice(1, parts.length - 2).join('-')

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}

/* ─────────────────────────────────────────────────────────────
   Reading Time Calculation
───────────────────────────────────────────────────────────── */

function getReadingTime(body: any[]): number {
  if (!Array.isArray(body) || !body.length) return 1

  let text = ''

  for (const block of body) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      text +=
        ' ' +
        block.children
          .map((child: any) => child.text || '')
          .join(' ')
    }
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

/* ─────────────────────────────────────────────────────────────
   Portable Text Custom Components
───────────────────────────────────────────────────────────── */

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#171717] leading-[1.15] mt-16 mb-6">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <div className="mt-16 mb-7">
        <div className="w-8 h-[3px] bg-[#E86F2C] mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#171717] leading-tight">
          {children}
        </h2>
      </div>
    ),

    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold text-[#222] leading-tight mt-12 mb-4">
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 className="text-lg font-bold text-[#333] mt-9 mb-3">
        {children}
      </h4>
    ),

    normal: ({ children }) => (
      <p className="text-[17px] sm:text-[18px] leading-[1.85] text-[#454545] mb-6 tracking-[-0.005em]">
        {children}
      </p>
    ),

    blockquote: ({ children }) => (
      <blockquote className="relative my-12 py-7 pl-7 pr-5 border-l-[3px] border-[#E86F2C] bg-[#FFF7F2]">
        <div className="absolute -top-4 left-5 text-5xl font-serif text-[#E86F2C] leading-none opacity-70">
          “
        </div>
        <div className="text-xl sm:text-2xl font-medium italic leading-relaxed text-[#333]">
          {children}
        </div>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-7 space-y-3 text-[17px] sm:text-[18px] leading-[1.75] text-[#454545]">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-7 space-y-3 text-[17px] sm:text-[18px] leading-[1.75] text-[#454545]">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#171717]">{children}</strong>
    ),

    em: ({ children }) => <em className="italic text-[#555]">{children}</em>,

    code: ({ children }) => (
      <code className="bg-[#F3F3F3] text-[#C95716] text-[14px] font-mono px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),

    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')

      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#D85F20] underline underline-offset-4 decoration-[#F3B08B] hover:decoration-[#D85F20] transition-colors"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      const src = urlFor(value)

      if (!src) return null

      return (
        <figure className="my-14">
          <div
            className="relative w-full overflow-hidden bg-[#F4F1EF]"
            style={{ aspectRatio: '16/9' }}
          >
            <Image
              src={src}
              alt={value.alt || ''}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.015]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 900px"
            />
          </div>

          {value.caption && (
            <figcaption className="mt-3 text-[13px] sm:text-sm leading-relaxed text-[#777]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    code: ({ value }) => (
      <div className="my-10">
        {value?.filename && (
          <div className="bg-[#262626] text-[#AFAFAF] text-xs font-mono px-4 py-2.5 border-b border-[#3A3A3A]">
            {value.filename}
          </div>
        )}

        <pre className="bg-[#181818] text-[#E8E8E8] text-[13px] sm:text-[14px] font-mono leading-relaxed p-5 sm:p-6 overflow-x-auto">
          <code>{value?.code || ''}</code>
        </pre>
      </div>
    ),

    table: ({ value }) => (
      <div className="my-12 overflow-x-auto border border-[#E5E2DF]">
        <table className="w-full text-sm text-left border-collapse">
          <tbody>
            {value?.rows?.map((row: any, rowIdx: number) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx === 0
                    ? 'bg-[#F7F5F3]'
                    : 'border-t border-[#EAE7E4]'
                }
              >
                {row.cells?.map((cell: string, cellIdx: number) =>
                  rowIdx === 0 ? (
                    <th
                      key={cellIdx}
                      className="px-5 py-4 font-semibold text-[#222] whitespace-nowrap"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIdx} className="px-5 py-4 text-[#555] align-top">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),

    callout: ({ value }) => {
      const styles: Record<
        string,
        { wrapper: string; label: string }
      > = {
        tip: {
          wrapper: 'bg-[#F1F8F2] border-[#6D9B73]',
          label: 'TIP',
        },
        warning: {
          wrapper: 'bg-[#FFF8E8] border-[#D9A441]',
          label: 'GOOD TO KNOW',
        },
        info: {
          wrapper: 'bg-[#F2F6FA] border-[#6E91B3]',
          label: 'NOTE',
        },
        danger: {
          wrapper: 'bg-[#FFF1EF] border-[#C76A60]',
          label: 'IMPORTANT',
        },
      }

      const style = styles[value?.tone] || styles.info

      return (
        <div className={`my-10 border-l-[3px] px-6 py-6 ${style.wrapper}`}>
          <div className="text-[11px] font-bold tracking-[0.14em] text-[#555] mb-2">
            {style.label}
          </div>
          <div className="text-[16px] sm:text-[17px] leading-relaxed text-[#444]">
            {value?.text}
          </div>
        </div>
      )
    },
  },
}

/* ─────────────────────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────────────────────── */

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params
  let post = null

  try {
    post = await getPost(params.slug)
  } catch (e) {
    console.error('Failed to fetch post:', e)
  }

  if (!post) return notFound()

  const imageUrl = urlFor(post.mainImage)
  const readingTime = getReadingTime(post.body)

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="min-h-screen bg-[#FFFCFA] text-[#171717]">
      {/* Editorial Nav */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-7">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#777] hover:text-[#E16A27] transition-colors"
        >
          <span className="text-base">←</span>
          Deep Ceramics Journal
        </Link>
      </div>

      {/* Hero */}
      <header className="max-w-[1050px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-12">
        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-7">
            {post.categories.map((cat: string) => (
              <span
                key={cat}
                className="text-[11px] font-bold tracking-[0.13em] uppercase text-[#D86220]"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <h1 className="max-w-[1000px] text-[42px] sm:text-[58px] lg:text-[70px] font-bold tracking-[-0.045em] leading-[0.98] text-[#171717]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="max-w-[780px] mt-7 text-[19px] sm:text-[22px] leading-[1.5] text-[#686868] tracking-[-0.01em]">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-9 pt-6 border-t border-[#E8E3DF] text-[13px] text-[#777]">
          {post.author && (
            <span className="font-semibold text-[#333]">By {post.author}</span>
          )}

          {formattedDate && (
            <>
              <span className="text-[#C4C0BC]">/</span>
              <span>{formattedDate}</span>
            </>
          )}

          <span className="text-[#C4C0BC]">/</span>
          <span>{readingTime} min read</span>
        </div>
      </header>

      {/* Hero Image */}
      {imageUrl && (
        <div className="max-w-[1280px] mx-auto px-0 sm:px-8 mb-16">
          <div
            className="relative w-full overflow-hidden bg-[#EDE9E6]"
            style={{ aspectRatio: '2/1' }}
          >
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[150px_minmax(0,760px)_1fr] gap-8 lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-10 pt-2">
              <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#A09A95] mb-4">
                Deep Ceramics
              </div>
              <div className="h-px bg-[#E5E0DC] w-8 mb-4" />
              <div className="text-xs leading-relaxed text-[#999]">
                Practical ideas,
                <br />
                inspiration &<br />
                tile guides.
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            {post.body && (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            )}
          </article>

          <div className="hidden lg:block" />
        </div>
      </div>

      {/* CTA Section */}
      <section className="border-t border-[#E5E0DC] bg-[#F5F0EC]">
        <div className="max-w-[1050px] mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <div className="max-w-[700px]">
            <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#D86220] mb-5">
              Need help choosing?
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.035em] leading-tight text-[#171717]">
              Your space deserves the right tile.
            </h2>

            <p className="mt-5 text-[17px] sm:text-lg leading-relaxed text-[#666] max-w-[620px]">
              Not sure what works for your space? Visit Deep Ceramics and talk
              to our team. We can help you narrow down the options without
              making the process complicated.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="https://wa.me/919974165307?text=Hi%2C%20I'm%20interested%20in%20your%20tiles%20and%20sanitary%20solutions."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#E86F2C] hover:bg-[#D96020] text-white font-semibold text-sm px-6 py-3.5 transition-colors"
              >
                Talk to us on WhatsApp
              </a>

              <Link
                href="/"
                className="inline-flex items-center justify-center border border-[#D8D0CA] hover:border-[#B9AEA6] bg-white text-[#333] font-semibold text-sm px-6 py-3.5 transition-colors"
              >
                Explore Deep Ceramics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}