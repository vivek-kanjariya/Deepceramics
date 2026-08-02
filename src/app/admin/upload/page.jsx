"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMasters } from "../../../context/MasterContext";

export default function UploadPage() {
  const router = useRouter();
  const { masters, loading: mastersLoading } = useMasters();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
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
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  }, []);

  const handleDragOver = useCallback((e) => e.preventDefault(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setUploadProgress(0);

    // Validations
    if (!formData.name.trim()) {
      setError("Tile name is required");
      return;
    }
    if (!formData.category_id) {
      setError("Please select a category");
      return;
    }
    if (!formData.size_id) {
      setError("Please select a size");
      return;
    }
    if (!formData.finish_id) {
      setError("Please select a finish");
      return;
    }
    if (!formData.color_id) {
      setError("Please select a color");
      return;
    }
    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    try {
      // Prepare FormData for API
      const form = new FormData();
      form.append("image", imageFile);
      form.append("metadata", JSON.stringify(formData));

      const response = await fetch("/api/tiles", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadProgress(100);
        setSuccess(true);
        setTimeout(() => router.push("/admin/tiles"), 1500);
      } else {
        const errorMsg = result.error || "Upload failed. Please try again.";
        setError(errorMsg);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An unexpected error occurred. Check console.");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Simulate progress
  useState(() => {
    if (loading && uploadProgress < 90) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [loading, uploadProgress]);

  if (mastersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  const { categories, sizes, finishes, colors, series } = masters || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Tile</h1>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <span className="text-xl">✅</span> Tile uploaded successfully! Redirecting...
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tile Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  placeholder="e.g., Marble White"
                  required
                />
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (optional)
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  placeholder="e.g., MW-001"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="size_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Size *
                </label>
                <select
                  id="size_id"
                  name="size_id"
                  value={formData.size_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Select Size</option>
                  {sizes?.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="finish_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Finish *
                </label>
                <select
                  id="finish_id"
                  name="finish_id"
                  value={formData.finish_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Select Finish</option>
                  {finishes?.map((finish) => (
                    <option key={finish.id} value={finish.id}>
                      {finish.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="color_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <select
                  id="color_id"
                  name="color_id"
                  value={formData.color_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Select Color</option>
                  {colors?.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="series_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Series (optional)
                </label>
                <select
                  id="series_id"
                  name="series_id"
                  value={formData.series_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                >
                  <option value="">Select Series</option>
                  {series?.map((ser) => (
                    <option key={ser.id} value={ser.id}>
                      {ser.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="thickness_mm" className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm) (optional)
                </label>
                <input
                  type="number"
                  id="thickness_mm"
                  name="thickness_mm"
                  value={formData.thickness_mm}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  placeholder="e.g., 9"
                  step="0.1"
                />
              </div>
            </div>

            {/* Material and Application */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                  Material (optional)
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  placeholder="e.g., Porcelain"
                />
              </div>
              <div>
                <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-1">
                  Application (optional)
                </label>
                <input
                  type="text"
                  id="application"
                  name="application"
                  value={formData.application}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  placeholder="e.g., Floor, Wall"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-y"
                placeholder="Describe the tile..."
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Active (visible)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tile Image *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  imagePreview
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("imageInput").click()}
              >
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 max-w-full rounded-lg object-contain"
                    />
                    <p className="mt-2 text-sm text-gray-600">Click or drag to change</p>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP, GIF (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-black h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{uploadProgress}% uploaded</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg text-white font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:bg-gray-900"
                } transition-colors`}
              >
                {loading ? "Uploading..." : "Upload Tile"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/tiles")}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}