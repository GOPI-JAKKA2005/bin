import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function CustomPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const res = await apiClient.getPageBySlug(slug);
        if (res.page) setPage(res.page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-16 text-center text-muted text-xs">
        <Sparkles className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
        Loading Page Content...
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-surface border border-border rounded-3xl space-y-4">
        <h2 className="text-xl font-bold font-heading text-foreground">Page Not Found</h2>
        <p className="text-xs text-muted">The requested page slug "/{slug}" does not exist or is unpublished.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {page.heroImage && (
        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border border-border">
          <img src={page.heroImage} alt={page.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">{page.title}</h1>
          </div>
        </div>
      )}

      {!page.heroImage && (
        <h1 className="text-3xl font-extrabold font-heading text-foreground">{page.title}</h1>
      )}

      <div className="prose dark:prose-invert max-w-none text-muted leading-relaxed space-y-4 whitespace-pre-wrap text-sm">
        {page.content}
      </div>
    </article>
  );
}
