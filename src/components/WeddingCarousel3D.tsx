import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  PlusCircle,
  Camera,
  Heart,
} from 'lucide-react';
import { WeddingCard3D } from './WeddingCard3D';
import type { Wedding } from '../types/wedding';

interface WeddingCarouselProps {
  weddings: Wedding[];
  onSelectWedding: (wedding: Wedding) => void;
  onOpenCreate: () => void;
}

export const WeddingCarousel3D: React.FC<WeddingCarouselProps> = ({
  weddings,
  onSelectWedding,
  onOpenCreate,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-stone-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Celebration Portals</span>
          </div>
          <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Active Celebrations {weddings.length > 0 && `(${weddings.length})`}
          </h2>
          <p className="mt-1 text-sm text-stone-400">
            {weddings.length > 0
              ? 'Select a celebration below to view ceremony sessions, upload photos, and post heartfelt wishes.'
              : 'Create your custom celebration portal below to start uploading ceremony photos.'}
          </p>
        </div>

        {/* View Switcher & Carousel Controls (when weddings exist) */}
        {weddings.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full bg-stone-900 p-1 border border-stone-800">
              <button
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scroll('left')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-stone-200 hover:bg-stone-800 hover:border-stone-600 transition-colors"
                  aria-label="Previous wedding"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-stone-200 hover:bg-stone-800 hover:border-stone-600 transition-colors"
                  aria-label="Next wedding"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cards Viewport */}
      {weddings.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-stone-800 bg-stone-950/70 p-10 sm:p-16 text-center shadow-2xl backdrop-blur-md">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 shadow-xl mb-5">
              <Camera className="h-8 w-8 text-blue-400" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              No Celebrations Created Yet
            </h3>

            <p className="mt-2.5 text-sm text-stone-400 leading-relaxed font-sans">
              Only authentic user celebrations will appear here. Create your wedding or ceremony portal to start uploading photos across Haldi, Mehndi, and Stage celebrations!
            </p>

            <button
              onClick={onOpenCreate}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 active:scale-95 transition-all shadow-xl hover:shadow-white/20"
            >
              <PlusCircle className="h-4 w-4 text-black" />
              <span>Create Your Celebration</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {weddings.map((wedding, index) => (
              <div key={wedding.id} style={{ scrollSnapAlign: 'start' }}>
                <WeddingCard3D
                  wedding={wedding}
                  onSelect={onSelectWedding}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {weddings.map((wedding, index) => (
            <WeddingCard3D
              key={wedding.id}
              wedding={wedding}
              onSelect={onSelectWedding}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};
