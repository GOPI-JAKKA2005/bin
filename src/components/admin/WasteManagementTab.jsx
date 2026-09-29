import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, Upload, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { compressImage } from '../../utils/imageCompression';

export function WasteManagementTab() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getWasteCatalog();
      if (res.items) setItems(res.items);
      if (res.categories) setCategories(res.categories);
    } catch (err) {
      alert('Failed to load waste catalog: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this waste item?')) return;
    try {
      await apiClient.deleteWasteItem(id, token);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem({
      name: '',
      category: 'dry',
      subcategory: '',
      description: '',
      examples: [],
      biodegradable: false,
      recyclable: true,
      compostable: false,
      hazardous: false,
      biomedical: false,
      recoveryMin: 50,
      recoveryMax: 85,
      residualMin: 15,
      residualMax: 50,
      processingMethods: [],
      recommendations: '',
      benefits: '',
      warnings: '',
      confidenceThreshold: 60,
      imageUrl: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const compressed = await compressImage(file, 500);
      const uploaded = await apiClient.uploadImage(compressed.compressedBase64);
      if (uploaded.url) {
        setEditingItem(prev => ({ ...prev, imageUrl: uploaded.url }));
      }
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.saveWasteItem(editingItem, token);
      if (res.item) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchCatalog();
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items or categories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Waste Item
        </button>
      </div>

      {/* Items Grid / Table */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground font-heading">
          Configured Waste Items ({filteredItems.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-muted text-xs">Loading waste items...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted uppercase font-semibold text-[10px]">
                <tr>
                  <th className="pb-3 px-2">Item</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Traits</th>
                  <th className="pb-3 px-2">Recovery</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-foreground block">{item.name}</span>
                          <span className="text-[10px] text-muted">{item.subcategory || 'General'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 uppercase font-bold text-[10px]">{item.category}</td>

                    <td className="py-3 px-2">
                      <div className="flex gap-1 text-[10px]">
                        {item.recyclable && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold">Recyclable</span>}
                        {item.compostable && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">Compostable</span>}
                        {item.biomedical && <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-semibold">Biomedical</span>}
                        {item.hazardous && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">Hazardous</span>}
                      </div>
                    </td>

                    <td className="py-3 px-2 font-bold text-primary">{item.recoveryMin}% - {item.recoveryMax}%</td>

                    <td className="py-3 px-2">
                      {item.active !== false ? (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem({ ...item }); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface-hover"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* CRUD Edit/Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveItem} className="w-full max-w-xl bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-2xl my-8">
            <h3 className="font-bold text-lg text-foreground font-heading">
              {editingItem.id ? 'Edit Waste Item' : 'Create Waste Item'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-muted font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                >
                  <option value="wet">Wet / Organic</option>
                  <option value="dry">Dry / Recyclable</option>
                  <option value="biomedical">Biomedical</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="mixed">Mixed Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">Subcategory</label>
                <input
                  type="text"
                  value={editingItem.subcategory}
                  onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-muted"
                />
                {uploadingImage && <span className="text-[10px] text-primary">Uploading to ImgBB...</span>}
              </div>
            </div>

            <div className="text-xs space-y-2">
              <label className="block text-muted font-semibold">Item Traits</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={editingItem.biodegradable} onChange={(e) => setEditingItem({ ...editingItem, biodegradable: e.target.checked })} />
                  Biodegradable
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={editingItem.recyclable} onChange={(e) => setEditingItem({ ...editingItem, recyclable: e.target.checked })} />
                  Recyclable
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={editingItem.compostable} onChange={(e) => setEditingItem({ ...editingItem, compostable: e.target.checked })} />
                  Compostable
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={editingItem.hazardous} onChange={(e) => setEditingItem({ ...editingItem, hazardous: e.target.checked })} />
                  Hazardous
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={editingItem.biomedical} onChange={(e) => setEditingItem({ ...editingItem, biomedical: e.target.checked })} />
                  Biomedical
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-muted font-semibold mb-1">Recovery Min (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.recoveryMin}
                  onChange={(e) => setEditingItem({ ...editingItem, recoveryMin: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">Recovery Max (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.recoveryMax}
                  onChange={(e) => setEditingItem({ ...editingItem, recoveryMax: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-muted font-semibold">Recommendations</label>
              <textarea
                rows="2"
                value={editingItem.recommendations}
                onChange={(e) => setEditingItem({ ...editingItem, recommendations: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-md"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
