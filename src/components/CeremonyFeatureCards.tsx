import React, { useState } from 'react';
import {
  Sun,
  Sparkle,
  Camera,
  Disc3,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CeremonyFeatureCardsProps {
  onOpenMusic: () => void;
  onOpenCreate: () => void;
  onOpenWishes: () => void;
}

export const CeremonyFeatureCards: React.FC<CeremonyFeatureCardsProps> = ({
  onOpenMusic,
  onOpenCreate,
  onOpenWishes,
}) => {
  const [activeHoverCard, setActiveHoverCard] = useState<number | null>(null);

  const ceremonyFeatures = [
    {
      icon: Sun,
      title: 'Haldi Ceremony',
      tag: 'Auspicious Turmeric',
      desc: 'Batch multi-photo & video uploads for bright yellow moments, playful turmeric rituals, and family blessings.',
      accent: 'from-amber-500/20 to-yellow-500/5',
      borderAccent: 'group-hover:border-amber-400/50',
      actionText: 'Register Portal',
      action: onOpenCreate,
      iconColor: 'text-amber-400',
    },
    {
      icon: Sparkle,
      title: 'Mehndi Celebration',
      tag: 'Intricate Henna',
      desc: 'Capture delicate henna patterns, evening sangeet dances, sisterhood banter, and high-res video clips.',
      accent: 'from-emerald-500/20 to-teal-500/5',
      borderAccent: 'group-hover:border-emerald-400/50',
      actionText: 'Share Henna Moments',
      action: onOpenCreate,
      iconColor: 'text-emerald-400',
    },
    {
      icon: Camera,
      title: 'Stage & Reception',
      tag: 'Grand Portraits',
      desc: 'Upload unlimited stage portraits and videos with sovereign guest deletion rights and direct instant HD downloads.',
      accent: 'from-purple-500/20 to-indigo-500/5',
      borderAccent: 'group-hover:border-purple-400/50',
      actionText: 'View Portraits',
      action: onOpenCreate,
      iconColor: 'text-purple-400',
    },
    {
      icon: Disc3,
      title: '300+ Ceremony Melodies',
      tag: 'YouTube Live Player',
      desc: 'Over 300 curated tracks categorized by ceremony with working YouTube video player and direct access.',
      accent: 'from-blue-500/20 to-cyan-500/5',
      borderAccent: 'group-hover:border-blue-400/50',
      actionText: 'Listen & Watch',
      action: onOpenMusic,
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-10">
      {/* Section Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Ceremony Highlights & Experiences</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sacred Rituals & Media Hub
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-400">
            Everything you need for an unforgettable wedding experience — from auspicious rituals to ceremony music.
          </p>
        </div>
      </div>

      {/* Interactive 3D Animated Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left perspective-container">
        {ceremonyFeatures.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = activeHoverCard === idx;

          return (
            <div
              key={idx}
              onClick={item.action}
              onMouseEnter={() => setActiveHoverCard(idx)}
              onMouseLeave={() => setActiveHoverCard(null)}
              className={`group relative rounded-2xl border border-stone-800 bg-stone-950/85 p-6 shadow-xl transition-all duration-300 backdrop-blur-sm cursor-pointer overflow-hidden flex flex-col justify-between ${
                item.borderAccent
              } ${isHovered ? 'scale-[1.03] -translate-y-2 shadow-2xl border-white/40' : ''}`}
            >
              {/* Dynamic top gradient ambient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div>
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 border border-stone-800 ${item.iconColor} shadow-inner group-hover:scale-110 group-hover:bg-stone-800 transition-all`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900/90 text-stone-300 border border-stone-800 group-hover:border-stone-700">
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

              <div className="relative z-10 mt-6 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs font-semibold text-stone-300 group-hover:text-white transition-colors">
                <span>{item.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
