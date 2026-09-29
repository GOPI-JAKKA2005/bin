import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, ShieldAlert, Sparkles } from 'lucide-react';

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'How does the AI Smart Waste Analyzer identify materials?',
      a: 'The analyzer uses Google Gemini Vision model fine-tuned on industrial waste classification datasets. It detects multi-part object features, checks against admin-configured Firestore recovery rules, and calculates normalized composition percentages.'
    },
    {
      q: 'Why are biomedical and hazardous safety warnings given top priority?',
      a: 'Safety hierarchy rules mandate that infectious medical materials (syringes, blood vials) and toxic substances (batteries, chemical solvents) present critical hazards. They override standard recycling advice to prevent disease transmission and chemical contamination.'
    },
    {
      q: 'How does client-side media compression work?',
      a: 'When an image or video frame is uploaded, an HTML5 Canvas pipeline scales and compresses the image to ~500KB before uploading to the API. If an image is already under 500KB, compression is automatically skipped.'
    },
    {
      q: 'What should I do if the AI confidence score is low (<60%)?',
      a: 'Low confidence indicates poor lighting, heavy blur, or an unlisted item. The system displays a caution badge and asks you to retake the photo in better lighting.'
    },
    {
      q: 'How do admins update themes, waste rules, and chatbot knowledge?',
      a: 'Admins log into /admin using Firebase Authentication. All content (theme CSS variables, categories, items, FAQs, CMS pages, settings) is dynamically persisted to Firestore and updated across all clients instantly.'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-heading text-foreground">Frequently Asked Questions</h1>
        <p className="text-xs text-muted max-w-xl mx-auto">
          Everything you need to know about AI waste segregation, recovery potential, and platform security.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions or keywords..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary shadow-sm"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface border border-border transition-all space-y-2 cursor-pointer hover:border-primary/40"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between font-bold text-sm text-foreground">
                <span className="flex items-center gap-2 font-heading">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>

              {isOpen && (
                <p className="text-xs text-muted leading-relaxed pt-2 border-t border-border">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
