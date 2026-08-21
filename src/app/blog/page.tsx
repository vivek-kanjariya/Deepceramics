export const revalidate = 0

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

function urlFor(source: any): string | null {
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const parts = ref.split('-')
  const format = parts[parts.length - 1]
  const dimensions = parts[parts.length - 2]
  const id = parts.slice(1, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function readTime(post: any): string {
  // rough estimate — not exact, just a nice touch
  return '5 min read'
}

// ── Hero post (first/featured) ───────────────────────────────────────────────

function HeroPost({ post }: { post: any }) {
  const imageUrl = urlFor(post.mainImage)

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block lg:grid lg:grid-cols-5 gap-0 border-b border-gray-200 pb-12 mb-12"
    >
      {/* Image — takes 3 of 5 cols */}
      {imageUrl && (
        <div className="relative w-full overflow-hidden rounded-2xl lg:col-span-3 mb-6 lg:mb-0 lg:mr-10"
          style={{ aspectRatio: '16/9' }}>
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            priority
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          {/* Orange accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />
        </div>
      )}

      {/* Text — takes 2 of 5 cols */}
      <div className="lg:col-span-2 flex flex-col justify-center lg:pl-2">
        {/* Category + FEATURED badge */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-bold tracking-widest uppercase text-orange-500 border border-orange-200 bg-orange-50 px-2.5 py-1 rounded-sm">
            Featured
          </span>
          {post.categories?.[0] && (
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
              {post.categories[0]}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4 group-hover:text-orange-600 transition-colors duration-200">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mt-auto">
          {post.author && (
            <span className="font-medium text-gray-600">{post.author}</span>
          )}
          {post.author && <span>·</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span>·</span>
          <span>{readTime(post)}</span>
        </div>

        {/* Read CTA */}
        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-orange-600 group-hover:gap-3 transition-all duration-200">
            Read article
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Standard card ────────────────────────────────────────────────────────────

function PostCard({ post }: { post: any }) {
  const imageUrl = urlFor(post.mainImage)

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col border-b border-gray-100 pb-8 last:border-none"
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative w-full overflow-hidden rounded-xl mb-4"
          style={{ aspectRatio: '16/9' }}>
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      {/* Category */}
      {post.categories?.[0] && (
        <span className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-2">
          {post.categories[0]}
        </span>
      )}

      {/* Title */}
      <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-snug mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-3">
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {post.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mt-auto pt-1">
        {post.author && <span className="font-medium text-gray-500">{post.author}</span>}
        {post.author && <span>·</span>}
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
      </div>
    </Link>
  )
}

// ── Wide list-style card (for "More articles" section) ───────────────────────

function PostRow({ post }: { post: any }) {
  const imageUrl = urlFor(post.mainImage)

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex gap-4 border-b border-gray-100 pb-6 last:border-none"
    >
      {imageUrl && (
        <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
        </div>
      )}
      <div className="flex flex-col justify-center min-w-0">
        {post.categories?.[0] && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-orange-500 mb-1">
            {post.categories[0]}
          </span>
        )}
        <h4 className="text-[14px] font-semibold text-[#1A1A1A] leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h4>
        {post.publishedAt && (
          <p className="text-[11px] text-gray-400 mt-1">{formatDate(post.publishedAt)}</p>
        )}
      </div>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  let posts: any[] = []
  try {
    posts = await getPosts()
  } catch {
    posts = []
  }

  const [hero, ...rest] = posts
  // Grid cards: next 3 posts
  const gridPosts = rest.slice(0, 3)
  // Remaining posts as list rows
  const listPosts = rest.slice(3)

  return (
    <main className="bg-white min-h-screen">

      {/* ── Page header ── */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-2">
                Deep Ceramics
              </p>
              <h1 className="text-5xl sm:text-6xl font-black text-[#1A1A1A] tracking-tight leading-none">
                The Journal
              </h1>
            </div>
            <p className="text-gray-400 text-[14px] max-w-xs leading-relaxed text-right">
              Tile guides, design ideas, and home renovation tips — written for real people, not architects.
            </p>
          </div>

          {/* Category strip */}
          <div className="flex gap-6 mt-8 overflow-x-auto no-scrollbar">
            {['All', 'Buying Guides', 'Design Trends', 'How-To', 'Materials', 'Inspiration'].map((cat) => (
              <button
                key={cat}
                className={`text-[12px] font-semibold tracking-wide uppercase whitespace-nowrap pb-2 border-b-2 transition-colors ${
                  cat === 'All'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-1 bg-orange-500 rounded mb-6" />
            <p className="text-2xl font-bold text-[#1A1A1A] mb-2">Nothing here yet</p>
            <p className="text-gray-400 text-sm">First article drops soon. Come back!</p>
          </div>
        ) : (
          <>
            {/* ── Hero ── */}
            {hero && <HeroPost post={hero} />}

            {/* ── Three-col grid ── */}
            {gridPosts.length > 0 && (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                    Latest
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-16">
                  {gridPosts.map((post: any) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </>
            )}

            {/* ── List rows for older posts ── */}
            {listPosts.length > 0 && (
              <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                {/* Left: list */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                      More articles
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="space-y-6">
                    {listPosts.map((post: any) => (
                      <PostRow key={post._id} post={post} />
                    ))}
                  </div>
                </div>

                {/* Right: sticky CTA sidebar */}
                <div className="hidden lg:block">
                  <div className="sticky top-8">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                      <p className="text-[11px] font-bold tracking-widest uppercase text-orange-400 mb-3">
                        Visit us
                      </p>
                      <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug mb-3">
                        Need help choosing the right tile?
                      </h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
                        Our team in Ahmedabad can walk you through every option — in person or on WhatsApp.
                      </p>
                      <a
                        href="https://wa.me/919974165307?text=Hi%2C%20I'm%20interested%20in%20your%20tiles%20and%20sanitary%20solutions."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold py-3 rounded-xl transition-colors"
                      >
                        💬 Chat on WhatsApp
                      </a>
                    </div>

                    {/* Mini topic links */}
                    <div className="mt-8">
                      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">
                        Browse by topic
                      </p>
                      <div className="flex flex-col gap-2">
                        {['Vitrified Tiles', 'Bathroom Ideas', 'Kitchen Floors', 'Outdoor Spaces', 'Tile Care'].map((topic) => (
                          <span
                            key={topic}
                            className="text-[13px] text-gray-600 hover:text-orange-600 cursor-pointer transition-colors flex items-center gap-2 group"
                          >
                            <span className="w-1 h-1 rounded-full bg-orange-400 group-hover:scale-150 transition-transform" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Mobile CTA (shows below list on small screens) ── */}
            {listPosts.length > 0 && (
              <div className="lg:hidden mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
                <p className="text-[13px] font-semibold text-[#1A1A1A] mb-2">Need tile advice?</p>
                <p className="text-[12px] text-gray-400 mb-4">
                  Chat with the Deep Ceramics team — we reply fast.
                </p>
                <a
                  href="https://wa.me/919974165307?text=Hi%2C%20I'm%20interested%20in%20your%20tiles%20and%20sanitary%20solutions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer strip ── */}
      <div className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-[12px] text-gray-400">
          <span>© {new Date().getFullYear()} Deep Ceramics. Ahmedabad, Gujarat.</span>
          <Link href="/" className="hover:text-orange-500 transition-colors">← Back to site</Link>
        </div>
      </div>
    </main>
  )
}