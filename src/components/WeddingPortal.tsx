import React, { useState, useEffect } from 'react';
import type { Wedding, Wish, Photo } from '../types/wedding';
import {
  fetchWishes,
  createWish,
  likeWish,
  deleteWish,
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
  likePhoto,
  getDeviceSignature,
} from '../lib/supabase';
import { CoupleHero } from './portal/CoupleHero';
import { WishesSection } from './portal/WishesSection';
import { PhotoGallerySection } from './portal/PhotoGallerySection';

interface WeddingPortalProps {
  wedding: Wedding;
  onBack: () => void;
  isAdmin: boolean;
}

export const WeddingPortal: React.FC<WeddingPortalProps> = ({
  wedding,
  onBack,
  isAdmin,
}) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [wishesData, photosData] = await Promise.all([
        fetchWishes(wedding.id),
        fetchPhotos(wedding.id),
      ]);
      setWishes(wishesData);
      setPhotos(photosData);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Live background polling so any upload from mobile is visible to all visitors within 3.5s
    const pollInterval = window.setInterval(() => {
      loadData(true);
    }, 3500);

    // Instant local broadcast sync for multi-tab / multi-device windows
    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('couplepic_media_sync');
        bc.onmessage = (event) => {
          if (event.data?.weddingId === wedding.id) {
            loadData(true);
          }
        };
      }
    } catch {
      // continue
    }

    const handleStorageChange = () => {
      loadData(true);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, [wedding.id]);

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Wish handlers
  const handleAddWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'heartCount'>) => {
    const created = await createWish(wishData);
    setWishes((prev) => [created, ...prev]);
  };

  const handleLikeWish = async (wishId: string) => {
    const count = await likeWish(wishId, wedding.id);
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, heartCount: count } : w))
    );
  };

  const handleDeleteWish = async (wishId: string) => {
    await deleteWish(wishId, wedding.id);
    setWishes((prev) => prev.filter((w) => w.id !== wishId));
  };

  // Photo handlers
  const handleUploadPhoto = async (payload: {
    photoUrl: string;
    caption?: string;
    uploaderName: string;
    sessionCategory?: string;
  }) => {
    const created = await uploadPhoto({
      weddingId: wedding.id,
      ...payload,
    });
    setPhotos((prev) => [created, ...prev]);
  };

  const handleDeletePhoto = async (photoId: string) => {
    const sig = getDeviceSignature();
    const result = await deletePhoto(photoId, wedding.id, sig, isAdmin);
    if (result.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
    return result;
  };

  const handleLikePhoto = async (photoId: string) => {
    const count = await likePhoto(photoId, wedding.id);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: count } : p))
    );
  };

  return (
    <div className="relative z-10 w-full min-h-screen pb-16">
      {/* 1. Couple Hero Header (No time, no countdown, no share button) */}
      <CoupleHero
        wedding={wedding}
        onBack={onBack}
        onJumpToSection={handleJumpToSection}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-16">
          {/* 2. Wishes & Guestbook Section */}
          <WishesSection
            weddingId={wedding.id}
            wishes={wishes}
            onAddWish={handleAddWish}
            onLikeWish={handleLikeWish}
            onDeleteWish={handleDeleteWish}
            isAdmin={isAdmin}
          />

          {/* 3. Ceremony Photos Section with multi-photo batch upload and separate ceremony sessions */}
          <PhotoGallerySection
            weddingId={wedding.id}
            coupleNames={wedding.coupleNames}
            photos={photos}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
            onLikePhoto={handleLikePhoto}
            isAdmin={isAdmin}
          />
        </div>
      )}
    </div>
  );
};
