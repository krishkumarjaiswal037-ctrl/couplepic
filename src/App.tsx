/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { Wedding } from './types/wedding';
import { fetchWeddings, createWedding } from './lib/supabase';
import { ThreeCeremonyRings } from './components/ThreeCeremonyRings';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { WeddingCarousel3D } from './components/WeddingCarousel3D';
import { WeddingPortal } from './components/WeddingPortal';
import { AdminPanel } from './components/AdminPanel';
import { CreateWeddingModal } from './components/CreateWeddingModal';
import { MusicSuggesterModal } from './components/MusicSuggesterModal';
import { WishesGeneratorModal } from './components/WishesGeneratorModal';
import { SupabaseGitHubModal } from './components/SupabaseGitHubModal';
import { CeremonyFeatureCards } from './components/CeremonyFeatureCards';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'wedding' | 'admin'>('home');
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [wishesModalOpen, setWishesModalOpen] = useState(false);
  const [supabaseGitHubOpen, setSupabaseGitHubOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all active celebrations
  const refreshWeddings = async () => {
    try {
      setLoading(true);
      const list = await fetchWeddings();
      setWeddings(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWeddings();
  }, []);

  const handleSelectWedding = (wedding: Wedding) => {
    setSelectedWedding(wedding);
    setCurrentView('wedding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedWedding(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatedSuccess = (newWedding: Wedding) => {
    setWeddings((prev) => [newWedding, ...prev]);
    setSelectedWedding(newWedding);
    setCurrentView('wedding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreScroll = () => {
    const el = document.getElementById('carousel-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen theme-black bg-black text-white flex flex-col font-sans transition-colors duration-300">
      {/* 3D Ceremony Rings Background */}
      <ThreeCeremonyRings theme="black" />

      {/* Top Navigation Bar with 3D Ring Logo & Hover Attribution */}
      <Navbar
        currentView={currentView === 'wedding' ? 'wedding' : 'home'}
        onNavigateHome={handleBackToHome}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onOpenMusicModal={() => setMusicModalOpen(true)}
        onOpenWishesModal={() => setWishesModalOpen(true)}
        selectedWeddingCouple={selectedWedding?.coupleNames}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full relative z-10">
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Homepage Hero */}
            <HomeHero
              onOpenCreate={() => setCreateModalOpen(true)}
              onExplore={handleExploreScroll}
              onOpenMusic={() => setMusicModalOpen(true)}
              onOpenWishes={() => setWishesModalOpen(true)}
              weddingsCount={weddings.length}
            />

            {/* Active Celebrations Section (Placed above the four feature cards) */}
            <div id="carousel-section">
              <WeddingCarousel3D
                weddings={weddings}
                onSelectWedding={handleSelectWedding}
                onOpenCreate={() => setCreateModalOpen(true)}
              />
            </div>

            {/* 4 Ceremony Cards: Haldi, Mehndi, Stage & Reception, 300+ Melodies */}
            <CeremonyFeatureCards
              onOpenMusic={() => setMusicModalOpen(true)}
              onOpenCreate={() => setCreateModalOpen(true)}
              onOpenWishes={() => setWishesModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'wedding' && selectedWedding && (
          <WeddingPortal
            wedding={selectedWedding}
            onBack={handleBackToHome}
            isAdmin={isAdminLoggedIn}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={() => setIsAdminLoggedIn(true)}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentView('home');
            }}
            onSelectWedding={handleSelectWedding}
          />
        )}
      </main>

      {/* Register Celebration Modal (Direct Custom Upload Only with Auto Face Centering) */}
      <CreateWeddingModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={createWedding}
        onCreatedSuccess={handleCreatedSuccess}
      />

      {/* Wedding Melodies with 300+ YouTube Songs & Embedded Working Video Player */}
      <MusicSuggesterModal
        isOpen={musicModalOpen}
        onClose={() => setMusicModalOpen(false)}
      />

      {/* 50+ Personalized Wishes Generator */}
      <WishesGeneratorModal
        isOpen={wishesModalOpen}
        onClose={() => setWishesModalOpen(false)}
        activeCoupleNames={selectedWedding?.coupleNames}
      />

      {/* Supabase PostgreSQL & GitHub Repository Integration Modal */}
      <SupabaseGitHubModal
        isOpen={supabaseGitHubOpen}
        onClose={() => setSupabaseGitHubOpen(false)}
      />

      {/* Footer with exclusive Admin Login Placement & Krish Kumar Jaiswal credit */}
      <Footer
        onNavigateAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenMusic={() => setMusicModalOpen(true)}
      />
    </div>
  );
}
