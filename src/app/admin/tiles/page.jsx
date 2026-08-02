"use client";



import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function TilesPage() {
  const router = useRouter();
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [editForm, setEditForm] = useState({
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
  const [masters, setMasters] = useState({
    categories: [],
    sizes: [],
    finishes: [],
    colors: [],
    series: [],
  });

  // Fetch tiles with master data
  const fetchTiles = async () => {
    try {
      setLoading(true);
      // Fetch tiles with joins to get master names
      const { data, error } = await supabase
        .from("tiles")
        .select(`
          *,
          categories (id, name),
          sizes (id, label),
          finishes (id, name),
          colors (id, name),
          series (id, name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTiles(data || []);
    } catch (err) {
      console.error("Error fetching tiles:", err);
      setError("Failed to load tiles.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch master data for edit modal
  const fetchMasters = async () => {
    try {
      const [categoriesRes, sizesRes, finishesRes, colorsRes, seriesRes] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("sizes").select("id, label").order("label"),
        supabase.from("finishes").select("id, name").order("name"),
        supabase.from("colors").select("id, name").order("name"),
        supabase.from("series").select("id, name").order("name"),
      ]);
      setMasters({
        categories: categoriesRes.data || [],
        sizes: sizesRes.data || [],
        finishes: finishesRes.data || [],
        colors: colorsRes.data || [],
        series: seriesRes.data || [],
      });
    } catch (err) {
      console.error("Error fetching masters:", err);
    }
  };

  useEffect(() => {
    fetchTiles();
    fetchMasters();
  }, []);

  // Open edit modal with tile data
  const openEditModal = (tile) => {
    setSelectedTile(tile);
    setEditForm({
      name: tile.name || "",
      sku: tile.sku || "",
      category_id: tile.category_id || "",
      size_id: tile.size_id || "",
      finish_id: tile.finish_id || "",
      color_id: tile.color_id || "",
      series_id: tile.series_id || "",
      thickness_mm: tile.thickness_mm || "",
      description: tile.description || "",
      material: tile.material || "",
      application: tile.application || "",
      faces: tile.faces || 1,
      active: tile.active ?? true,
      featured: tile.featured ?? false,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTile(null);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save edited tile
  const saveTile = async () => {
    if (!selectedTile) return;
    try {
      const updateData = {
        name: editForm.name.trim(),
        sku: editForm.sku.trim() || null,
        category_id: parseInt(editForm.category_id, 10),
        size_id: parseInt(editForm.size_id, 10),
        finish_id: parseInt(editForm.finish_id, 10),
        color_id: parseInt(editForm.color_id, 10),
        series_id: editForm.series_id ? parseInt(editForm.series_id, 10) : null,
        thickness_mm: editForm.thickness_mm ? parseFloat(editForm.thickness_mm) : null,
        description: editForm.description.trim() || null,
        material: editForm.material.trim() || null,
        application: editForm.application.trim() || null,
        faces: parseInt(editForm.faces, 10) || 1,
        active: editForm.active,
        featured: editForm.featured,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("tiles")
        .update(updateData)
        .eq("id", selectedTile.id);

      if (error) throw error;

      closeEditModal();
      fetchTiles(); // refresh list
      // show success toast optional
    } catch (err) {
      console.error("Error updating tile:", err);
      alert("Failed to update tile. Check console.");
    }
  };

  // Delete tile
  const deleteTile = async () => {
    if (!selectedTile) return;
    try {
      // Optionally delete image from storage
      // const imagePath = selectedTile.image_url.split('/').pop();
      // await supabase.storage.from('tile-images').remove([imagePath]);

      const { error } = await supabase
        .from("tiles")
        .delete()
        .eq("id", selectedTile.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedTile(null);
      fetchTiles();
    } catch (err) {
      console.error("Error deleting tile:", err);
      alert("Failed to delete tile. Check console.");
    }
  };

  // Toggle active status
  const toggleActive = async (tile) => {
    try {
      const { error } = await supabase
        .from("tiles")
        .update({ active: !tile.active, updated_at: new Date().toISOString() })
        .eq("id", tile.id);
      if (error) throw error;
      fetchTiles();
    } catch (err) {
      console.error("Error toggling active:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading tiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Tiles</h1>
          <button
            onClick={() => router.push("/admin/upload")}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add New Tile
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {tiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
            No tiles found. Start by adding your first tile!
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">SKU</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Size</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tiles.map((tile) => (
                  <tr key={tile.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={tile.image_url}
                        alt={tile.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-800">{tile.name}</td>
                    <td className="p-4 text-gray-600">{tile.sku || "—"}</td>
                    <td className="p-4 text-gray-600">
                      {tile.categories?.name || tile.category_id}
                    </td>
                    <td className="p-4 text-gray-600">
                      {tile.sizes?.label || tile.size_id}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(tile)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tile.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {tile.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(tile)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTile(tile);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Edit Tile</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={editForm.sku}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category_id"
                    value={editForm.category_id}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    required
                  >
                    <option value="">Select</option>
                    {masters.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <select
                    name="size_id"
                    value={editForm.size_id}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    required
                  >
                    <option value="">Select</option>
                    {masters.sizes.map((size) => (
                      <option key={size.id} value={size.id}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Finish</label>
                  <select
                    name="finish_id"
                    value={editForm.finish_id}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    required
                  >
                    <option value="">Select</option>
                    {masters.finishes.map((fin) => (
                      <option key={fin.id} value={fin.id}>{fin.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <select
                    name="color_id"
                    value={editForm.color_id}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    required
                  >
                    <option value="">Select</option>
                    {masters.colors.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Series</label>
                  <select
                    name="series_id"
                    value={editForm.series_id}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                  >
                    <option value="">None</option>
                    {masters.series.map((ser) => (
                      <option key={ser.id} value={ser.id}>{ser.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thickness (mm)</label>
                  <input
                    type="number"
                    name="thickness_mm"
                    value={editForm.thickness_mm}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="2"
                  className="w-full border rounded-lg px-3 py-2 text-gray-800"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={editForm.active}
                    onChange={handleEditChange}
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editForm.featured}
                    onChange={handleEditChange}
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveTile}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>{selectedTile.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteTile}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}