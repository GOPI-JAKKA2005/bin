import React, { useState, useEffect } from 'react';
import { Bot, Plus, Trash2, Edit2, ShieldAlert, Sparkles, CheckCircle2, Search } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export function ChatbotControlTab() {
  const { token } = useAuth();
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getChatbotKnowledge();
      if (res.knowledge) setKnowledge(res.knowledge);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this knowledge entry?')) return;
    try {
      await apiClient.deleteChatbotEntry(id, token);
      setKnowledge(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await apiClient.saveChatbotEntry(editingEntry, token);
      setIsModalOpen(false);
      fetchKnowledge();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const filteredKnowledge = knowledge.filter(k =>
    (k.question || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.answer || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQ & knowledge base..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={() => {
            setEditingEntry({
              question: '',
              answer: '',
              category: 'General',
              keywords: [],
              priority: 10,
              active: true
            });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Q&A Entry
        </button>
      </div>

      {/* Knowledge Base Table */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground font-heading">
          Chatbot Knowledge & Guardrail Entries ({filteredKnowledge.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-muted text-xs">Loading Knowledge Base...</div>
        ) : (
          <div className="space-y-3">
            {filteredKnowledge.map((entry) => (
              <div key={entry.id} className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {entry.category || 'General'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingEntry({ ...entry }); setIsModalOpen(true); }}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-foreground">{entry.question}</h4>
                <p className="text-muted leading-relaxed">{entry.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="w-full max-w-lg bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-foreground font-heading">
              {editingEntry.id ? 'Edit Knowledge Entry' : 'Create Knowledge Entry'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted font-semibold mb-1">User Question</label>
                <input
                  type="text"
                  required
                  value={editingEntry.question}
                  onChange={(e) => setEditingEntry({ ...editingEntry, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted font-semibold mb-1">AI Bot Answer</label>
                <textarea
                  rows="3"
                  required
                  value={editingEntry.answer}
                  onChange={(e) => setEditingEntry({ ...editingEntry, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEntry.category}
                    onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted font-semibold mb-1">Match Priority (1-50)</label>
                  <input
                    type="number"
                    value={editingEntry.priority}
                    onChange={(e) => setEditingEntry({ ...editingEntry, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
                  />
                </div>
              </div>
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
                Save Knowledge Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
