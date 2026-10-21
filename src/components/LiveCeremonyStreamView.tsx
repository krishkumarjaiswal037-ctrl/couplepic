import React, { useState, useEffect } from 'react';
import { Camera, Download, Upload, ArrowLeft, RefreshCw, Sparkles, ExternalLink, Heart } from 'lucide-react';
import type { Photo, Wedding } from '../types/wedding';
import { fetchPhotos, uploadPhoto, likePhoto, getSavedGuestName, saveGuestName } from '../lib/supabase';

interface LiveCeremonyStreamViewProps {
  ceremonyName: string;
  wedding: Wedding;
  onExitToWebsite: () => void;
}

export const LiveCeremonyStreamView: React.FC<LiveCeremonyStreamViewProps> = ({
  ceremonyName,
  wedding,
  onExitToWebsite,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploaderName, setUploaderName] = useState(getSavedGuestName());
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Load and poll photos specifically for this ceremony
  const loadCeremonyPhotos = async () => {
    try {
      const allPhotos = await fetchPhotos(wedding.id);
      const filtered = allPhotos.filter((p) => p.sessionCategory === ceremonyName);
      setPhotos(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCeremonyPhotos();
    // Live poll every 4 seconds for real-time live pictures
    const interval = setInterval(loadCeremonyPhotos, 4000);
    return () => clearInterval(interval);
  }, [wedding.id, ceremonyName]);

  // Batch multi-photo upload
  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0 || !uploaderName.trim()) {
      alert('Please provide your name and select at least one photo.');
      return;
    }

    try {
      setUploading(true);
      saveGuestName(uploaderName);
      const total = selectedFiles.length;

      for (let i = 0; i < total; i++) {
        setUploadProgress({ current: i + 1, total });
        const file = selectedFiles[i];

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        await uploadPhoto({
          weddingId: wedding.id,
          photoUrl: dataUrl,
          caption: caption.trim() || undefined,
          uploaderName: uploaderName.trim(),
          sessionCategory: ceremonyName,
        });
      }

      setUploading(false);
      setUploadProgress(null);
      setUploadModalOpen(false);
      setSelectedFiles(null);
      setCaption('');
      await loadCeremonyPhotos();
    } catch {
      setUploading(false);
      setUploadProgress(null);
      alert('Failed to upload photos.');
    }
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ceremonyName.replace(/\s+/g, '_')}_${photo.uploaderName}_${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement('a');
      a.href = photo.photoUrl;
      a.target = '_blank';
      a.download = `photo_${photo.id}.jpg`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Bar for Live Stream */}
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
              {ceremonyName} · Live Stream
            </h1>
            <p className="text-[11px] text-stone-400">
              {wedding.coupleNames} · Live auto-sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded bg-white px-3.5 py-1.5 text-xs font-semibold uppercase text-black hover:bg-stone-200 transition-colors shadow"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Upload Photo(s)</span>
          </button>

          <button
            onClick={onExitToWebsite}
            className="inline-flex items-center gap-1.5 rounded border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <span>Open Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main Stream View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-800 p-16 text-center space-y-3">
            <Camera className="h-10 w-10 text-stone-500" />
            <h2 className="font-serif text-2xl font-bold">Waiting for live pictures...</h2>
            <p className="text-xs text-stone-400 max-w-sm">
              No photos have been uploaded for {ceremonyName} yet. Take a snapshot and upload right now!
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-xs font-semibold uppercase text-black hover:bg-stone-200"
            >
              <Upload className="h-4 w-4" />
              <span>Upload First Photo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-stone-800 bg-stone-900 shadow-xl"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-950">
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || 'Ceremony photo'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 flex items-center justify-between text-xs border-t border-stone-800 bg-stone-950">
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="font-semibold text-white truncate">{photo.uploaderName}</p>
                    {photo.caption && (
                      <p className="text-[11px] text-stone-400 italic truncate font-serif">
                        "{photo.caption}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDownload(photo)}
                      className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800"
                      title="Download Photo"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Multi-Photo Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md rounded-xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl">
            <h3 className="font-serif text-2xl font-bold">
              Upload Photos to {ceremonyName}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Select one or multiple photos to stream live immediately.
            </p>

            <form onSubmit={handleBatchUpload} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya or Arjun"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                  Select Multiple Photos *
                </label>
                <input
                  type="file"
                  multiple
                  required
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-stone-200 cursor-pointer"
                />
                {selectedFiles && (
                  <p className="mt-1.5 text-xs text-emerald-400 font-medium">
                    {selectedFiles.length} {selectedFiles.length === 1 ? 'photo' : 'photos'} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unforgettable moment at the ceremony"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              {uploadProgress && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-300">
                    <span>Uploading...</span>
                    <span>{uploadProgress.current} / {uploadProgress.total}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-200"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded bg-white px-5 py-2 text-xs font-semibold uppercase text-black hover:bg-stone-200 shadow"
                >
                  {uploading ? 'Uploading...' : 'Publish Live Photos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
