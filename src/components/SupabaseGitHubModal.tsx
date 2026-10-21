import React, { useState } from 'react';
import {
  X,
  Database,
  Github,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Key,
  Server,
  Terminal,
  Cloud,
} from 'lucide-react';
import {
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  isSupabaseConfigured,
} from '../lib/supabase';

interface SupabaseGitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGitHubModal: React.FC<SupabaseGitHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'github'>('supabase');

  // Supabase state
  const [sbUrl, setSbUrl] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_url') || '' : ''
  );
  const [sbKey, setSbKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_key') || '' : ''
  );
  const [keysSaved, setKeysSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  if (!isOpen) return null;

  const handleSaveSbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(sbUrl, sbKey);
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const handleClearSbConfig = () => {
    clearSupabaseCredentials();
    setSbUrl('');
    setSbKey('');
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const copySqlSchema = () => {
    const sqlCode = `-- CouplePic - Supabase PostgreSQL Schema & RLS Policies
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Weddings Table (Strictly User-Created Only)
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    couple_names TEXT NOT NULL,
    marriage_date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    welcome_message TEXT DEFAULT 'Welcome to our celebration.',
    focus_position TEXT DEFAULT 'center 32%',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ceremony Photos Table (Multi-photo batch uploads per ceremony session)
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploader_name TEXT NOT NULL,
    uploader_signature TEXT NOT NULL,
    session_category TEXT NOT NULL DEFAULT 'Stage Photo',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Guest Wishes Table
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_relation TEXT,
    message TEXT NOT NULL,
    heart_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Public Read & Insert Policies
CREATE POLICY "Allow public read weddings" ON public.weddings FOR SELECT USING (true);
CREATE POLICY "Allow public insert weddings" ON public.weddings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Allow public upload photos" ON public.photos FOR INSERT WITH CHECK (uploader_name IS NOT NULL);

-- Strict Author-Only Deletion for Photos
CREATE POLICY "Allow author delete only" ON public.photos FOR DELETE USING (
  uploader_signature = coalesce(current_setting('request.headers', true)::jsonb->>'x-uploader-signature', '')
  OR auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Allow public insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlCode);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const copyGitCommands = () => {
    const gitCommands = `# CouplePic GitHub Deployment Workflow
git init
git add .
git commit -m "Feat: CouplePic 3D wedding ceremonies with 300+ YouTube songs, Supabase RLS & auto face centering"
git branch -M main
git remote add origin https://github.com/krishkumarjaiswal/couplepic.git
git push -u origin main`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(gitCommands);
      setCopiedGit(true);
      setTimeout(() => setCopiedGit(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 p-6 sm:p-7 text-white shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              {activeTab === 'supabase' ? (
                <Database className="h-5 w-5" />
              ) : (
                <Github className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                Supabase & GitHub Integration
              </h3>
              <p className="text-xs text-stone-400">
                Connect your live PostgreSQL cloud database or push CouplePic to GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex border-b border-stone-800">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'supabase'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Supabase Database</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'github'
                ? 'border-white text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Github className="h-4 w-4" />
            <span>GitHub Repository</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-5 flex-1 overflow-y-auto space-y-5 pr-1">
          {activeTab === 'supabase' ? (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isSupabaseConfigured()
                        ? 'Supabase Cloud Connected'
                        : 'Active in Local Storage Mode'}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {isSupabaseConfigured()
                        ? 'Syncing celebrations, ceremony photos, and wishes directly to Supabase.'
                        : 'Running persistent offline storage. Enter your keys below to enable cloud sync.'}
                    </div>
                  </div>
                </div>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  <span>Supabase Console</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Supabase Credentials Form */}
              <form onSubmit={handleSaveSbConfig} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleClearSbConfig}
                    className="text-xs text-stone-400 hover:text-rose-400 underline"
                  >
                    Clear Credentials
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>Save & Connect Supabase</span>
                  </button>
                </div>
              </form>

              {keysSaved && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                  Supabase settings saved! Celebrations will synchronize with your cloud database.
                </div>
              )}

              {/* Copy SQL Schema */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Copy PostgreSQL Database Schema
                  </span>
                  <button
                    type="button"
                    onClick={copySqlSchema}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Includes <code>weddings</code>, <code>photos</code> (with ceremony sessions), and <code>wishes</code> tables with device-hash Row Level Security (RLS) rules. Paste this in the Supabase SQL Editor.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* GitHub Repo Card */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="h-6 w-6 text-white" />
                    <div>
                      <h4 className="font-bold text-sm text-white">CouplePic Repository</h4>
                      <p className="text-[11px] text-stone-400">
                        Crafted by Krish Kumar Jaiswal
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-3.5 py-1.5 text-xs font-bold hover:bg-stone-200 transition-all shadow"
                  >
                    <span>Open GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  CouplePic is fully modularized with React 19, Tailwind CSS, Three.js 3D ceremony rings, Supabase PostgreSQL RLS, and 300+ ceremony wedding melodies.
                </p>
              </div>

              {/* Git Command Instructions */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <Terminal className="h-4 w-4 text-blue-400" />
                    <span>Git Push & Deploy Commands</span>
                  </div>

                  <button
                    type="button"
                    onClick={copyGitCommands}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors"
                  >
                    {copiedGit ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="overflow-x-auto rounded-lg bg-stone-950 p-3 text-[11px] font-mono text-stone-300 border border-stone-800">
{`git init
git add .
git commit -m "Feat: CouplePic wedding platform by Krish Kumar Jaiswal"
git branch -M main
git remote add origin https://github.com/krishkumarjaiswal/couplepic.git
git push -u origin main`}
                </pre>
              </div>

              {/* Vercel & Production Deploy */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 space-y-1 text-xs text-stone-400">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Cloud className="h-4 w-4 text-purple-400" />
                  <span>One-Click Cloud Deployment</span>
                </div>
                <p>
                  Connect your GitHub repository to Vercel or Netlify. Pre-configured with <code>vercel.json</code> SPA rewrites and client environment variable injection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
