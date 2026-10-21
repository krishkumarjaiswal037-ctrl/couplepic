import React, { useState } from 'react';
import {
  Camera,
  Download,
  Trash2,
  Heart,
  X,
  Lock,
  Plus,
  FolderPlus,
  Image as ImageIcon,
  UploadCloud,
  Film,
  Play,
  Sparkles,
  Radio,
} from 'lucide-react';
import type { Photo } from '../../types/wedding';
import { getDeviceSignature, getSavedGuestName, saveGuestName } from '../../lib/supabase';

interface PhotoGallerySectionProps {
  weddingId: string;
  coupleNames: string;
  photos: Photo[];
  onUploadPhoto: (payload: {
    photoUrl: string;
    mediaType?: 'photo' | 'video';
    videoDuration?: string;
    caption?: string;
    uploaderName: string;
    sessionCategory?: string;
  }) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<{ success: boolean; error?: string }>;
  onLikePhoto: (photoId: string) => Promise<void>;
  isAdmin: boolean;
  onOpenLiveStream?: (ceremonyName: string) => void;
}

const DEFAULT_SESSIONS: { name: string; description: string; badgeColor: string }[] = [
  {
    name: 'Haldi Ceremony',
    description: 'Auspicious turmeric blessings, yellow marigolds, and joyous rituals.',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  },
  {
    name: 'Mehndi Celebration',
    description: 'Intricate henna art, evening folk music, and sisterhood celebrations.',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  },
  {
    name: 'Stage Photo',
    description: 'Grand portraits on the stage with the couple, family, and guests.',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
  },
  {
    name: 'Sangeet & Dance',
    description: 'High-energy musical dance beats and choreographed family performances.',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
  },
  {
    name: 'Mandap & Vows',
    description: 'Sacred fire rituals, floral garlands, and eternal marriage vows.',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
  },
  {
    name: 'Reception',
    description: 'Evening banquet, celebratory toasts, and unforgettable couple moments.',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-500/10',
  },
];

const MAX_UPLOAD_ITEMS = 20;

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  weddingId,
  coupleNames,
  photos,
  onUploadPhoto,
  onDeletePhoto,
  onLikePhoto,
  isAdmin,
}) => {
  const currentDeviceSig = getDeviceSignature();

  // Sessions list
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
  const [activeSessionFilter, setActiveSessionFilter] = useState<string>('All');

  // Modals state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetSessionForUpload, setTargetSessionForUpload] = useState<string>('Stage Photo');

  // New ceremony session modal state
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDesc, setNewSessionDesc] = useState('');

  // Multi-photo & video upload state (up to 20 items at a time)
  const [previewFiles, setPreviewFiles] = useState<{
    file: File;
    previewUrl: string;
    isVideo: boolean;
  }[]>([]);
  const [singleUrl, setSingleUrl] = useState('');
  const [uploaderName, setUploaderName] = useState(getSavedGuestName());
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleOpenUploadForSession = (sessionName: string) => {
    setTargetSessionForUpload(sessionName);
    setPreviewFiles([]);
    setSingleUrl('');
    setCaption('');
    setFeedbackMsg(null);
    setUploadModalOpen(true);
  };

  // Handle multi-file selection (supports Photos & Videos, up to 20 at a time)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const availableSlots = MAX_UPLOAD_ITEMS - previewFiles.length;
    if (availableSlots <= 0) {
      setFeedbackMsg({
        text: `Maximum ${MAX_UPLOAD_ITEMS} photos and videos can be uploaded at a time.`,
        isError: true,
      });
      return;
    }

    const filesToAdd = newFiles.slice(0, availableSlots);
    if (newFiles.length > availableSlots) {
      setFeedbackMsg({
        text: `Selection capped at 20 items. Added first ${availableSlots} files.`,
        isError: false,
      });
    }

    const newPreviews = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
    }));

    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviewFiles((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  // Multi-photo & video batch upload handler (up to 20 at once)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim()) {
      setFeedbackMsg({ text: 'Please enter your name.', isError: true });
      return;
    }

    if (previewFiles.length === 0 && !singleUrl.trim()) {
      setFeedbackMsg({
        text: 'Please select up to 20 photos or videos to upload.',
        isError: true,
      });
      return;
    }

    try {
      setUploading(true);
      saveGuestName(uploaderName);

      if (previewFiles.length > 0) {
        const total = previewFiles.length;
        for (let i = 0; i < total; i++) {
          setUploadProgress({ current: i + 1, total });
          const item = previewFiles[i];

          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(item.file);
          });

          await onUploadPhoto({
            photoUrl: dataUrl,
            mediaType: item.isVideo ? 'video' : 'photo',
            caption: caption.trim() || undefined,
            uploaderName: uploaderName.trim(),
            sessionCategory: targetSessionForUpload,
          });
        }
      } else if (singleUrl.trim()) {
        const isVid = singleUrl.match(/\.(mp4|webm|mov)(\?.*)?$/i) !== null;
        await onUploadPhoto({
          photoUrl: singleUrl.trim(),
          mediaType: isVid ? 'video' : 'photo',
          caption: caption.trim() || undefined,
          uploaderName: uploaderName.trim(),
          sessionCategory: targetSessionForUpload,
        });
      }

      // Cleanup
      previewFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPreviewFiles([]);
      setSingleUrl('');
      setCaption('');
      setUploadModalOpen(false);
      setUploadProgress(null);
    } catch {
      setFeedbackMsg({ text: 'Upload failed. Please try again.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  // Create new ceremony session handler
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    const sessionExists = sessions.some(
      (s) => s.name.toLowerCase() === newSessionName.trim().toLowerCase()
    );

    if (sessionExists) {
      alert('This ceremony session already exists.');
      return;
    }

    const newS = {
      name: newSessionName.trim(),
      description: newSessionDesc.trim() || 'Guest uploaded ceremony pictures & videos.',
      badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    };

    setSessions((prev) => [...prev, newS]);
    setActiveSessionFilter(newS.name);
    setNewSessionName('');
    setNewSessionDesc('');
    setNewSessionModalOpen(false);
  };

  // Download high-resolution media (photos or videos)
  const handleDownload = (photo: Photo) => {
    const isVideo = photo.mediaType === 'video' || photo.photoUrl.startsWith('data:video');
    const ext = isVideo ? 'mp4' : 'jpg';
    const link = document.createElement('a');
    link.href = photo.photoUrl;
    link.download = `CouplePic-${coupleNames.replace(/\s+/g, '_')}-${photo.sessionCategory || 'media'}-${photo.id}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered media items
  const filteredPhotos = photos.filter((p) => {
    if (activeSessionFilter === 'All') return true;
    return p.sessionCategory === activeSessionFilter;
  });

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 lg:px-12 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/80 px-3.5 py-1 text-xs font-semibold tracking-wider text-stone-300 shadow">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest">Live Mobile Sync Active · Ceremony Vault</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Sacred Moments, Photos & Videos
          </h2>
          <p className="mt-1 text-sm text-stone-400 font-sans">
            Guests can upload up to <strong className="text-white">20 photos and videos at a time</strong>. Everything uploaded is instantly visible across all mobile phones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setNewSessionModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-200 hover:bg-stone-800 hover:border-stone-500 transition-all shadow-sm"
          >
            <FolderPlus className="h-4 w-4 text-amber-400" />
            <span>Add Ceremony Session</span>
          </button>

          <button
            onClick={() => handleOpenUploadForSession(activeSessionFilter === 'All' ? 'Stage Photo' : activeSessionFilter)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-all shadow-md active:scale-95"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload 20 Photos / Videos</span>
          </button>
        </div>
      </div>

      {/* Ceremony Sessions Cards Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map((sess) => {
          const sessionPhotos = photos.filter((p) => p.sessionCategory === sess.name);
          const isSelected = activeSessionFilter === sess.name;

          return (
            <div
              key={sess.name}
              onClick={() => setActiveSessionFilter(sess.name)}
              className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 shadow-xl ${
                isSelected
                  ? 'border-white bg-stone-900/90 shadow-2xl scale-[1.02]'
                  : 'border-stone-800 bg-stone-950/80 hover:border-stone-600 hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${sess.badgeColor}`}>
                  {sess.name}
                </span>
                <span className="text-xs font-mono font-semibold text-stone-400">
                  {sessionPhotos.length} {sessionPhotos.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                {sess.name}
              </h3>
              <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                {sess.description}
              </p>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                <span className="text-stone-400 group-hover:text-white transition-colors">
                  {isSelected ? 'Currently Viewing' : 'View Media'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenUploadForSession(sess.name);
                  }}
                  className="inline-flex items-center gap-1 font-bold text-white bg-stone-800 hover:bg-white hover:text-black px-3 py-1 rounded-full transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Upload (Up to 20)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs Bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSessionFilter('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSessionFilter === 'All'
                ? 'bg-white text-black shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            All Media ({photos.length})
          </button>

          {sessions.map((s) => {
            const count = photos.filter((p) => p.sessionCategory === s.name).length;
            return (
              <button
                key={s.name}
                onClick={() => setActiveSessionFilter(s.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeSessionFilter === s.name
                    ? 'bg-white text-black shadow'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {s.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Grid: Photos and Playable Videos */}
      <div className="mt-8">
        {filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-800 bg-stone-950/60 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-stone-400 mb-4 border border-stone-800">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              No photos or videos uploaded yet in {activeSessionFilter === 'All' ? 'this celebration' : activeSessionFilter}
            </h3>
            <p className="mt-2 text-sm text-stone-400 max-w-md mx-auto">
              Be the first guest to share moments! Select up to 20 photos and videos from your phone to share with all guests.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenUploadForSession(activeSessionFilter === 'All' ? 'Stage Photo' : activeSessionFilter)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-colors shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Photos & Videos</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPhotos.map((photo) => {
              const canDelete = isAdmin || photo.uploaderSignature === currentDeviceSig;
              const isVideo = photo.mediaType === 'video' || photo.photoUrl.startsWith('data:video');

              return (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-xl transition-all duration-300 hover:border-stone-500 hover:shadow-2xl"
                >
                  {/* Photo or Video Thumbnail */}
                  <div
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative aspect-square w-full cursor-pointer overflow-hidden bg-stone-900 flex items-center justify-center"
                  >
                    {isVideo ? (
                      <div className="relative h-full w-full">
                        <video
                          src={photo.photoUrl}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                        {/* Video Play Overlay Badge */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 ml-0.5 fill-black" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={photo.photoUrl}
                        alt={photo.caption || 'Ceremony photo'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Ceremony & Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                        {photo.sessionCategory || 'Stage Photo'}
                      </span>
                      {isVideo && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-600/90 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                          <Film className="h-3 w-3" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo);
                      }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-colors"
                      title={isVideo ? 'Download video' : 'Download high-resolution photo'}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Media Info Bar */}
                  <div className="p-3.5 flex items-center justify-between text-xs border-t border-stone-800/80 bg-stone-950">
                    <div className="truncate pr-2">
                      <span className="text-[11px] text-stone-400 block font-sans">
                        Uploaded by:
                      </span>
                      <span className="font-semibold text-white truncate block">
                        {photo.uploaderName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Like button */}
                      <button
                        onClick={() => onLikePhoto(photo.id)}
                        className="flex items-center gap-1 text-stone-400 hover:text-rose-400 transition-colors p-1"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span className="text-[11px]">{photo.likesCount || 0}</span>
                      </button>

                      {/* Strict Delete Button: only uploader or admin */}
                      {canDelete ? (
                        <button
                          onClick={async () => {
                            if (confirm(`Delete this ${isVideo ? 'video' : 'photo'}? This cannot be undone.`)) {
                              await onDeletePhoto(photo.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-400 transition-colors"
                          title="Delete (You uploaded this)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span
                          className="p-1 text-stone-600"
                          title="Only the original uploader or admin can delete this"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BATCH MULTI-PHOTO & VIDEO UPLOAD MODAL (UP TO 20 AT A TIME) */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold">
                    Upload Photos & Videos
                  </h3>
                  <p className="text-xs text-stone-400">
                    Ceremony: <strong className="text-white">{targetSessionForUpload}</strong> · Up to 20 files at once
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-stone-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedbackMsg && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs ${
                  feedbackMsg.isError
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              {/* Select Ceremony Session */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Select Ceremony Session:
                </label>
                <select
                  value={targetSessionForUpload}
                  onChange={(e) => setTargetSessionForUpload(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                >
                  {sessions.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Uploader Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Your Full Name: *
                </label>
                <input
                  type="text"
                  required
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-stone-500">
                  Visible to everyone viewing on mobile. Only you from this device or Admin can delete your uploads.
                </p>
              </div>

              {/* Multi-Photo & Video Picker: Up to 20 Items */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Choose Up to 20 Photos & Videos:
                  </label>
                  <span className="text-[11px] font-mono text-amber-300">
                    {previewFiles.length} / {MAX_UPLOAD_ITEMS} selected
                  </span>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-stone-700 bg-stone-900/50 p-6 text-center hover:border-stone-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    id="multi-media-input"
                    className="hidden"
                  />
                  <label
                    htmlFor="multi-media-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-800 text-stone-300">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-5 w-5" />
                        <Film className="h-4 w-4 text-rose-400" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white underline">
                      Click to Browse & Select Photos and Videos (Up to 20)
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Supports JPG, PNG, WEBP and MP4, WEBM, MOV videos
                    </span>
                  </label>
                </div>
              </div>

              {/* Selected Files Thumbnails Preview */}
              {previewFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span>
                      {previewFiles.length} {previewFiles.length === 1 ? 'file' : 'files'} ready to upload:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        previewFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                        setPreviewFiles([]);
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-52 overflow-y-auto p-1.5 bg-stone-900/60 rounded-xl border border-stone-800">
                    {previewFiles.map((item, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-700 group bg-stone-950">
                        {item.isVideo ? (
                          <div className="h-full w-full flex items-center justify-center relative">
                            <video
                              src={item.previewUrl}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Film className="h-4 w-4 text-rose-400" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.previewUrl}
                            alt="preview"
                            className="h-full w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemovePreview(idx)}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-white hover:bg-rose-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Fallback */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Or Direct Image / Video Web URL (Optional):
                </label>
                <input
                  type="url"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg or video.mp4"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Caption / Moment Note (Optional):
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Joyful turmeric ritual and dance video with cousins!"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Progress Indicator */}
              {uploadProgress && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-stone-300">
                    <span>Syncing media to mobile and web...</span>
                    <span>{uploadProgress.current} of {uploadProgress.total}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-full bg-white px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                >
                  {uploading
                    ? 'Syncing...'
                    : previewFiles.length > 1
                    ? `Upload All (${previewFiles.length} Items)`
                    : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW CEREMONY SESSION MODAL */}
      {newSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-xl font-bold">Add Ceremony Session</h3>
              </div>
              <button
                onClick={() => setNewSessionModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Session Name: *
                </label>
                <input
                  type="text"
                  required
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g. Ring Ceremony, Cocktail Night, Baraat Entry"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Description (Optional):
                </label>
                <textarea
                  rows={3}
                  value={newSessionDesc}
                  onChange={(e) => setNewSessionDesc(e.target.value)}
                  placeholder="What happens during this ceremony?"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setNewSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-colors shadow"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX PREVIEW WITH FULL VIDEO PLAYER */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center w-full"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedPhoto.mediaType === 'video' || selectedPhoto.photoUrl.startsWith('data:video') ? (
              <video
                src={selectedPhoto.photoUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] w-auto max-w-full rounded-2xl shadow-2xl border border-stone-800 bg-black"
              />
            ) : (
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.caption || 'Ceremony photo'}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
              />
            )}

            <div className="mt-4 flex items-center justify-between w-full text-sm text-stone-300 px-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {selectedPhoto.sessionCategory || 'Stage Photo'}
                  </span>
                  {(selectedPhoto.mediaType === 'video' || selectedPhoto.photoUrl.startsWith('data:video')) && (
                    <span className="rounded bg-rose-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Video
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400 block">
                  Uploaded by: {selectedPhoto.uploaderName}
                  {selectedPhoto.caption ? ` · "${selectedPhoto.caption}"` : ''}
                </span>
              </div>

              <button
                onClick={() => handleDownload(selectedPhoto)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 transition-colors shadow"
              >
                <Download className="h-4 w-4" />
                <span>Download {selectedPhoto.mediaType === 'video' ? 'Video' : 'Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
