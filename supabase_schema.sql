-- ==============================================================================
-- CouplePic - Supabase PostgreSQL Database Schema & Real-Time Sync
-- Created by Krish Kumar Jaiswal
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click "Run"

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Weddings Table (Strictly User Created Only)
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    couple_names TEXT NOT NULL,
    marriage_date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    welcome_message TEXT DEFAULT 'Welcome to our celebration of love and togetherness.',
    focus_position TEXT DEFAULT 'center 32%',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ceremony Photos & Videos Table
-- Supports up to 20 batch uploads of photos and videos per session!
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'photo', -- 'photo' or 'video'
    video_duration TEXT,
    caption TEXT,
    uploader_name TEXT NOT NULL,
    uploader_signature TEXT NOT NULL, -- Client device token ensuring author-only deletion
    session_category TEXT NOT NULL DEFAULT 'Stage Photo', -- Haldi, Mehndi, Stage Photo, Sangeet, etc.
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wishes & Guestbook Table
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_relation TEXT,
    message TEXT NOT NULL,
    heart_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 6. Weddings Policies (Public Read & Public Insert)
CREATE POLICY "Public Read Weddings" 
ON public.weddings FOR SELECT USING (true);

CREATE POLICY "Public Create Weddings" 
ON public.weddings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update Weddings" 
ON public.weddings FOR UPDATE USING (true);

CREATE POLICY "Public Delete Weddings" 
ON public.weddings FOR DELETE USING (true);

-- 7. Photos & Videos Policies
CREATE POLICY "Public Read Ceremony Photos and Videos" 
ON public.photos FOR SELECT USING (true);

CREATE POLICY "Public Upload Photos and Videos" 
ON public.photos FOR INSERT WITH CHECK (uploader_name IS NOT NULL);

CREATE POLICY "Author or Admin Delete Photo" 
ON public.photos FOR DELETE USING (
  uploader_signature = coalesce(current_setting('request.headers', true)::jsonb->>'x-uploader-signature', '')
  OR auth.role() = 'authenticated'
);

CREATE POLICY "Public Like Photo" 
ON public.photos FOR UPDATE USING (true);

-- 8. Wishes Policies
CREATE POLICY "Public Read Wishes" 
ON public.wishes FOR SELECT USING (true);

CREATE POLICY "Public Submit Wishes" 
ON public.wishes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update Wishes" 
ON public.wishes FOR UPDATE USING (true);

CREATE POLICY "Public Delete Wishes" 
ON public.wishes FOR DELETE USING (true);

-- 9. Enable Realtime Replication for instant multi-device sync
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.weddings, public.photos, public.wishes;
COMMIT;
