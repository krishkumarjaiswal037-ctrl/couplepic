export type AppTheme = 'black' | 'white' | 'blue' | 'monochrome' | 'white-blue' | 'dark-blue';

export type DefaultPhotoSession =
  | 'Haldi Ceremony'
  | 'Mehndi Celebration'
  | 'Stage Photo'
  | 'Sangeet & Dance'
  | 'Mandap & Vows'
  | 'Reception';

export interface Wedding {
  id: string;
  slug: string;
  coupleNames: string;
  marriageDate: string; // ISO date string (YYYY-MM-DD)
  venue: string;
  coverImageUrl: string;
  welcomeMessage?: string;
  focusPosition?: string; // e.g. 'center 32%' for auto face centering
  createdAt: string;
}

export interface Wish {
  id: string;
  weddingId: string;
  guestName: string;
  guestRelation?: string;
  message: string;
  heartCount: number;
  createdAt: string;
}

export interface Photo {
  id: string;
  weddingId: string;
  photoUrl: string; // image data URL or video data URL
  mediaType?: 'photo' | 'video';
  videoDuration?: string;
  caption?: string;
  uploaderName: string;
  uploaderSignature: string; // Client device UUID hash to guarantee strict delete permissions
  sessionCategory: string; // 'Haldi Ceremony' | 'Mehndi Celebration' | 'Stage Photo' | custom
  likesCount: number;
  createdAt: string;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  youtubeQuery: string;
  youtubeVideoId: string;
  duration?: string;
  vibe: string;
}
