import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Heart, ExternalLink, Globe } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto pt-12 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground font-heading">
                {settings.siteName || 'EcoSmart AI'}
              </span>
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              {settings.bannerText || 'AI-Powered Sustainable Waste Classification, Segregation & Recovery System.'}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                AI Vision System Online
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                Vercel Serverless Architecture
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4 font-heading">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home & Feature Overview</Link>
              </li>
              <li>
                <Link to="/analyze" className="hover:text-primary transition-colors font-medium text-foreground">AI Waste Analyzer</Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-primary transition-colors">Waste Classification Directory</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Administration & Info */}
          <div>
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4 font-heading">
              Administration
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
                  <Shield className="w-4 h-4 text-primary" />
                  Admin Dashboard Login
                </Link>
              </li>
              <li>
                <a href="#chatbot" className="hover:text-primary transition-colors">Ask EcoBot AI Assistant</a>
              </li>
              {settings.contactEmail && (
                <li className="text-xs text-muted pt-2">
                  Support: <a href={`mailto:${settings.contactEmail}`} className="underline text-foreground">{settings.contactEmail}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>{settings.footerText || '© 2026 EcoSmart AI Waste System. All rights reserved.'}</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Zero Waste & Circular Economy
          </p>
        </div>
      </div>
    </footer>
  );
}
