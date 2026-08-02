// src/app/tiles/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import InquiryForm from '../../../components/inquiry/InquiryForm';

export default async function TileDetailPage({ params }) {
  const { slug } = await params;

  // Fetch tile with related master data
  const { data: tile, error } = await supabaseAdmin
    .from('tiles')
    .select(`
      *,
      categories (id, name),
      sizes (id, label, width_mm, height_mm),
      finishes (id, name),
      colors (id, name, hex_code),
      series (id, name)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !tile) {
    notFound();
  }

  // Build attributes for display
  const attributes = [
    { label: 'Category', value: tile.categories?.name },
    { label: 'Size', value: tile.sizes?.label },
    { label: 'Finish', value: tile.finishes?.name },
    { label: 'Color', value: tile.colors?.name, colorHex: tile.colors?.hex_code },
    { label: 'Thickness', value: tile.thickness_mm ? `${tile.thickness_mm} mm` : null },
    { label: 'Material', value: tile.material },
    { label: 'Application', value: tile.application },
    { label: 'Series', value: tile.series?.name },
  ].filter((attr) => attr.value);

  const isAvailable = tile.active !== false;

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors duration-200 mb-6 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={tile.image_url}
              alt={tile.name}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {tile.featured && (
              <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                ✦ Featured
              </span>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
              <Link href="/products" className="hover:text-gray-600">Products</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600">{tile.categories?.name || 'Category'}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-medium truncate">{tile.name}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {tile.name}
            </h1>

            {/* SKU & Availability */}
            <div className="flex items-center gap-4 flex-wrap">
              {tile.sku && (
                <span className="text-sm text-gray-500">SKU: {tile.sku}</span>
              )}
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isAvailable ? 'text-green-700' : 'text-amber-700'}`}>
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

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tile.categories?.name && (
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{tile.categories.name}</span>
              )}
              {tile.finishes?.name && (
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{tile.finishes.name}</span>
              )}
              {tile.application && (
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{tile.application}</span>
              )}
              {tile.material && (
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{tile.material}</span>
              )}
            </div>

            {/* Specs */}
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

            {/* Description */}
            {tile.description && (
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{tile.description}</p>
              </div>
            )}

            {/* Inquiry */}
            <div className="pt-4 border-t border-gray-200">
              <InquiryForm tile={tile} />
            </div>
          </div>
        </div>

        {/* Related tiles (optional) – can fetch more here */}
      </div>
    </main>
  );
}