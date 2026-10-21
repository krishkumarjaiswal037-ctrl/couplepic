import React, { useState } from 'react';
import { MessageSquare, Heart, Sparkles, Send, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSavedGuestName, saveGuestName } from '../../lib/supabase';
import type { Wish } from '../../types/wedding';

interface WishesSectionProps {
  weddingId: string;
  wishes: Wish[];
  onAddWish: (wish: Omit<Wish, 'id' | 'createdAt' | 'heartCount'>) => Promise<void>;
  onLikeWish: (wishId: string) => Promise<void>;
  onDeleteWish: (wishId: string) => Promise<void>;
  isAdmin: boolean;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  weddingId,
  wishes,
  onAddWish,
  onLikeWish,
  onDeleteWish,
  isAdmin,
}) => {
  const [guestName, setGuestName] = useState(getSavedGuestName());
  const [guestRelation, setGuestRelation] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#ffffff', '#a1a1aa', '#71717a'],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      saveGuestName(guestName);
      await onAddWish({
        weddingId,
        guestName: guestName.trim(),
        guestRelation: guestRelation.trim() || undefined,
        message: message.trim(),
      });
      setMessage('');
      setSubmitting(false);
      triggerConfetti();
    } catch {
      setSubmitting(false);
    }
  };

  const handleHeartClick = (id: string) => {
    triggerConfetti();
    onLikeWish(id);
  };

  return (
    <section id="guestbook" className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-stone-800 pb-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Guest Blessings</span>
          </div>
          <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Guestbook & Wishes Board
          </h2>
          <p className="mt-1 text-sm text-stone-400">
            Leave your warmest congratulations, marital advice, and heartfelt prayers for the couple.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-300 font-medium bg-stone-900 border border-stone-800 px-3 py-1.5 rounded">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{wishes.length} Wishes Received</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Wish submission form */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-xl border border-stone-800 bg-stone-950 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-stone-900 border border-stone-700 text-white">
                <Send className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Write a Wish
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya or Arjun"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300">
                  Relation to Couple
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sister, Best Friend, Colleague"
                  value={guestRelation}
                  onChange={(e) => setGuestRelation(e.target.value)}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your blessing or warm congratulations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3.5 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded bg-white py-2.5 text-xs font-semibold uppercase tracking-wider text-black hover:bg-stone-200 shadow active:scale-95 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{submitting ? 'Posting...' : 'Post Blessing'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Wishes List */}
        <div className="lg:col-span-2">
          {wishes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-800 bg-stone-900/40 p-12 text-center text-stone-400">
              <p className="font-serif text-lg text-white">No wishes posted yet.</p>
              <p className="mt-1 text-xs">Be the very first guest to write a blessing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-950 p-5 shadow transition-all hover:border-stone-600"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 border border-stone-700 text-white font-serif font-bold text-sm">
                          {wish.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-white text-base">
                            {wish.guestName}
                          </h4>
                          {wish.guestRelation && (
                            <span className="text-[11px] text-stone-400">
                              {wish.guestRelation}
                            </span>
                          )}
                        </div>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => onDeleteWish(wish.id)}
                          className="text-stone-500 hover:text-red-400 transition-colors p-1"
                          title="Remove this wish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="font-serif italic text-sm text-stone-200 leading-relaxed pt-1">
                      "{wish.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-800 pt-3 mt-4 text-xs text-stone-400">
                    <span className="text-[11px]">
                      {new Date(wish.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    <button
                      onClick={() => handleHeartClick(wish.id)}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-stone-900 border border-stone-700 text-white hover:text-rose-400 active:scale-95 transition-all"
                      title="Heart this wish"
                    >
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      <span className="tabular-nums font-semibold text-xs">
                        {wish.heartCount}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
