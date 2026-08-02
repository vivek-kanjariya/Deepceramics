'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppFloat from '../../components/WhatsAppFloat'; // adjust path as needed
import { useInView } from 'react-intersection-observer';
import { supabase } from '../../lib/supabase';
import {
  Sparkles,
  Palette,
  Brush,
  Smile,
  Search,
  ImageIcon,
  X,
  Tag,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import Logo from './logo.png';

/* ───────────────────────────────────────────────────────────
   Skeleton Loader (unchanged)
   ─────────────────────────────────────────────────────────── */
function InspirationSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse mb-6 break-inside-avoid">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Inspiration Card (unchanged)
   ─────────────────────────────────────────────────────────── */
function InspirationCard({ image, onClick }: { image: any; onClick: () => void }) {
  const metadata = image.metadata || {};
  const [imgError, setImgError] = useState(false);
  const aspect =
    image.width && image.height
      ? (image.width / image.height).toFixed(4)
      : '4/3';

  return (
    <motion.div
      layoutId={`inspiration-${image.id}`}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer mb-6 break-inside-avoid"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
    >
      <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: aspect }}>
        {!imgError ? (
          <Image
            src={image.image_url}
            alt={image.description || 'Inspiration'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
        )}
        {metadata.style && (
          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Brush size={12} />
            {metadata.style}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4 space-y-2">
        <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed font-medium">
          {image.description || 'A beautiful interior look.'}
        </p>
        {metadata.dominant_colors?.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Palette size={12} className="text-gray-400 flex-shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {metadata.dominant_colors.slice(0, 5).map((color: string, i: number) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {metadata.mood && (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <Smile size={10} />
              {metadata.mood}
            </span>
          )}
          {metadata.tags?.slice(0, 2).map((tag: string, i: number) => (
            <span key={i} className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────────────────
   Lightbox / Detail Modal (unchanged)
   ─────────────────────────────────────────────────────────── */
function InspirationDetailModal({ image, onClose }: { image: any; onClose: () => void }) {
  const metadata = image.metadata || {};

  // WhatsApp inquiry link
  const phoneNumber = "919974165307";
  const message = encodeURIComponent(
    `Hi! I'm interested in this inspiration look: "${image.description || 'tile design'}" — can I get a quotation?`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="relative w-full aspect-[16/9] bg-gray-100">
          <Image
            src={image.image_url}
            alt={image.description || 'Inspiration'}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {image.description || 'A stunning interior look.'}
          </p>

          <div className="flex flex-wrap gap-4">
            {metadata.style && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                <Brush size={14} className="text-orange-500" />
                <span className="text-sm font-medium text-orange-700">{metadata.style}</span>
              </div>
            )}
            {metadata.mood && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                <Smile size={14} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700">{metadata.mood}</span>
              </div>
            )}
          </div>

          {metadata.tags?.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {metadata.dominant_colors?.length > 0 && (
            <div className="flex items-start gap-2">
              <Palette size={16} className="text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-3">
                {metadata.dominant_colors.map((color: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <span className="text-xs text-gray-500 uppercase">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WhatsApp Inquiry Button ────────────────── */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-5 w-5 fill-white">
              <path d="M16.001 2.999c-7.18 0-13.002 5.822-13.002 13.002 0 2.29.6 4.52 1.74 6.5L2.9 29.002l6.66-1.75a12.94 12.94 0 006.44 1.74c7.18 0 13.002-5.82 13.002-13.002S23.18 2.999 16.001 2.999zm0 23.004c-2.03 0-4.02-.55-5.76-1.6l-.41-.24-3.95 1.04 1.05-3.85-.27-.42a10.9 10.9 0 01-1.66-5.78c0-6.03 4.9-10.93 10.93-10.93 6.03 0 10.93 4.9 10.93 10.93 0 6.03-4.9 10.93-10.93 10.93z" />
            </svg>
            Find Quotation / Inquire Now
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Page Component with Filter Bar
   ─────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Filter states
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Available filter options (fetched from DB)
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  // Color palette: we'll use a predefined set + the dominant colors from the displayed images
  const [allDominantColors, setAllDominantColors] = useState<string[]>([]);

  // Mobile filter drawer
  const [filterOpen, setFilterOpen] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.1 });
  const isInitialLoad = useRef(true);

  // ─── Fetch available filter options once ──────────────────
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Get distinct styles
        const { data: styles, error: styleErr } = await supabase
          .from('inspiration_images')
          .select('metadata->style')
          .eq('active', true)
          .not('metadata->style', 'is', null);
        if (!styleErr && styles) {
          const uniqueStyles = [...new Set(styles.map((s: any) => s.style).filter(Boolean))];
          setAvailableStyles(uniqueStyles as string[]);
        }

        // Get distinct moods
        const { data: moods, error: moodErr } = await supabase
          .from('inspiration_images')
          .select('metadata->mood')
          .eq('active', true)
          .not('metadata->mood', 'is', null);
        if (!moodErr && moods) {
          const uniqueMoods = [...new Set(moods.map((m: any) => m.mood).filter(Boolean))];
          setAvailableMoods(uniqueMoods as string[]);
        }

        // Get all tags (aggregated)
        const { data: allImages, error: tagErr } = await supabase
          .from('inspiration_images')
          .select('metadata->tags')
          .eq('active', true)
          .not('metadata->tags', 'is', null)
          .limit(1000);
        if (!tagErr && allImages) {
          const tagsSet = new Set<string>();
          allImages.forEach((img: any) => {
            const tags = img.tags || [];
            tags.forEach((t: string) => tagsSet.add(t));
          });
          setAvailableTags([...tagsSet]);
        }

        // Collect all dominant colors from the first 200 images (for color swatches)
        const { data: colorData, error: colorErr } = await supabase
          .from('inspiration_images')
          .select('metadata->dominant_colors')
          .eq('active', true)
          .limit(200);
        if (!colorErr && colorData) {
          const colorsSet = new Set<string>();
          colorData.forEach((img: any) => {
            const colors = img.dominant_colors || [];
            colors.forEach((c: string) => colorsSet.add(c));
          });
          setAllDominantColors([...colorsSet]);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilters();
  }, []);

  // ─── Fetch images with server‑side style/mood filtering ──
const fetchImages = useCallback(
  async (reset = false) => {
    setLoading(true);
    setError(null);

    const currentPage = reset ? 1 : page;
    const from = (currentPage - 1) * 20;
    const to = from + 19;

    try {
      let query = supabase
        .from('inspiration_images')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .order('created_at', { ascending: false });

      // Server‑side style / mood filter
      if (selectedStyles.length > 0) {
        query = query.in('metadata->>style', selectedStyles);
      }
      if (selectedMoods.length > 0) {
        query = query.in('metadata->>mood', selectedMoods);
      }

      const { data, error: fetchError, count } = await query.range(from, to);

      // Log the raw response for debugging
      console.log('Supabase response:', { from, to, fetchError, count, dataLength: data?.length });

      if (fetchError) {
        // Real error from Supabase
        console.error('Supabase fetch error:', fetchError);
        setError(fetchError.message || fetchError.details || JSON.stringify(fetchError));
        setHasMore(false);
        return;
      }

      // Client‑side filtering for colours & tags
      let filtered = data || [];
      if (selectedColors.length > 0) {
        filtered = filtered.filter((img: any) => {
          const colors: string[] = img.metadata?.dominant_colors || [];
          return selectedColors.some((c) => colors.includes(c));
        });
      }
      if (selectedTags.length > 0) {
        filtered = filtered.filter((img: any) => {
          const tags: string[] = img.metadata?.tags || [];
          return selectedTags.some((t) => tags.includes(t));
        });
      }

      // Update images
      if (reset) {
        setImages(filtered);
        setPage(2);
      } else {
        setImages((prev) => [...prev, ...filtered]);
        setPage((prev) => prev + 1);
      }

      // If we got less than 20 items (or empty), stop pagination
      setHasMore((data || []).length === 20 && (count ? to + 1 < count : true));
    } catch (err: any) {
      console.error('Failed to fetch inspiration images:', err);
      // Show whatever error details we can extract
      const msg = err?.message || err?.details || JSON.stringify(err);
      setError(msg);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  },
  [page, selectedStyles, selectedMoods, selectedColors, selectedTags],
);

  // ─── Reset and fetch when filters change ────────────────
  useEffect(() => {
    setImages([]);
    setPage(1);
    isInitialLoad.current = true;
    fetchImages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStyles, selectedMoods, selectedColors, selectedTags]);

  // ─── Infinite scroll ─────────────────────────────────────
  useEffect(() => {
    if (inView && hasMore && !loading && !isInitialLoad.current) {
      fetchImages(false);
    }
  }, [inView, hasMore, loading, fetchImages]);

  useEffect(() => {
    if (images.length > 0) isInitialLoad.current = false;
  }, [images]);

  // ─── Toggle filter chip (multiple selection) ────────────
  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };
  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  };
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };
  const clearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedMoods([]);
    setSelectedColors([]);
    setSelectedTags([]);
  };

  // ─── Loading state (first load) ──────────────────────────
  if (loading && images.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        {/* Header skeleton (same as before) */}
        <section className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-6 sm:pb-10 pt-10 sm:pt-16">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg flex-shrink-0">
            <Image src={Logo} alt="Deep Ceramics." width={48} height={48} priority />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6F6F]">Deep Ceramics.</p>
            <h1 className="mt-0.5 text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FF6A2E]">Inspiration Gallery</h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm md:text-base text-[#212121]">Curated looks, colours, and styles to inspire your next space.</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 pb-24">
          {Array.from({ length: 12 }).map((_, i) => (
            <InspirationSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Any active filters? ─────────────────────────────────
  const hasActiveFilters = selectedStyles.length > 0 || selectedMoods.length > 0 || selectedColors.length > 0 || selectedTags.length > 0;

  // ─── Filter Bar Component (reusable for both mobile & desktop) ──
  const FilterContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div className={`space-y-4 ${inDrawer ? 'p-4' : ''}`}>
      {/* Styles */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style</h4>
        <div className="flex flex-wrap gap-2">
          {availableStyles.map((style) => (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedStyles.includes(style)
                  ? 'bg-[#FF6A2E] text-white border-[#FF6A2E]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6A2E] hover:text-[#FF6A2E]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mood</h4>
        <div className="flex flex-wrap gap-2">
          {availableMoods.map((mood) => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedMoods.includes(mood)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colour</h4>
        <div className="flex flex-wrap gap-2">
          {allDominantColors.slice(0, 30).map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                selectedColors.includes(color) ? 'border-black scale-110 shadow-md' : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {allDominantColors.length > 30 && (
            <span className="text-xs text-gray-400 self-center ml-1">+{allDominantColors.length - 30} more</span>
          )}
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 20).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-800 hover:text-gray-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-xs text-red-500 hover:text-red-700 underline mt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#121212]">
      {/* Header (unchanged) */}
      <section className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6 pt-10 sm:pt-16">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg flex-shrink-0">
          <Image src={Logo} alt="Deep Ceramics." width={48} height={48} priority />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6F6F]">Deep Ceramics.</p>
          <h1 className="mt-0.5 text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FF6A2E]">Inspiration Gallery</h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm md:text-base text-[#212121]">Curated looks, colours, and styles to inspire your next space.</p>
        </div>
      </section>

      {/* ─── FILTER BAR ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        {/* Desktop: horizontal scrollable filters */}
        <div className="hidden sm:block">
          <FilterContent />
        </div>

        {/* Mobile: sticky button + drawer */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between sticky top-16 z-30 bg-[#F7F7F7]/95 backdrop-blur-sm py-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#FF6A2E] rounded-full" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-500 underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Drawer (overlay) */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setFilterOpen(false)}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <FilterContent inDrawer />
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="w-full py-2.5 bg-[#FF6A2E] text-white rounded-full font-medium text-sm"
                    >
                      Show results
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && images.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex justify-center mb-4 text-gray-300">
              <Search size={48} strokeWidth={1} />
            </div>
            <p className="text-gray-400 text-lg">No inspiration images found.</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      )}

      {/* MASONRY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 pb-24">
        {images.map((image) => (
          <InspirationCard
            key={image.id}
            image={image}
            onClick={() => setSelectedImage(image)}
          />
        ))}
        {loading && !isInitialLoad.current &&
          Array.from({ length: 4 }).map((_, i) => (
            <InspirationSkeleton key={`loading-${i}`} />
          ))
        }
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={ref} className="py-8 sm:py-10 flex justify-center">
          {loading && !isInitialLoad.current && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Loading more</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <InspirationDetailModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>

      
    </div>
  );
}