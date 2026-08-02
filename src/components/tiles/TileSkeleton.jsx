// src/components/tiles/TileSkeleton.jsx
export default function TileSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}