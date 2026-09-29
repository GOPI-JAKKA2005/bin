import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { WasteItemCard } from '../components/guide/WasteItemCard';
import { ItemDetailModal } from '../components/guide/ItemDetailModal';

export function GuidePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await apiClient.getWasteCatalog();
        if (res.items) setItems(res.items);
      } catch (err) {
        console.error('Catalog load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'wet', name: 'Wet / Organic' },
    { id: 'dry', name: 'Dry / Recyclable' },
    { id: 'biomedical', name: 'Biomedical' },
    { id: 'hazardous', name: 'Hazardous' },
    { id: 'mixed', name: 'Mixed Waste' },
  ];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-heading text-foreground">Waste Classification Directory</h1>
        <p className="text-xs text-muted max-w-xl mx-auto">
          Browse admin-managed waste items, material traits, estimated recovery ranges, and segregation rules.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items (e.g. bottle, syringe, peel)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface-hover border border-border text-muted hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="p-12 text-center text-muted text-xs">
          <Sparkles className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          Loading Waste Directory...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center text-muted text-xs bg-surface rounded-3xl border border-border">
          No items found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <WasteItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

