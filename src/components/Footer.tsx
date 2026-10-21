import React, { useState } from 'react';
import {
  Heart,
  Lock,
  Sparkles,
  Camera,
  Film,
  Radio,
  Flame,
  Music,
  ShieldCheck,
  Disc3,
} from 'lucide-react';

interface FooterProps {
  onNavigateAdmin: () => void;
  onOpenCreate: () => void;
  onOpenMusic: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin, onOpenCreate, onOpenMusic }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const keepsakeFeatures = [
    {
      icon: Radio,
      title: 'Live Mobile Broadcast',
      desc: 'Instant sync across all guest phones whenever anyone uploads photos or videos.',
    },
    {
      icon: Film,
      title: 'Ceremony Video Vault',
      desc: 'Upload and replay up to 20 ceremony moments simultaneously in high definition.',
    },
    {
      icon: Flame,
      title: 'Sacred Vows & Rituals',
      desc: 'Dedicated spaces for Haldi turmeric, Mehndi henna art, and Mandap vows.',
    },
    {
      icon: Disc3,
      title: '300+ YouTube Melodies',
      desc: 'Curated ceremony music tracks directly linked with live video playback.',
    },
  ];

  return (
    <footer className="relative z-10 mt-28 border-t border-stone-800/80 bg-gradient-to-b from-stone-950 via-black to-black text-stone-300 overflow-hidden">
      {/* 3D Ambient Top Light Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.3)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {/* Top 3D Interactive Keepsake Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {keepsakeFeatures.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: isHovered
                    ? 'perspective(700px) translateY(-6px) rotateX(4deg) scale(1.02)'
                    : 'perspective(700px) translateY(0px) rotateX(0deg)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group relative rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 shadow-2xl backdrop-blur-xl overflow-hidden hover:border-amber-400/50 hover:bg-stone-900/80"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 border border-stone-800 text-amber-300 shadow-inner group-hover:scale-110 group-hover:border-amber-400/40 transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main 3D Brand & Administration Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12 pt-6 border-t border-stone-800/60 items-start">
          {/* Brand Info with 3D Rings Emblem */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-900 to-black border border-stone-700/80 shadow-2xl"
                style={{ transform: 'perspective(400px) rotateY(-10deg)' }}
              >
                <svg viewBox="0 0 100 100" className="h-7 w-7 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
                  <ellipse cx="40" cy="54" rx="24" ry="24" fill="none" stroke="#fbbf24" strokeWidth="8" transform="rotate(-15 40 54)" />
                  <ellipse cx="60" cy="46" rx="24" ry="24" fill="none" stroke="#e2e8f0" strokeWidth="8" transform="rotate(15 60 46)" />
                  <circle cx="60" cy="20" r="6" fill="#ffffff" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight block">
                  CouplePic
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-semibold text-amber-400/90 block">
                  Ceremony Moments Vault
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-sm">
              The modern interactive wedding celebration experience. Upload unlimited photos and videos with zero limits, enjoy 300+ ceremony tracks, and preserve memories with sovereign guest deletion rights.
            </p>
          </div>

          {/* Quick Celebration Actions */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-xs">
              Quick Portals
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={onOpenCreate}
                className="text-left text-stone-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Register New Celebration Portal</span>
              </button>

              <button
                onClick={onOpenMusic}
                className="text-left text-stone-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <Music className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>300+ YouTube Wedding Melodies</span>
              </button>

              <div className="flex items-center gap-2 text-stone-500 text-[11px] pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Device-Signature Author Protection</span>
              </div>
            </div>
          </div>

          {/* Admin Moderation Console Placement */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-xs">
              Platform Administration
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Single-administrator locked console. Moderate ceremonies, override photo permissions, and manage database sync.
            </p>
            <div className="pt-1">
              <button
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 border border-stone-700/80 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 hover:border-amber-400/50 transition-all shadow-md group"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400 group-hover:text-amber-300" />
                <span>Admin Login Console</span>
              </button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 h-px w-full bg-stone-800/80" />

        {/* Prominent 3D Signature Credit by Krish Kumar Jaiswal */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-stone-500 font-mono">
            © {new Date().getFullYear()} CouplePic. All rights reserved.
          </p>

          {/* 3D Embossed Golden Author Plaque */}
          <div
            className="group relative inline-flex items-center gap-3 rounded-full border border-amber-400/40 bg-gradient-to-r from-stone-950 via-black to-stone-950 px-5 py-2 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-amber-500/20"
            style={{
              transform: 'perspective(800px) rotateX(4deg)',
              boxShadow: '0 8px 24px -2px rgba(251,191,36,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                Crafted in 3D by
              </span>
              <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 text-sm tracking-wide">
                Krish Kumar Jaiswal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
