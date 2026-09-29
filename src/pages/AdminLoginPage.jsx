import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isLiveFirebase } from '../services/firebaseClient';

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setEmail('admin@ecosmart.waste');
    setPassword('admin123password');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-2xl space-y-6 glass-panel">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">Administrator Portal</h2>
          <p className="text-xs text-muted">
            Authenticated access for system controls, rules engine, theme settings, and CMS manager.
          </p>
        </div>

        {!isLiveFirebase && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span>Demo Mode Active</span>
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="underline font-bold text-[11px] hover:text-foreground"
              >
                Auto-fill Admin Demo Credentials
              </button>
            </div>
            <p className="text-[11px]">
              Firebase client keys are optional for initial testing. Click above or enter any email/password to log into the Admin Dashboard.
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecosmart.waste"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-xs shadow-lg shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating Token...' : 'Log In to Admin Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
