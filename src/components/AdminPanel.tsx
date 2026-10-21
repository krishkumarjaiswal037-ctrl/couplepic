import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Key,
  LogOut,
  Edit,
  Trash2,
  Database,
  Cloud,
  Copy,
  Check,
  Sparkles,
  Camera,
  MessageSquare,
  AlertTriangle,
  Unlock,
} from 'lucide-react';
import type { Wedding, Wish, Photo } from '../types/wedding';
import {
  fetchWeddings,
  updateWedding,
  deleteWedding,
  fetchWishes,
  deleteWish,
  fetchPhotos,
  deletePhoto,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  isSupabaseConfigured,
} from '../lib/supabase';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onSelectWedding: (wedding: Wedding) => void;
}

interface AdminLockInfo {
  isLocked: boolean;
  ownerDeviceId: string;
  claimedAt: string;
  ownerName: string;
}

// Generate or retrieve persistent unique device fingerprint
function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let devId = localStorage.getItem('couplepic_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('couplepic_device_id', devId);
  }
  return devId;
}

function getAdminLock(): AdminLockInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('couplepic_admin_lock');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onSelectWedding,
}) => {
  const [deviceId] = useState<string>(getOrCreateDeviceId);
  const [adminLock, setAdminLock] = useState<AdminLockInfo | null>(getAdminLock);

  // Login form state
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Management tab
  const [activeTab, setActiveTab] = useState<'weddings' | 'wishes' | 'photos' | 'supabase'>('weddings');

  // Data states
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [allWishes, setAllWishes] = useState<{ wedding: Wedding; wish: Wish }[]>([]);
  const [allPhotos, setAllPhotos] = useState<{ wedding: Wedding; photo: Photo }[]>([]);
  const [loading, setLoading] = useState(false);

  // Editing wedding modal state
  const [editingWedding, setEditingWedding] = useState<Wedding | null>(null);
  const [editCoupleNames, setEditCoupleNames] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const [editGreeting, setEditGreeting] = useState('');

  // Supabase keys configuration
  const [sbUrl, setSbUrl] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_url') || '' : ''
  );
  const [sbKey, setSbKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_key') || '' : ''
  );
  const [keysSaved, setKeysSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync admin lock state
  useEffect(() => {
    setAdminLock(getAdminLock());
  }, [isAdminLoggedIn]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const wList = await fetchWeddings();
      setWeddings(wList);

      const wishesAgg: { wedding: Wedding; wish: Wish }[] = [];
      const photosAgg: { wedding: Wedding; photo: Photo }[] = [];

      for (const w of wList) {
        const [wishes, photos] = await Promise.all([fetchWishes(w.id), fetchPhotos(w.id)]);
        wishes.forEach((item) => wishesAgg.push({ wedding: w, wish: item }));
        photos.forEach((item) => photosAgg.push({ wedding: w, photo: item }));
      }

      setAllWishes(wishesAgg);
      setAllPhotos(photosAgg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login with Single-Admin Lockout enforcement
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentLock = getAdminLock();
    // If locked by a different device, deny immediately
    if (currentLock && currentLock.isLocked && currentLock.ownerDeviceId !== deviceId) {
      setLoginError(
        'Access Denied: The Admin Portal has already been claimed and locked by another device. Only 1 administrator is permitted.'
      );
      return;
    }

    // Default authorized credentials
    if (adminId.trim() === 'admin' && password === 'wedding_master_2026') {
      setLoginError(null);

      // Claim single-admin lock for this device
      const lockData: AdminLockInfo = {
        isLocked: true,
        ownerDeviceId: deviceId,
        claimedAt: new Date().toISOString(),
        ownerName: 'Krish Kumar Jaiswal (Master Admin)',
      };
      localStorage.setItem('couplepic_admin_lock', JSON.stringify(lockData));
      setAdminLock(lockData);

      onLogin();
    } else {
      setLoginError('Invalid Admin User ID or Password. Try ID "admin" and password "wedding_master_2026".');
    }
  };

  // Allow the authorized admin to release the lock if they want to transfer it
  const handleReleaseAdminLock = () => {
    if (confirm('Release the single-admin lock? Another device will be able to claim admin access.')) {
      localStorage.removeItem('couplepic_admin_lock');
      setAdminLock(null);
      onLogout();
    }
  };

  const handleStartEdit = (w: Wedding) => {
    setEditingWedding(w);
    setEditCoupleNames(w.coupleNames);
    setEditVenue(w.venue);
    setEditDate(w.marriageDate.split('T')[0]);
    setEditBanner(w.coverImageUrl);
    setEditGreeting(w.welcomeMessage || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWedding) return;

    await updateWedding(editingWedding.id, {
      coupleNames: editCoupleNames.trim(),
      venue: editVenue.trim(),
      marriageDate: `${editDate}T17:00:00Z`,
      coverImageUrl: editBanner.trim(),
      welcomeMessage: editGreeting.trim(),
    });

    setEditingWedding(null);
    loadAdminData();
  };

  const handleDeleteWedding = async (id: string, names: string) => {
    if (confirm(`Are you sure you want to completely delete "${names}" and all its photos, stories, and wishes?`)) {
      await deleteWedding(id);
      loadAdminData();
    }
  };

  const handleDeleteWishAdmin = async (wishId: string, weddingId: string) => {
    if (confirm('Delete this guest wish?')) {
      await deleteWish(wishId, weddingId);
      loadAdminData();
    }
  };

  const handleDeletePhotoAdmin = async (photoId: string, weddingId: string) => {
    if (confirm('Admin Override: Permanently remove this photo?')) {
      await deletePhoto(photoId, weddingId, 'admin_signature', true);
      loadAdminData();
    }
  };

  const handleSaveSbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(sbUrl, sbKey);
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const handleClearSbConfig = () => {
    clearSupabaseCredentials();
    setSbUrl('');
    setSbKey('');
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const copySqlSchema = () => {
    const sqlCode = `-- CouplePic - Supabase PostgreSQL Schema & RLS Policies
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    couple_names TEXT NOT NULL,
    marriage_date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    welcome_message TEXT DEFAULT 'Welcome to our celebration.',
    focus_position TEXT DEFAULT 'center 32%',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploader_name TEXT NOT NULL,
    uploader_signature TEXT NOT NULL,
    session_category TEXT NOT NULL DEFAULT 'Stage Photo',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_relation TEXT,
    message TEXT NOT NULL,
    heart_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlCode);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  // CHECK LOCK STATUS: If portal is locked by someone else
  const isLockedByAnother = adminLock && adminLock.isLocked && adminLock.ownerDeviceId !== deviceId;

  // If not logged in: check lock status
  if (!isAdminLoggedIn) {
    if (isLockedByAnother) {
      return (
        <div className="relative z-10 mx-auto max-w-md px-6 py-24">
          <div className="rounded-2xl border border-red-500/30 bg-stone-950 p-8 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 shadow-lg shadow-red-500/20">
              <Lock className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                Security Restriction
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">
                Admin Portal Locked
              </h2>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Only <strong className="text-white">one person</strong> can enter and be administrator. The portal is currently claimed and locked by the master administrator on their private device.
            </p>

            <div className="rounded-xl border border-stone-800 bg-stone-900/80 p-3.5 text-left text-xs text-stone-400 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Lock Status:</span>
                <span className="text-red-400 font-bold">LOCKED & CLAIMED</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Active Admin:</span>
                <span className="text-stone-200">Krish Kumar Jaiswal</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Policy:</span>
                <span className="text-stone-300">Single-device exclusive</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 italic">
              No further admin logins can be accepted on this device.
            </p>
          </div>
        </div>
      );
    }

    // Unclaimed or this device is authorized to login
    return (
      <div className="relative z-10 mx-auto max-w-md px-6 py-24">
        <div className="rounded-2xl border border-stone-800 bg-stone-950 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 border border-stone-700 text-white shadow-md">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-white">
              CouplePic Admin
            </h2>
            <p className="text-xs text-stone-400">
              Only one person can enter. Once claimed, the admin portal locks for all other users.
            </p>
          </div>

          {loginError && (
            <div className="mt-5 rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Admin User ID
              </label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-sm text-white focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-sm text-white focus:border-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl bg-stone-900/80 p-3.5 border border-stone-800 text-[11px] text-stone-300 space-y-1">
              <p className="font-semibold text-white">Master Credentials:</p>
              <p>User ID: <code className="bg-black px-1.5 py-0.5 rounded text-white font-mono">admin</code></p>
              <p>Password: <code className="bg-black px-1.5 py-0.5 rounded text-white font-mono">wedding_master_2026</code></p>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 shadow-lg active:scale-95 transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Claim & Lock Admin Access</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN ADMIN CONSOLE (Exclusive Active Session)
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-12 text-white">
      {/* Admin Header with Active Lock Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Shield className="h-3.5 w-3.5" />
            <span>Master Console · Krish Kumar Jaiswal</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            CouplePic Control Center
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Manage user celebrations, moderate ceremony photos, review wishes, and manage Supabase database sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Lock status pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-300 font-semibold shadow">
            <Lock className="h-3 w-3" />
            <span>Single Admin Lock Active</span>
          </div>

          <button
            onClick={handleReleaseAdminLock}
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 border border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-300 hover:text-amber-300 hover:border-amber-400 transition-colors"
            title="Release the lock so another device can claim admin"
          >
            <Unlock className="h-3 w-3" />
            <span>Release Lock</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 border border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { id: 'weddings', label: `Registered Celebrations (${weddings.length})`, icon: Sparkles },
          { id: 'wishes', label: `Guest Wishes (${allWishes.length})`, icon: MessageSquare },
          { id: 'photos', label: `Ceremony Photos (${allPhotos.length})`, icon: Camera },
          { id: 'supabase', label: 'Supabase & Database SQL', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : activeTab === 'weddings' ? (
        /* WEDDINGS TAB */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {weddings.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs rounded-2xl border border-stone-800 bg-stone-950 p-8">
                No user celebrations created yet. Click "Create Celebration" in the navigation bar to register one.
              </div>
            ) : (
              weddings.map((w) => (
                <div
                  key={w.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={w.coverImageUrl}
                      alt={w.coupleNames}
                      style={{ objectPosition: w.focusPosition || 'center 32%' }}
                      className="h-16 w-24 object-cover rounded-xl border border-stone-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-bold text-white">
                        {w.coupleNames}
                      </h3>
                      <p className="text-xs text-stone-400">{w.venue}</p>
                      <p className="text-[11px] text-amber-300">
                        Date: {new Date(w.marriageDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectWedding(w)}
                      className="rounded-full bg-stone-900 px-3.5 py-1.5 text-xs text-stone-200 hover:bg-stone-800 border border-stone-700"
                    >
                      View Portal
                    </button>
                    <button
                      onClick={() => handleStartEdit(w)}
                      className="inline-flex items-center gap-1 rounded-full bg-stone-900 border border-stone-700 px-3.5 py-1.5 text-xs text-white hover:bg-stone-800"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteWedding(w.id, w.coupleNames)}
                      className="inline-flex items-center gap-1 rounded-full bg-red-950/80 border border-red-500/40 px-3.5 py-1.5 text-xs text-red-200 hover:bg-red-900"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === 'wishes' ? (
        /* WISHES MODERATION TAB */
        <div className="space-y-4">
          <div className="rounded-xl bg-stone-900/60 p-4 border border-stone-800 text-xs text-stone-300">
            Admins have master permission to moderate or delete inappropriate guest comments across all celebrations.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allWishes.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs rounded-2xl border border-stone-800 bg-stone-950 p-8">
                No wishes submitted yet.
              </div>
            ) : (
              allWishes.map(({ wedding, wish }) => (
                <div
                  key={wish.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-white text-base">
                        {wish.guestName}
                      </span>
                      {wish.guestRelation && (
                        <span className="text-[11px] text-stone-400">({wish.guestRelation})</span>
                      )}
                      <span className="text-[11px] text-amber-300 font-medium">
                        for {wedding.coupleNames}
                      </span>
                    </div>
                    <p className="font-serif italic text-sm text-stone-300">
                      "{wish.message}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteWishAdmin(wish.id, wedding.id)}
                    className="self-end md:self-center inline-flex items-center gap-1.5 rounded-full bg-red-950/80 border border-red-500/40 px-3.5 py-1.5 text-xs text-red-200 hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Wish</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === 'photos' ? (
        /* PHOTOS OVERRIDE TAB */
        <div className="space-y-4">
          <div className="rounded-xl bg-stone-900/60 p-4 border border-stone-800 text-xs text-stone-300">
            Photo Overrides: While normal guests can only delete photos they personally uploaded on their device, the administrator can override and delete any photo platform-wide.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPhotos.length === 0 ? (
              <div className="col-span-full py-12 text-center text-stone-400 text-xs rounded-2xl border border-stone-800 bg-stone-950 p-8">
                No ceremony photos uploaded yet.
              </div>
            ) : (
              allPhotos.map(({ wedding, photo }) => (
                <div
                  key={photo.id}
                  className="relative rounded-2xl border border-stone-800 bg-stone-950 overflow-hidden p-2.5 space-y-2 shadow-xl"
                >
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || 'Upload'}
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-white truncate">
                      {photo.sessionCategory || 'Stage Photo'}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">
                      By: {photo.uploaderName}
                    </p>
                    <p className="text-[10px] text-amber-300 truncate">
                      Celebration: {wedding.coupleNames}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeletePhotoAdmin(photo.id, wedding.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-red-950/80 border border-red-500/40 py-1.5 text-xs text-red-200 hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Admin Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* SUPABASE TAB */
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-emerald-400" />
                <h3 className="font-serif text-2xl font-bold text-white">
                  Supabase Live Connection
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isSupabaseConfigured()
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-stone-900 text-stone-300 border border-stone-700'
                }`}
              >
                {isSupabaseConfigured() ? 'Cloud Sync Connected' : 'Local Storage Mode'}
              </span>
            </div>

            <form onSubmit={handleSaveSbConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Supabase URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1Ni..."
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClearSbConfig}
                  className="text-xs text-stone-400 hover:text-red-400 underline"
                >
                  Reset / Clear Credentials
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 shadow"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>Save Supabase Credentials</span>
                </button>
              </div>
            </form>

            {keysSaved && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs text-emerald-200">
                Credentials saved successfully!
              </div>
            )}
          </div>

          {/* Copyable SQL Schema */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-white">
                Supabase Schema SQL
              </h3>
              <button
                onClick={copySqlSchema}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 border border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-200 hover:bg-white hover:text-black transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Run this in your Supabase SQL editor to create the tables with row-level security.
            </p>
          </div>
        </div>
      )}

      {/* Edit Wedding Modal */}
      {editingWedding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-white">
              Edit Celebration Details
            </h3>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Couple Names
                </label>
                <input
                  type="text"
                  required
                  value={editCoupleNames}
                  onChange={(e) => setEditCoupleNames(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  required
                  value={editVenue}
                  onChange={(e) => setEditVenue(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Marriage Date
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editBanner}
                  onChange={(e) => setEditBanner(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Welcome Greeting
                </label>
                <textarea
                  rows={2}
                  value={editGreeting}
                  onChange={(e) => setEditGreeting(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingWedding(null)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
