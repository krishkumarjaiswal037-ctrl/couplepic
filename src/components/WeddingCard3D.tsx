import React, { useRef, useState } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Heart } from 'lucide-react';
import type { Wedding } from '../types/wedding';

interface WeddingCardProps {
  wedding: Wedding;
  onSelect: (wedding: Wedding) => void;
  index: number;
}

export const WeddingCard3D: React.FC<WeddingCardProps> = ({ wedding, onSelect, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Format clean date without time
  const weddingDate = new Date(wedding.marriageDate);
  const formattedDate = weddingDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate 3D card tilt based on pointer position relative to card center
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="w-full min-w-[320px] max-w-[390px] shrink-0 py-6 perspective-container">
      <div
        ref={cardRef}
        onClick={() => onSelect(wedding)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(wedding);
          }
        }}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
        }}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-stone-950 p-3 text-left shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
          isHovered ? 'border-stone-500 shadow-2xl shadow-blue-500/10' : 'border-stone-800'
        }`}
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Ambient Top Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Card Cover Visual */}
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-stone-900">
          <img
            src={wedding.coverImageUrl}
            alt={wedding.coupleNames}
            referrerPolicy="no-referrer"
            style={{
              objectPosition: wedding.focusPosition || 'center 32%',
              filter: 'contrast(1.06) brightness(0.98) saturate(1.05)',
            }}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top subtle badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/10">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Ceremony Portal</span>
          </div>

          {/* Venue preview tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs text-stone-200">
            <MapPin className="h-4 w-4 shrink-0 text-white" />
            <span className="truncate font-medium">{wedding.venue}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold tracking-wider uppercase">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
              {wedding.coupleNames}
            </h3>
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-stone-300 font-sans">
            {wedding.welcomeMessage || 'Celebrate the sacred union and ceremonies with our loved ones.'}
          </p>

          {/* Bottom Action */}
          <div className="flex items-center justify-between border-t border-stone-800/80 pt-3.5 text-xs">
            <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
              <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
              <span>CouplePic Live</span>
            </span>

            <span className="inline-flex items-center gap-1.5 font-bold text-white group-hover:translate-x-1.5 transition-transform">
              <span>View Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
