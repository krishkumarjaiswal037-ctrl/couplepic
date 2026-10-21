import React from 'react';
import {
  Sparkles,
  Heart,
  ArrowDown,
  Music,
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
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-12 text-center">
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

      {/* Explore Section Anchor */}
      <div className="mt-10 flex justify-center">
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
