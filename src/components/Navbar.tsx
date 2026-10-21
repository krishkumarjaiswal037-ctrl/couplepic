import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Home,
  Music,
  MessageSquareHeart,
  Heart,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'wedding';
  onNavigateHome: () => void;
  onOpenCreateModal: () => void;
  onOpenMusicModal: () => void;
  onOpenWishesModal: () => void;
  selectedWeddingCouple?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenCreateModal,
  onOpenMusicModal,
  onOpenWishesModal,
  selectedWeddingCouple,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-black/90 backdrop-blur-xl transition-all duration-300 shadow-2xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Brand: 3D Ring Logo with 3D Animated Name on Hover: Krish Kumar Jaiswal */}
        <div
          className="relative flex items-center gap-3 shrink-0"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-3.5 text-left focus:outline-none"
            aria-label="CouplePic Home"
            style={{ perspective: '1000px' }}
          >
            {/* 3D Intertwined Metallic Wedding Ring Logo */}
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-900 via-black to-stone-950 border border-stone-700 shadow-2xl transition-all duration-500 ease-out ${
                isLogoHovered
                  ? 'border-amber-400/80 shadow-amber-500/25 rotate-6 scale-110'
                  : 'shadow-black/70'
              }`}
              style={{
                transform: isLogoHovered
                  ? 'perspective(600px) rotateY(25deg) rotateX(-10deg) translateZ(10px)'
                  : 'perspective(600px) rotateY(0deg) rotateX(0deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className={`h-8 w-8 drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)] transition-transform duration-700 ease-out ${
                  isLogoHovered ? 'rotate-12 scale-110' : ''
                }`}
              >
                <defs>
                  {/* Rich 3D Gold Gradient with Specular Highlights */}
                  <linearGradient id="gold3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="75%" stopColor="#ca8a04" />
                    <stop offset="100%" stopColor="#713f12" />
                  </linearGradient>

                  {/* Platinum / Diamond White Gradient */}
                  <linearGradient id="plat3dGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#e2e8f0" />
                    <stop offset="70%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>

                  {/* Glowing Jewel Radial Gradient */}
                  <radialGradient id="solitaireGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Primary Gold Ring (Left Ring with 3D Angled Ellipse) */}
                <ellipse
                  cx="40"
                  cy="54"
                  rx="26"
                  ry="26"
                  fill="none"
                  stroke="url(#gold3dGrad)"
                  strokeWidth="9"
                  transform="rotate(-18 40 54)"
                />

                {/* Intertwined Platinum Ring (Right Ring) */}
                <ellipse
                  cx="60"
                  cy="46"
                  rx="26"
                  ry="26"
                  fill="none"
                  stroke="url(#plat3dGrad)"
                  strokeWidth="9"
                  transform="rotate(18 60 46)"
                />

                {/* Solitaire Diamond with Specular Cross Flare */}
                <circle cx="60" cy="18" r="7" fill="url(#solitaireGlow)" />
                <polygon
                  points="60,11 66,18 60,25 54,18"
                  fill="#ffffff"
                  stroke="#60a5fa"
                  strokeWidth="0.8"
                />

                {/* Front Interlocking Weave Arc */}
                <path
                  d="M 49 35 A 26 26 0 0 1 56 46"
                  stroke="url(#gold3dGrad)"
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              <Heart className="h-3 w-3 absolute -top-1 -right-1 text-rose-500 fill-rose-500 drop-shadow-md animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  CouplePic
                </span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-300">
                  3D
                </span>
              </div>
              <span className="text-[9px] tracking-[0.24em] uppercase font-sans font-semibold text-stone-400">
                Ceremony Moments
              </span>
            </div>
          </button>

          {/* 3D Animated Name Card: Krish Kumar Jaiswal with 3D Depth */}
          {isLogoHovered && (
            <div
              className="absolute left-0 -bottom-12 z-50 flex items-center gap-2.5 rounded-full border border-amber-400/60 bg-gradient-to-r from-stone-950 via-black to-stone-950 px-4 py-1.5 shadow-[0_10px_30px_rgba(251,191,36,0.35)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 whitespace-nowrap"
              style={{
                transform: 'perspective(600px) rotateX(8deg) translateY(2px)',
                boxShadow: '0 12px 28px -4px rgba(251,191,36,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 text-black font-bold text-[10px] shadow">
                K
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 tracking-wide text-xs drop-shadow">
                  Krish Kumar Jaiswal
                </span>
                <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-amber-400/90 -mt-0.5">
                  ✦ 3D Architect & Creator ✦
                </span>
              </div>
            </div>
          )}

          {selectedWeddingCouple && currentView === 'wedding' && (
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-stone-800 text-xs text-stone-400">
              <span className="uppercase tracking-widest text-[9px] font-bold">Celebration:</span>
              <span className="font-serif font-bold italic text-sm text-white">
                {selectedWeddingCouple}
              </span>
            </div>
          )}
        </div>

        {/* Centered Desktop Navigation Bar (Hover interactive) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full border border-stone-800/80 bg-stone-900/70 shadow-2xl text-xs font-semibold backdrop-blur-md"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {/* Home */}
          <button
            onClick={onNavigateHome}
            onMouseEnter={() => setHoveredNav('home')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
              currentView === 'home'
                ? 'bg-white text-black font-bold shadow'
                : hoveredNav === 'home'
                ? 'bg-white/15 text-white'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>

          {/* Create Celebration */}
          <button
            onClick={onOpenCreateModal}
            onMouseEnter={() => setHoveredNav('create')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
              hoveredNav === 'create'
                ? 'bg-white/15 text-white'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Celebration</span>
          </button>

          {/* 300+ YouTube Wedding Songs */}
          <button
            onClick={onOpenMusicModal}
            onMouseEnter={() => setHoveredNav('music')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
              hoveredNav === 'music'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Music className="h-3.5 w-3.5 text-blue-400" />
            <span>300+ YouTube Songs</span>
          </button>

          {/* Wishes Generator */}
          <button
            onClick={onOpenWishesModal}
            onMouseEnter={() => setHoveredNav('wishes')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
              hoveredNav === 'wishes'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <MessageSquareHeart className="h-3.5 w-3.5 text-rose-400" />
            <span>Wishes Generator</span>
          </button>
        </nav>

        {/* Right Zone: Create Celebration Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-black" />
            <span>Create Celebration</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl md:hidden text-stone-200 hover:bg-stone-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-black/95 px-6 py-5 shadow-2xl space-y-3 backdrop-blur-xl">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 py-2 text-sm font-medium text-stone-200 hover:text-white"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onOpenCreateModal();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 py-2 text-sm font-medium text-stone-200 hover:text-white"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Celebration</span>
          </button>

          <button
            onClick={() => {
              onOpenMusicModal();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 py-2 text-sm font-medium text-stone-200 hover:text-white"
          >
            <Music className="h-4 w-4 text-blue-400" />
            <span>300+ YouTube Songs</span>
          </button>

          <button
            onClick={() => {
              onOpenWishesModal();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 py-2 text-sm font-medium text-stone-200 hover:text-white"
          >
            <MessageSquareHeart className="h-4 w-4 text-rose-400" />
            <span>Wishes Generator</span>
          </button>

          {/* Attribution in Mobile Drawer */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <span>Crafted in 3D by</span>
            <span className="font-serif font-bold text-amber-200">Krish Kumar Jaiswal</span>
          </div>
        </div>
      )}
    </header>
  );
};
