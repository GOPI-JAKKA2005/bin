import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Sparkles, Leaf, Recycle, Activity, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Info } from 'lucide-react';
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

  const binGuides = [
    {
      bin: 'Green Bin',
      color: 'from-emerald-600 to-green-700',
      badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      title: 'Wet / Organic Waste',
      icon: Leaf,
      items: 'Food scraps, fruit peels, coffee grounds, garden trim, tea bags.',
      rules: 'Keep free from plastic bags or twist ties. Ideal for home composting or municipal anaerobic digestion.'
    },
    {
      bin: 'Blue Bin',
      color: 'from-blue-600 to-indigo-700',
      badge: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      title: 'Dry / Recyclables',
      icon: Recycle,
      items: 'PET bottles, cardboard, paper, aluminum cans, glass containers.',
      rules: 'Rinse out food residue and flatten boxes to conserve bin space before disposal.'
    },
    {
      bin: 'Yellow / Red Bin',
      color: 'from-amber-500 to-rose-600',
      badge: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
      title: 'Biomedical & Sharps',
      icon: Activity,
      items: 'Syringes, needles, clinical gloves, bandages, expired drugs.',
      rules: 'Store sharps in puncture-proof containers. Requires high-temp autoclaving or incineration.'
    },
    {
      bin: 'Dark Grey Bin',
      color: 'from-amber-500 to-slate-800',
      badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      title: 'Hazardous & E-Waste',
      icon: AlertTriangle,
      items: 'Lithium batteries, paints, solvents, electronics, fluorescent bulbs.',
      rules: 'Do NOT dispose in standard trash bins. Drop off at designated hazardous collection centers.'
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-bold shadow-xs">
          <BookOpen className="w-4 h-4" />
          EcoSmart Waste Segregation Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
          Comprehensive Waste Classification Guide
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto leading-relaxed">
          Learn correct bin standards, material recovery potential, and safety regulations to maximize recycling efficiency and minimize landfill contamination.
        </p>
      </div>

      {/* Standard Bin Classification Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
          <Info className="w-5 h-5 text-secondary" />
          Standard Color-Coded Segregation Bins
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {binGuides.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${b.badge}`}>
                      {b.bin}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${b.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-foreground font-heading">{b.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    <strong className="text-foreground">Accepted Items:</strong> {b.items}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground leading-snug">
                  💡 {b.rules}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Segregation Best Practices */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-surface via-surface to-primary/5 border border-primary/20 space-y-4 shadow-sm">
        <h3 className="text-base sm:text-lg font-extrabold font-heading text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          Essential Waste Segregation Rules & Eco-Tips
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted">
          <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
            <span className="font-bold text-foreground block">🧼 1. Clean & Rinse Containers</span>
            <p>Always rinse leftover food or liquids from PET bottles, aluminum cans, and glass jars before recycling to prevent mold contamination.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
            <span className="font-bold text-foreground block">✂️ 2. Separate Multi-Materials</span>
            <p>Detach plastic bottle caps, paper labels, or metal foil seals from containers so each material stream can be processed cleanly.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
            <span className="font-bold text-foreground block">⚠️ 3. Handle Hazardous Items Safely</span>
            <p>Never place Lithium-Ion batteries, e-waste, or chemicals into wet or dry bins. Store them dry and take them to authorized e-waste points.</p>
          </div>
        </div>
      </section>

      {/* Catalog Search & Filter */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-border">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items (e.g. bottle, syringe, peel)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-secondary text-slate-950 shadow-md shadow-secondary/20'
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
            <Sparkles className="w-6 h-6 animate-spin text-secondary mx-auto mb-2" />
            Loading Waste Directory Catalog...
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
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}


