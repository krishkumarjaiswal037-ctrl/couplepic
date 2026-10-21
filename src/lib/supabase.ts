import { createClient } from '@supabase/supabase-js';
import type { Wedding, Wish, Photo } from '../types/wedding';

// Client device signature for strict RLS photo ownership
export function getDeviceSignature(): string {
  if (typeof window === 'undefined') return 'server_sig';
  let sig = localStorage.getItem('wedding_uploader_sig');
  if (!sig) {
    sig = `guest_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
    localStorage.setItem('wedding_uploader_sig', sig);
  }
  return sig;
}

export function getSavedGuestName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('wedding_guest_name') || '';
}

export function saveGuestName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('wedding_guest_name', name.trim());
}

// Supabase Configuration from Environment or Local Settings
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('aethelgard_sb_key') || '' : '';

  const url = storedUrl || envUrl;
  const key = storedKey || envKey;

  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) };
};

export const isSupabaseConfigured = (): boolean => getSupabaseConfig().isConfigured;

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    return createClient(url, key, {
      global: {
        headers: {
          'x-uploader-signature': getDeviceSignature(),
        },
      },
    });
  }
  return null;
};

// NO PRE-SEEDED WEDDINGS: Only user-created celebrations and user-uploaded photos!
const DEFAULT_FALLBACK_COVER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2318181b"/><stop offset="50%" stop-color="%2309090b"/><stop offset="100%" stop-color="%23000000"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="48%" font-family="serif" font-size="44" fill="%23ffffff" text-anchor="middle" letter-spacing="4">CEREMONY CELEBRATION</text><text x="50%" y="56%" font-family="sans-serif" font-size="18" fill="%23a1a1aa" text-anchor="middle">CouplePic</text></svg>';

const SEED_WEDDINGS: Wedding[] = [];
const SEED_WISHES: Record<string, Wish[]> = {};
const SEED_PHOTOS: Record<string, Photo[]> = {};

// Clean up any legacy seed weddings from prior sessions
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('aethelgard_weddings');
    localStorage.removeItem('aethelgard_wishes');
    localStorage.removeItem('aethelgard_photos');
  } catch {
    // ignore
  }
}

// Local storage helper
const getStore = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  const item = localStorage.getItem(`couplepic_${key}`);
  if (!item) {
    localStorage.setItem(`couplepic_${key}`, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultVal;
  }
};

const setStore = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`couplepic_${key}`, JSON.stringify(val));
};

// ==========================================
// WEDDINGS API
// ==========================================

export async function fetchWeddings(): Promise<Wedding[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.from('weddings').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          slug: d.slug,
          coupleNames: d.couple_names,
          marriageDate: d.marriage_date,
          venue: d.venue,
          coverImageUrl: d.cover_image_url,
          welcomeMessage: d.welcome_message,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }
  return getStore('weddings', SEED_WEDDINGS);
}

export async function createWedding(payload: {
  coupleNames: string;
  marriageDate: string;
  venue: string;
  coverImageUrl: string;
  welcomeMessage?: string;
  focusPosition?: string;
}): Promise<Wedding> {
  const slug = payload.coupleNames
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `wedding-${Date.now()}`;

  const newWedding: Wedding = {
    id: `wed-${Date.now()}`,
    slug: `${slug}-${Math.floor(Math.random() * 900 + 100)}`,
    coupleNames: payload.coupleNames,
    marriageDate: payload.marriageDate,
    venue: payload.venue,
    coverImageUrl: payload.coverImageUrl || DEFAULT_FALLBACK_COVER,
    welcomeMessage: payload.welcomeMessage || 'Welcome to our celebration of love and togetherness.',
    focusPosition: payload.focusPosition || 'center 32%',
    createdAt: new Date().toISOString(),
  };

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('weddings')
        .insert({
          slug: newWedding.slug,
          couple_names: newWedding.coupleNames,
          marriage_date: newWedding.marriageDate,
          venue: newWedding.venue,
          cover_image_url: newWedding.coverImageUrl,
          welcome_message: newWedding.welcomeMessage,
          focus_position: newWedding.focusPosition,
        })
        .select()
        .single();
      if (!error && data) {
        newWedding.id = data.id;
      }
    } catch {
      // continue
    }
  }

  const list = getStore('weddings', SEED_WEDDINGS);
  const updated = [newWedding, ...list];
  setStore('weddings', updated);

  return newWedding;
}

export async function updateWedding(
  id: string,
  payload: Partial<Omit<Wedding, 'id' | 'createdAt'>>
): Promise<Wedding | null> {
  const list = getStore('weddings', SEED_WEDDINGS);
  const idx = list.findIndex((w) => w.id === id);
  if (idx === -1) return null;

  const updatedItem = { ...list[idx], ...payload };
  list[idx] = updatedItem;
  setStore('weddings', list);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('weddings').update({
        couple_names: updatedItem.coupleNames,
        marriage_date: updatedItem.marriageDate,
        venue: updatedItem.venue,
        cover_image_url: updatedItem.coverImageUrl,
        welcome_message: updatedItem.welcomeMessage,
      }).eq('id', id);
    } catch {
      // continue
    }
  }

  return updatedItem;
}

export async function deleteWedding(id: string): Promise<boolean> {
  const list = getStore('weddings', SEED_WEDDINGS);
  const filtered = list.filter((w) => w.id !== id);
  setStore('weddings', filtered);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('weddings').delete().eq('id', id);
    } catch {
      // continue
    }
  }
  return true;
}

// ========================
// WISHES & GUESTBOOK
// ========================

export async function fetchWishes(weddingId: string): Promise<Wish[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.from('wishes').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          weddingId: d.wedding_id,
          guestName: d.guest_name,
          guestRelation: d.guest_relation,
          message: d.message,
          heartCount: d.heart_count || 1,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  const map = getStore('wishes', SEED_WISHES);
  return map[weddingId] || [];
}

export async function createWish(payload: Omit<Wish, 'id' | 'createdAt' | 'heartCount'>): Promise<Wish> {
  const item: Wish = {
    ...payload,
    id: `w-${Date.now()}`,
    heartCount: 1,
    createdAt: new Date().toISOString(),
  };

  const map = getStore('wishes', SEED_WISHES);
  const existing = map[payload.weddingId] || [];
  map[payload.weddingId] = [item, ...existing];
  setStore('wishes', map);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data } = await sb.from('wishes').insert({
        wedding_id: item.weddingId,
        guest_name: item.guestName,
        guest_relation: item.guestRelation,
        message: item.message,
        heart_count: item.heartCount,
      }).select().single();
      if (data) item.id = data.id;
    } catch {
      // continue
    }
  }

  return item;
}

export async function likeWish(id: string, weddingId: string): Promise<number> {
  const map = getStore('wishes', SEED_WISHES);
  const list = map[weddingId] || [];
  const target = list.find((w) => w.id === id);
  if (target) {
    target.heartCount = (target.heartCount || 0) + 1;
    setStore('wishes', map);
    return target.heartCount;
  }
  return 1;
}

export async function deleteWish(id: string, weddingId: string): Promise<boolean> {
  const map = getStore('wishes', SEED_WISHES);
  if (map[weddingId]) {
    map[weddingId] = map[weddingId].filter((w) => w.id !== id);
    setStore('wishes', map);
  }

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('wishes').delete().eq('id', id);
    } catch {
      // continue
    }
  }
  return true;
}

// ========================
// PHOTOS WITH SESSIONS & STRICT PERMISSION
// ========================

export async function fetchPhotos(weddingId: string): Promise<Photo[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.from('photos').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          weddingId: d.wedding_id,
          photoUrl: d.photo_url,
          mediaType: d.media_type || (d.photo_url?.startsWith('data:video') ? 'video' : 'photo'),
          videoDuration: d.video_duration,
          caption: d.caption,
          uploaderName: d.uploader_name,
          uploaderSignature: d.uploader_signature,
          sessionCategory: d.session_category || 'Stage Photo',
          likesCount: d.likes_count || 0,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  const map = getStore('photos', SEED_PHOTOS);
  return map[weddingId] || [];
}

export async function uploadPhoto(payload: {
  weddingId: string;
  photoUrl: string;
  mediaType?: 'photo' | 'video';
  videoDuration?: string;
  caption?: string;
  uploaderName: string;
  sessionCategory?: string;
}): Promise<Photo> {
  const signature = getDeviceSignature();
  const isVideo = payload.mediaType === 'video' || payload.photoUrl.startsWith('data:video');
  const photo: Photo = {
    id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    weddingId: payload.weddingId,
    photoUrl: payload.photoUrl,
    mediaType: isVideo ? 'video' : 'photo',
    videoDuration: payload.videoDuration,
    caption: payload.caption,
    uploaderName: payload.uploaderName.trim() || 'Guest',
    uploaderSignature: signature,
    sessionCategory: payload.sessionCategory?.trim() || 'Stage Photo',
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  const map = getStore('photos', SEED_PHOTOS);
  const existing = map[payload.weddingId] || [];
  map[payload.weddingId] = [photo, ...existing];
  setStore('photos', map);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data } = await sb.from('photos').insert({
        wedding_id: photo.weddingId,
        photo_url: photo.photoUrl,
        media_type: photo.mediaType,
        video_duration: photo.videoDuration,
        caption: photo.caption,
        uploader_name: photo.uploaderName,
        uploader_signature: photo.uploaderSignature,
        session_category: photo.sessionCategory,
      }).select().single();
      if (data) photo.id = data.id;
    } catch {
      // continue
    }
  }

  // Real-time broadcast for multi-device / multi-tab live sync
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('couplepic_media_sync');
      bc.postMessage({ type: 'MEDIA_UPLOADED', weddingId: payload.weddingId, photo });
      bc.close();
    }
  } catch {
    // continue
  }

  return photo;
}

export async function deletePhoto(
  photoId: string,
  weddingId: string,
  currentDeviceSig: string,
  isAdmin: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const map = getStore('photos', SEED_PHOTOS);
  const list = map[weddingId] || [];
  const target = list.find((p) => p.id === photoId);

  if (!target) {
    return { success: false, error: 'Photo not found.' };
  }

  // Check authorization: author only or admin
  if (!isAdmin && target.uploaderSignature !== currentDeviceSig) {
    return {
      success: false,
      error: 'Permission Denied: You can only delete photos that you personally uploaded.',
    };
  }

  map[weddingId] = list.filter((p) => p.id !== photoId);
  setStore('photos', map);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('photos').delete().eq('id', photoId);
    } catch {
      // continue
    }
  }

  return { success: true };
}

export async function likePhoto(id: string, weddingId: string): Promise<number> {
  const map = getStore('photos', SEED_PHOTOS);
  const list = map[weddingId] || [];
  const target = list.find((p) => p.id === id);
  if (target) {
    target.likesCount = (target.likesCount || 0) + 1;
    setStore('photos', map);
    return target.likesCount;
  }
  return 1;
}

export function saveSupabaseCredentials(url: string, key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('aethelgard_sb_url', url.trim());
  localStorage.setItem('aethelgard_sb_key', key.trim());
}

export function clearSupabaseCredentials(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('aethelgard_sb_url');
  localStorage.removeItem('aethelgard_sb_key');
}
