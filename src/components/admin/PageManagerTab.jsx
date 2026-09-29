import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, Globe, Eye, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export function PageManagerTab() {
  const { token } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getPages();
      if (res.pages) setPages(res.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this custom CMS page?')) return;
    try {
      await apiClient.deletePage(id, token);
      setPages(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await apiClient.savePage(editingPage, token);
      setIsModalOpen(false);
      fetchPages();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-surface border border-border">
        <div>
          <h3 className="font-bold text-base text-foreground font-heading">
            CMS Custom Pages Manager
          </h3>
          <p className="text-xs text-muted">Create, edit, and publish dynamic pages.</p>
        </div>

        <button
          onClick={() => {
            setEditingPage({
              slug: 'new-page-' + Date.now().toString().slice(-4),
              title: 'New Page',
              heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
              content: '## New Custom Page Content\n\nAdd markdown or text content here.',
              seoTitle: 'New Page - EcoSmart',
              seoDescription: 'Custom page description',
              published: true
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="p-5 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                /{page.slug}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditingPage({ ...page }); setIsModalOpen(true); }}
                  className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h4 className="font-bold text-base text-foreground font-heading">{page.title}</h4>
            <p className="text-xs text-muted line-clamp-2 leading-relaxed">{page.content}</p>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {page.published !== false ? 'Published' : 'Draft'}
              </span>
              <a
                href={`/page/${page.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" /> View Live Page
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Page Edit Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="w-full max-w-xl bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-foreground font-heading">
              {editingPage.id ? 'Edit CMS Page' : 'Create CMS Page'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-muted font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-muted font-semibold">Hero Header Image URL</label>
              <input
                type="text"
                value={editingPage.heroImage}
                onChange={(e) => setEditingPage({ ...editingPage, heroImage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
              />
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-muted font-semibold">Page Content (Markdown / Text)</label>
              <textarea
                rows="6"
                required
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="pub"
                checked={editingPage.published}
                onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
              />
              <label htmlFor="pub" className="font-semibold text-foreground cursor-pointer">
                Publish page live to website
              </label>
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
                Save CMS Page
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
