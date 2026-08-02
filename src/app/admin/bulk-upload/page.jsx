"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { uploadTile } from "../../../lib/uploadTile";

// Generate a unique ID for each tile form
let nextId = 0;

export default function BulkUploadPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState([]);

  // Master data for dropdowns
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);
  const [series, setSeries] = useState([]);

  // Auth & fetch masters
  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setCheckingAuth(false);
      await fetchMasters();
    };
    checkUserAndFetch();
  }, [router]);

  async function fetchMasters() {
    try {
      const [categoriesRes, sizesRes, finishesRes, colorsRes, seriesRes] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("sizes").select("id, label").order("label"),
        supabase.from("finishes").select("id, name").order("name"),
        supabase.from("colors").select("id, name").order("name"),
        supabase.from("series").select("id, name").order("name"),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (sizesRes.error) throw sizesRes.error;
      if (finishesRes.error) throw finishesRes.error;
      if (colorsRes.error) throw colorsRes.error;
      if (seriesRes.error) throw seriesRes.error;

      setCategories(categoriesRes.data || []);
      setSizes(sizesRes.data || []);
      setFinishes(finishesRes.data || []);
      setColors(colorsRes.data || []);
      setSeries(seriesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
      setError("Failed to load dropdown options. Please refresh.");
    }
  }

  // Add a new tile form
  const addTile = () => {
    const newTile = {
      id: nextId++,
      formData: {
        name: "",
        sku: "",
        category_id: "",
        size_id: "",
        finish_id: "",
        color_id: "",
        series_id: "",
        thickness_mm: "",
        description: "",
        material: "",
        application: "",
        faces: 1,
        active: true,
        featured: false,
      },
      imageFile: null,
      imagePreview: null,
      errors: [],
    };
    setTiles([...tiles, newTile]);
  };

  // Remove a tile form
  const removeTile = (id) => {
    setTiles(tiles.filter(t => t.id !== id));
  };

  // Handle form field change for a specific tile
  const handleTileChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setTiles(tiles.map(tile =>
      tile.id === id
        ? {
            ...tile,
            formData: {
              ...tile.formData,
              [name]: type === "checkbox" ? checked : value,
            },
          }
        : tile
    ));
  };

  // Handle image change for a specific tile
  const handleImageChange = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTiles(tiles.map(tile =>
          tile.id === id
            ? {
                ...tile,
                imageFile: file,
                imagePreview: event.target.result,
                errors: tile.errors.filter(err => err !== "image"),
              }
            : tile
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (id, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTiles(tiles.map(tile =>
          tile.id === id
            ? {
                ...tile,
                imageFile: file,
                imagePreview: event.target.result,
                errors: tile.errors.filter(err => err !== "image"),
              }
            : tile
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Validate a single tile
  const validateTile = (tile) => {
    const errors = [];
    const fd = tile.formData;
    if (!fd.name.trim()) errors.push("Name is required");
    if (!fd.category_id) errors.push("Category is required");
    if (!fd.size_id) errors.push("Size is required");
    if (!fd.finish_id) errors.push("Finish is required");
    if (!fd.color_id) errors.push("Color is required");
    if (!tile.imageFile) errors.push("Image is required");
    return errors;
  };

  // Submit all tiles
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setResults([]);
    setOverallProgress(0);

    // Validate all tiles
    let hasErrors = false;
    const validatedTiles = tiles.map(tile => {
      const errors = validateTile(tile);
      if (errors.length) hasErrors = true;
      return { ...tile, errors };
    });
    setTiles(validatedTiles);

    if (hasErrors) {
      setError("Some tiles have errors. Please fix them before submitting.");
      return;
    }

    setLoading(true);
    const total = tiles.length;
    let completed = 0;
    let successful = 0;
    const results = [];

    for (const tile of tiles) {
      try {
        const result = await uploadTile(tile.imageFile, tile.formData);
        if (result.success) {
          successful++;
          results.push({ tile: tile.formData.name, status: "success", data: result.data });
        } else {
          const errorMsg = typeof result.error === 'string'
            ? result.error
            : result.error?.message || 'Upload failed';
          results.push({ tile: tile.formData.name, status: "error", error: errorMsg });
        }
      } catch (err) {
        console.error("Upload error for tile:", tile.formData.name, err);
        results.push({ tile: tile.formData.name, status: "error", error: err.message || "Unknown error" });
      }
      completed++;
      setOverallProgress(Math.round((completed / total) * 100));
    }

    setResults(results);
    setLoading(false);

    if (successful === total) {
      setSuccess(true);
      setTimeout(() => router.push("/admin/tiles"), 2000);
    } else {
      setError(`${successful} of ${total} tiles uploaded successfully. ${total - successful} failed. Check results below.`);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">Checking credentials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bulk Upload Tiles</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/upload")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Single Upload
            </button>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <span className="text-xl">✅</span> All tiles uploaded successfully! Redirecting...
          </div>
        )}

        {/* Progress bar */}
        {loading && (
          <div className="mb-4 bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uploading tiles...</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-black h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results summary */}
        {results.length > 0 && !loading && (
          <div className="mb-4 p-4 bg-white rounded-xl shadow border">
            <h3 className="font-medium mb-2">Results:</h3>
            <ul className="max-h-40 overflow-y-auto text-sm">
              {results.map((res, idx) => (
                <li key={idx} className="flex items-center gap-2 py-1 border-b last:border-0">
                  <span className={res.status === "success" ? "text-green-600" : "text-red-600"}>
                    {res.status === "success" ? "✅" : "❌"}
                  </span>
                  <span className="font-medium">{res.tile}</span>
                  <span className="text-gray-500">
                    {res.status === "success" ? "uploaded" : res.error}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tile forms */}
        <div className="space-y-6">
          {tiles.map((tile) => (
            <div key={tile.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative">
              <button
                type="button"
                onClick={() => removeTile(tile.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                title="Remove tile"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-4">Tile #{tile.id + 1}</h3>
              {tile.errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {tile.errors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tile Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={tile.formData.name}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g., Marble White"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU (optional)</label>
                  <input
                    type="text"
                    name="sku"
                    value={tile.formData.sku}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g., MW-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category_id"
                    value={tile.formData.category_id}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  >
                    <option value="">Select</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                  <select
                    name="size_id"
                    value={tile.formData.size_id}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  >
                    <option value="">Select</option>
                    {sizes.map(size => (
                      <option key={size.id} value={size.id}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Finish *</label>
                  <select
                    name="finish_id"
                    value={tile.formData.finish_id}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  >
                    <option value="">Select</option>
                    {finishes.map(fin => (
                      <option key={fin.id} value={fin.id}>{fin.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                  <select
                    name="color_id"
                    value={tile.formData.color_id}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  >
                    <option value="">Select</option>
                    {colors.map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series (optional)</label>
                  <select
                    name="series_id"
                    value={tile.formData.series_id}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  >
                    <option value="">None</option>
                    {series.map(ser => (
                      <option key={ser.id} value={ser.id}>{ser.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (mm)</label>
                  <input
                    type="number"
                    name="thickness_mm"
                    value={tile.formData.thickness_mm}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g., 9"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material (optional)</label>
                  <input
                    type="text"
                    name="material"
                    value={tile.formData.material}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g., Porcelain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application (optional)</label>
                  <input
                    type="text"
                    name="application"
                    value={tile.formData.application}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="e.g., Floor, Wall"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={tile.formData.description}
                  onChange={(e) => handleTileChange(tile.id, e)}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-y"
                  placeholder="Describe the tile..."
                />
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={tile.formData.active}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={tile.formData.featured}
                    onChange={(e) => handleTileChange(tile.id, e)}
                    className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tile Image *</label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                    tile.imagePreview
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                  onDrop={(e) => handleDrop(tile.id, e)}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById(`imageInput-${tile.id}`).click()}
                >
                  <input
                    type="file"
                    id={`imageInput-${tile.id}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(tile.id, e)}
                    className="hidden"
                  />
                  {tile.imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={tile.imagePreview}
                        alt="Preview"
                        className="max-h-48 max-w-full rounded-lg object-contain"
                      />
                      <p className="mt-2 text-sm text-gray-600">Click or drag to change</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">Drag & drop or click</p>
                      <p className="text-xs text-gray-400">JPEG, PNG, WEBP, GIF (max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="button"
            onClick={addTile}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Add Another Tile
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            } transition-colors`}
          >
            {loading ? "Uploading..." : "Submit All"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/tiles")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}