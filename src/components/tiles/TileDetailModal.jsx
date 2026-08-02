// src/components/tiles/TileDetailModal.jsx
"use client";

import { Fragment, useState, useEffect, useRef, useCallback, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Share2, Copy, Check, ChevronLeft, ChevronRight, ZoomIn, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"; // ✅ import the hook

// ─── Image with fallback ───
const TileImage = memo(({ src, alt, className, priority = false }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <AlertCircle size={48} strokeWidth={1.5} />
        <span className="sr-only">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        quality={80}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWRlZGVkIi8+PC9zdmc+"
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
      />
    </div>
  );
});
TileImage.displayName = "TileImage";

// ─── Main Modal ───
const TileDetailModal = memo(({ tile, onClose, categoryId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!!tile);
  const [copied, setCopied] = useState(false);
  const [relatedTiles, setRelatedTiles] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const cancelButtonRef = useRef(null);

  // Lock body scroll when modal is open
  useLockBodyScroll(isOpen);

  // Close modal handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Fetch related tiles (same category)
  useEffect(() => {
    if (!tile || !categoryId) return;
    const fetchRelated = async () => {
      setLoadingRelated(true);
      try {
        const { data, error } = await supabase
          .from("tiles")
          .select(`
            id, name, slug, image_url,
            sizes (label),
            finishes (name)
          `)
          .eq("category_id", categoryId)
          .eq("active", true)
          .neq("id", tile.id)
          .limit(6)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRelatedTiles(data || []);
      } catch (err) {
        console.error("Failed to fetch related tiles:", err);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [tile, categoryId]);

  // Handle share
  const handleShare = useCallback(async () => {
    const shareData = {
      title: tile?.name || "Tile",
      text: `Check out ${tile?.name} from Deep Ceramics.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") console.warn("Share cancelled", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.warn("Copy failed", err);
      }
    }
  }, [tile]);

  // Handle inquiry
  const handleInquire = useCallback(() => {
    router.push(`/contact?product=${tile?.slug}`);
  }, [router, tile]);

  if (!tile) return null;

  // Build attributes for display
  const attributes = [
    { label: "Category", value: tile.categories?.name },
    { label: "Size", value: tile.sizes?.label },
    { label: "Finish", value: tile.finishes?.name },
    { label: "Color", value: tile.colors?.name, colorHex: tile.colors?.hex_code },
    { label: "Thickness", value: tile.thickness_mm ? `${tile.thickness_mm} mm` : null },
    { label: "Material", value: tile.material },
    { label: "Application", value: tile.application },
    { label: "Series", value: tile.series?.name },
  ].filter((attr) => attr.value);

  const isAvailable = tile.active !== false;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={handleClose}
          initialFocus={cancelButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-full sm:scale-95 sm:translate-y-0 sm:opacity-0"
                enterTo="translate-y-0 sm:scale-100 sm:opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0 sm:scale-100 sm:opacity-100"
                leaveTo="translate-y-full sm:scale-95 sm:translate-y-0 sm:opacity-0"
              >
                <Dialog.Panel className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl transition-all">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 hover:bg-white transition-colors shadow-lg"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8">
                    {/* ─── LEFT: Image Gallery ─── */}
                    <div className="space-y-4">
                      <div
                        className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
                        onClick={() => setShowFullscreen(true)}
                      >
                        <TileImage
                          src={tile.image_url}
                          alt={tile.name}
                          className="w-full h-full"
                          priority
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <ZoomIn size={14} />
                          <span className="hidden sm:inline">Zoom</span>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-black overflow-hidden cursor-pointer">
                          <TileImage src={tile.image_url} alt="Thumbnail" className="w-full h-full" />
                        </div>
                      </div>
                    </div>

                    {/* ─── RIGHT: Product Details ─── */}
                    <div className="flex flex-col space-y-5">
                      <nav className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
                        <span>Products</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600">{tile.categories?.name || "Category"}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-medium truncate">{tile.name}</span>
                      </nav>

                      <Dialog.Title className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {tile.name}
                      </Dialog.Title>

                      <div className="flex items-center gap-4 flex-wrap">
                        {tile.sku && (
                          <span className="text-sm text-gray-500">SKU: {tile.sku}</span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isAvailable ? "text-green-700" : "text-amber-700"}`}>
                          {isAvailable ? (
                            <>
                              <CheckCircle size={16} className="text-green-600" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} className="text-amber-600" />
                              Made to Order
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tile.categories?.name && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                            {tile.categories.name}
                          </span>
                        )}
                        {tile.finishes?.name && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                            {tile.finishes.name}
                          </span>
                        )}
                        {tile.application && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                            {tile.application}
                          </span>
                        )}
                        {tile.material && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                            {tile.material}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {attributes.map((attr, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{attr.label}</div>
                            <div className="mt-1 font-medium text-gray-800 flex items-center gap-2">
                              {attr.colorHex && (
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: attr.colorHex }}
                                />
                              )}
                              {attr.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {tile.description && (
                        <div className="pt-2 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700">Description</h3>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                            {tile.description}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white/80 backdrop-blur-sm pb-4 -mb-4 lg:static lg:bg-transparent lg:backdrop-blur-none lg:pb-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={handleInquire}
                            className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                          >
                            Get Quote
                          </button>
                          <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Share product"
                          >
                            {copied ? (
                              <>
                                <Check size={18} className="text-green-600" />
                                <span className="text-sm">Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 size={18} />
                                <span className="text-sm">Share</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── RELATED PRODUCTS ─── */}
                  {(relatedTiles.length > 0 || loadingRelated) && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 lg:p-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">You May Also Like</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                        {loadingRelated ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />
                          ))
                        ) : (
                          relatedTiles.map((related) => (
                            <div
                              key={related.id}
                              className="flex-shrink-0 w-32 sm:w-40 cursor-pointer group"
                              onClick={() => {
                                handleClose();
                                router.push(`/tiles/${related.slug}`);
                              }}
                            >
                              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow">
                                <Image
                                  src={related.image_url}
                                  alt={related.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 128px, 160px"
                                  quality={60}
                                />
                              </div>
                              <p className="mt-1 text-xs font-medium text-gray-700 truncate">{related.name}</p>
                              <p className="text-xs text-gray-400 truncate">{related.sizes?.label} • {related.finishes?.name}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ─── FULLSCREEN IMAGE VIEWER ─── */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-5xl w-full aspect-square">
            <Image
              src={tile.image_url}
              alt={tile.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
});

TileDetailModal.displayName = "TileDetailModal";

export default TileDetailModal;