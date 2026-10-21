import React from 'react';
import { Calendar, MapPin, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import type { Wedding } from '../../types/wedding';

interface CoupleHeroProps {
  wedding: Wedding;
  onBack: () => void;
  onJumpToSection: (sectionId: string) => void;
}

export const CoupleHero: React.FC<CoupleHeroProps> = ({ wedding, onBack, onJumpToSection }) => {
  // Only display clean marriage date without time
  const dateObj = new Date(wedding.marriageDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const optimalFocus = wedding.focusPosition || 'center 32%';

  return (
    <div className="relative w-full overflow-hidden min-h-[520px] sm:min-h-[560px] flex items-end">
      {/* Background Cover Image with Auto Face Centering & Facial Clarity Filters */}
      <div className="absolute inset-0 z-0">
        <img
          src={wedding.coverImageUrl}
          alt={wedding.coupleNames}
          referrerPolicy="no-referrer"
          style={{
            objectPosition: optimalFocus,
            filter: 'brightness(0.82) contrast(1.08) saturate(1.06)',
          }}
          className="h-full w-full object-cover transition-all duration-700"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80';
          }}
        />
        {/* Balanced Vignette & Scrim: Light in middle so faces shine, dark at top/bottom for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-black/75 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white border border-stone-700 hover:bg-black hover:border-stone-500 transition-all shadow-lg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Celebrations</span>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-28 lg:px-12 w-full">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-stone-700/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 shadow">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>The Wedding Celebration of</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            {wedding.coupleNames}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-200">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-stone-500">·</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>{wedding.venue}</span>
            </div>
          </div>

          {wedding.welcomeMessage && (
            <p className="max-w-2xl text-sm sm:text-base italic leading-relaxed text-stone-200 font-serif drop-shadow">
              "{wedding.welcomeMessage}"
            </p>
          )}

          {/* Quick Jump Bar: Sign Guestbook & Ceremony Photos */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => onJumpToSection('guestbook')}
              className="rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Sign Guestbook
            </button>
            <button
              onClick={() => onJumpToSection('gallery')}
              className="rounded-full border border-stone-600 bg-stone-900/90 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 hover:border-stone-400 transition-all shadow-md backdrop-blur-sm"
            >
              Ceremony Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
