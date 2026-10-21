import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ArrowDown,
  Music,
  Camera,
  Sun,
  Sparkle,
  Disc3,
  Layers,
  Flame,
} from 'lucide-react';

interface HomeHeroProps {
  onOpenCreate: () => void;
  onExplore: () => void;
  onOpenMusic: () => void;
  onOpenWishes: () => void;
  weddingsCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpenCreate,
  onExplore,
  onOpenMusic,
  onOpenWishes,
  weddingsCount,
}) => {
  const [activeHoverCard, setActiveHoverCard] = useState<number | null>(null);

  const ceremonyFeatures = [
    {
      icon: Sun,
      title: 'Haldi Ceremony',
      tag: 'Auspicious Turmeric',
      desc: 'Batch multi-photo upload for bright yellow moments, playful rituals, and family blessings.',
      accent: 'from-amber-500/20 to-yellow-500/5',
      borderAccent: 'group-hover:border-amber-400/50',
    },
    {
      icon: Sparkle,
      title: 'Mehndi Celebration',
      tag: 'Intricate Henna',
      desc: 'Capture delicate henna patterns, festive laughter, evening songs, and sisterhood memories.',
      accent: 'from-emerald-500/20 to-teal-500/5',
      borderAccent: 'group-hover:border-emerald-400/50',
    },
    {
      icon: Camera,
      title: 'Stage & Reception',
      tag: 'Grand Portraits',
      desc: 'Upload high-resolution portraits with sovereign guest deletion rights and direct instant downloads.',
      accent: 'from-purple-500/20 to-indigo-500/5',
      borderAccent: 'group-hover:border-purple-400/50',
    },
    {
      icon: Disc3,
      title: '300+ Ceremony Melodies',
      tag: 'YouTube Live Video',
      desc: 'Over 300 curated tracks categorized by ceremony with working YouTube video player and direct access.',
      accent: 'from-blue-500/20 to-cyan-500/5',
      borderAccent: 'group-hover:border-blue-400/50',
    },
  ];

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-12 text-center">
      {/* Kicker badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-stone-200 shadow-xl backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="tracking-widest uppercase">CouplePic · Ceremony Moments & Guest Platform</span>
      </div>

      {/* Main Animated Headline */}
      <h1 className="mt-8 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.12]">
        Capture Every Sacred Moment with{' '}
        <span className="bg-gradient-to-r from-white via-blue-200 to-amber-200 bg-clip-text text-transparent animate-shimmer">
          CouplePic
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-stone-300 leading-relaxed font-sans font-normal">
        An interactive celebration portal for couples and guests. Upload multiple ceremony photos across{' '}
        <strong className="text-white font-semibold">Haldi</strong>,{' '}
        <strong className="text-white font-semibold">Mehndi</strong>, and{' '}
        <strong className="text-white font-semibold">Stage Celebrations</strong>, watch 300+ YouTube ritual tracks, and share heartfelt wishes.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          onClick={onOpenCreate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-stone-200 active:scale-95 transition-all shadow-xl hover:shadow-white/20"
        >
          <Sparkles className="h-4 w-4 text-black" />
          <span>Register Celebration</span>
        </button>

        <button
          onClick={onOpenMusic}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-700 bg-stone-900/90 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-200 hover:bg-stone-800 hover:text-white hover:border-stone-500 active:scale-95 transition-all shadow-md backdrop-blur-sm"
        >
          <Music className="h-4 w-4 text-blue-400" />
          <span>300+ YouTube Songs</span>
        </button>

        <button
          onClick={onOpenWishes}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-700 bg-stone-900/90 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-200 hover:bg-stone-800 hover:text-white hover:border-stone-500 active:scale-95 transition-all shadow-md backdrop-blur-sm"
        >
          <Heart className="h-4 w-4 text-rose-400" />
          <span>Wishes Generator</span>
        </button>
      </div>

      {/* Interactive 3D Animated Feature Cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left perspective-container">
        {ceremonyFeatures.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = activeHoverCard === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveHoverCard(idx)}
              onMouseLeave={() => setActiveHoverCard(null)}
              className={`group relative rounded-2xl border border-stone-800 bg-stone-950/80 p-6 shadow-xl transition-all duration-300 backdrop-blur-sm cursor-pointer overflow-hidden ${
                item.borderAccent
              } ${isHovered ? 'scale-[1.03] -translate-y-1.5 shadow-2xl' : ''}`}
            >
              {/* Dynamic top gradient ambient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 border border-stone-800 text-white shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900/90 text-stone-300 border border-stone-800">
                  {item.tag}
                </span>
              </div>

              <h3 className="relative z-10 font-serif text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                {item.title}
              </h3>

              <p className="relative z-10 mt-2 text-xs leading-relaxed text-stone-400 font-sans">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Explore Section Anchor */}
      <div className="mt-14 flex justify-center">
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors group"
        >
          <span>Explore Couple Celebrations</span>
          <ArrowDown className="h-3.5 w-3.5 group-hover:translate-y-1 transition-transform animate-bounce" />
        </button>
      </div>
    </div>
  );
};
