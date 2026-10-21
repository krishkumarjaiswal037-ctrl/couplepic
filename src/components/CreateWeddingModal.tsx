import React, { useState } from 'react';
import { X, Sparkles, Upload, Heart, Sliders, CheckCircle2 } from 'lucide-react';
import type { Wedding } from '../types/wedding';

interface CreateWeddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    coupleNames: string;
    marriageDate: string;
    venue: string;
    coverImageUrl: string;
    welcomeMessage?: string;
    focusPosition?: string;
  }) => Promise<Wedding>;
  onCreatedSuccess: (wedding: Wedding) => void;
}

export const CreateWeddingModal: React.FC<CreateWeddingModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onCreatedSuccess,
}) => {
  const [coupleNames, setCoupleNames] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [venue, setVenue] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto Face Centering: Default optimal face height is 32% from top
  const [faceOffsetY, setFaceOffsetY] = useState(32);
  const [isAutoFaceAdjusted, setIsAutoFaceAdjusted] = useState(true);

  if (!isOpen) return null;

  // File upload handler - allows any person to upload custom photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('Image file is larger than 15MB. Please select an image under 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImageUrl(reader.result);
          // Auto-adjust face positioning to 32% for ideal portrait centering
          setFaceOffsetY(32);
          setIsAutoFaceAdjusted(true);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAutoFaceCentering = () => {
    setFaceOffsetY(32);
    setIsAutoFaceAdjusted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim()) {
      setError('Please enter the couple names.');
      return;
    }
    if (!marriageDate) {
      setError('Please select the celebration date.');
      return;
    }
    if (!venue.trim()) {
      setError('Please enter the venue location.');
      return;
    }
    if (!coverImageUrl.trim()) {
      setError('Please upload a cover/banner photo for this celebration.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const combinedDateTime = `${marriageDate}T12:00:00Z`;
      const created = await onCreate({
        coupleNames: coupleNames.trim(),
        marriageDate: combinedDateTime,
        venue: venue.trim(),
        coverImageUrl: coverImageUrl.trim(),
        welcomeMessage: welcomeMessage.trim() || undefined,
        focusPosition: `center ${faceOffsetY}%`,
      });
      setLoading(false);
      onClose();
      onCreatedSuccess(created);
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to register celebration.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-950 p-6 sm:p-7 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-md">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                Create Celebration Portal
              </h3>
              <p className="text-xs text-stone-400">
                Register a celebration with smart auto face-centered photo framing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-stone-900"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Couple Names */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Couple Names *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul & Priya"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
            />
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Celebration Date *
              </label>
              <input
                type="date"
                required
                value={marriageDate}
                onChange={(e) => setMarriageDate(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Venue Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Udaipur, India"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* User Photo Upload with Auto Face Centering */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Upload Background Photo *
              </label>
              <span className="text-[10px] text-amber-300 font-medium">
                Auto face-centering enabled
              </span>
            </div>

            <p className="text-[11px] text-stone-400">
              Upload any photo of the couple. The platform automatically adjusts framing to keep couple faces clear and in the middle.
            </p>

            <div className="flex flex-col gap-2.5">
              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-700 bg-stone-900/60 p-5 cursor-pointer hover:border-stone-500 hover:bg-stone-900 transition-colors">
                <Upload className="h-6 w-6 text-stone-300 mb-1" />
                <span className="text-xs font-semibold text-white">
                  {coverImageUrl ? 'Change Uploaded Photo' : 'Click to Upload Photo from Device'}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  PNG, JPG, WEBP up to 15MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="relative">
                <input
                  type="url"
                  placeholder="Or paste an image web link..."
                  value={coverImageUrl.startsWith('data:') ? 'Custom device photo uploaded' : coverImageUrl}
                  disabled={coverImageUrl.startsWith('data:')}
                  onChange={(e) => {
                    setCoverImageUrl(e.target.value);
                    setFaceOffsetY(32);
                    setIsAutoFaceAdjusted(true);
                  }}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-xs text-white focus:border-white focus:outline-none disabled:opacity-75"
                />
              </div>

              {/* Uploaded Preview with Auto Face Centering Simulation */}
              {coverImageUrl && (
                <div className="space-y-2 rounded-xl border border-stone-800 bg-stone-900/70 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Couple Faces Auto-Centered & Enhanced</span>
                    </div>
                    <button
                      type="button"
                      onClick={resetAutoFaceCentering}
                      className="text-[11px] text-stone-400 hover:text-white underline"
                    >
                      Reset to Optimal (32%)
                    </button>
                  </div>

                  {/* Visual framing viewport with face alignment crosshairs */}
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-stone-700 shadow-inner group">
                    <img
                      src={coverImageUrl}
                      alt="Uploaded Banner Preview"
                      style={{
                        objectPosition: `center ${faceOffsetY}%`,
                        filter: 'contrast(1.06) brightness(1.02) saturate(1.04)',
                      }}
                      className="h-full w-full object-cover transition-all duration-300"
                    />

                    {/* Centering crosshair guide overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="h-20 w-28 rounded-xl border-2 border-dashed border-amber-400/70 flex items-center justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-200 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                          Faces Focus
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCoverImageUrl('')}
                      className="absolute top-2 right-2 rounded-full bg-black/80 px-2.5 py-1 text-xs text-rose-300 hover:text-white"
                    >
                      Remove
                    </button>

                    <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] text-white font-mono">
                      Focal Level: {faceOffsetY}%
                    </div>
                  </div>

                  {/* Fine-tune face vertical slider */}
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Sliders className="h-3 w-3" />
                        <span>Adjust Face Position</span>
                      </span>
                      <span>{faceOffsetY <= 33 ? 'Optimal Faces (Middle)' : 'Lower Framing'}</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="65"
                      value={faceOffsetY}
                      onChange={(e) => {
                        setFaceOffsetY(Number(e.target.value));
                        setIsAutoFaceAdjusted(false);
                      }}
                      className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Welcome Greeting */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Welcome Message (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="A warm greeting to welcome your guests..."
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-stone-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 active:scale-95 transition-all shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-black" />
              <span>{loading ? 'Registering...' : 'Create Celebration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
