import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  MessageSquareHeart,
  X,
  Send,
  Heart,
  Dices,
  Shuffle,
  BookmarkPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WishesGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCoupleNames?: string;
  onUseWish?: (wishText: string) => void;
}

interface PrewrittenWish {
  id: number;
  category:
    | 'Best Friend'
    | 'Sibling'
    | 'Parents & Elders'
    | 'Traditional Blessing'
    | 'Poetic & Romantic'
    | 'Playful & Joyful'
    | 'Short & Heartfelt';
  text: (names: string) => string;
}

// 50+ rich distinct wishes categorized according to their end
const WISHES_DATABASE: PrewrittenWish[] = [
  // 1. Best Friends & Soulmates (8 Wishes)
  {
    id: 1,
    category: 'Best Friend',
    text: (n) =>
      `To my absolute best friend and their soulmate: watching ${n} find true love has been one of the greatest joys of my life. May your home be forever full of laughter, late-night chats, and unconditional support!`,
  },
  {
    id: 2,
    category: 'Best Friend',
    text: (n) =>
      `Congratulations to the most legendary duo, ${n}! Thank you for setting the bar impossibly high for what true partnership looks like. Cheers to countless adventures ahead!`,
  },
  {
    id: 3,
    category: 'Best Friend',
    text: (n) =>
      `From surviving late-night college gossip to standing beside you today: I couldn't have picked a more wonderful match for you. Love you both to infinity and beyond, ${n}!`,
  },
  {
    id: 4,
    category: 'Best Friend',
    text: (n) =>
      `May your shared bond stay as unbreakable as our friendship, and may ${n} always find a million reasons to celebrate every little moment together!`,
  },
  {
    id: 5,
    category: 'Best Friend',
    text: (n) =>
      `You two fit together like morning coffee and Sunday silence. So proud and overjoyed to celebrate ${n} today!`,
  },
  {
    id: 6,
    category: 'Best Friend',
    text: (n) =>
      `Here is to the nights that turned into morning stories and the friendship that brought us to this dream wedding! Blessed union, ${n}!`,
  },
  {
    id: 7,
    category: 'Best Friend',
    text: (n) =>
      `I always knew you'd marry someone extraordinary, and today proved it! Wishing ${n} unending joy and endless laughter!`,
  },
  {
    id: 8,
    category: 'Best Friend',
    text: (n) =>
      `To my partner in crime: you found the one who matches your kind of crazy. Here's to a lifetime of happiness for ${n}!`,
  },

  // 2. Sibling & Cousins (8 Wishes)
  {
    id: 9,
    category: 'Sibling',
    text: (n) =>
      `To my beloved sibling and our wonderful new family member: seeing you so radiant brings tears of pure joy. May your marriage be blessed with deep warmth, infinite patience, and everlasting love, ${n}.`,
  },
  {
    id: 10,
    category: 'Sibling',
    text: (n) =>
      `Growing up together was a blessing, and welcoming your spouse into our family is an honor. Wishing ${n} a lifetime of shared dreams and sweet triumphs!`,
  },
  {
    id: 11,
    category: 'Sibling',
    text: (n) =>
      `I used to wonder who could ever tolerate your weird habits, and now I see they were born just for you! Heartiest congratulations to ${n}!`,
  },
  {
    id: 12,
    category: 'Sibling',
    text: (n) =>
      `My dearest sibling, may your marital life be even more beautiful than today’s ceremony. We will always be right behind you both, cheering you on!`,
  },
  {
    id: 13,
    category: 'Sibling',
    text: (n) =>
      `From sharing childhood toys to sharing vows of lifetime devotion: you have grown into someone so remarkable. We love you both so much, ${n}!`,
  },
  {
    id: 14,
    category: 'Sibling',
    text: (n) =>
      `Welcome to our chaotic and loving family! Take good care of my sibling, and know that you both have a lifelong cheerleader in me. Congratulations ${n}!`,
  },
  {
    id: 15,
    category: 'Sibling',
    text: (n) =>
      `Seeing my sibling find their forever home in your heart is the greatest gift of this year. Cheers to ${n}!`,
  },
  {
    id: 16,
    category: 'Sibling',
    text: (n) =>
      `May the laughter of our family dinner tables fill your new home with endless cheer, ${n}!`,
  },

  // 3. Parents & Elders (8 Wishes)
  {
    id: 17,
    category: 'Parents & Elders',
    text: (n) =>
      `With all our blessings and heartfelt prayers, we bless the sacred union of ${n}. May God shower you with health, peace, prosperity, and generation-spanning wisdom.`,
  },
  {
    id: 18,
    category: 'Parents & Elders',
    text: (n) =>
      `May the sacred vows you exchange today guide your steps through every season of life. May your household be a beacon of harmony and boundless warmth.`,
  },
  {
    id: 19,
    category: 'Parents & Elders',
    text: (n) =>
      `Seeing you take this holy step fills our hearts with pride. Love one another unconditionally, forgive freely, and treasure every single day together, ${n}.`,
  },
  {
    id: 20,
    category: 'Parents & Elders',
    text: (n) =>
      `Our warmest blessings for a long, healthy, and blissful married life. May peace and divine abundance reign in your home forever, ${n}.`,
  },
  {
    id: 21,
    category: 'Parents & Elders',
    text: (n) =>
      `A successful marriage requires falling in love many times, always with the same person. May the Almighty grant ${n} enduring tenderness.`,
  },
  {
    id: 22,
    category: 'Parents & Elders',
    text: (n) =>
      `May your union bring pride and happiness to both our ancestral families. Congratulations and deepest blessings to ${n}!`,
  },
  {
    id: 23,
    category: 'Parents & Elders',
    text: (n) =>
      `May the holy fire witness your steadfast commitment and bless your descendants with honor, health, and grace, ${n}.`,
  },
  {
    id: 24,
    category: 'Parents & Elders',
    text: (n) =>
      `Hold each other's hands tight during life's storms and dance together during its gentle breezes. All our love to ${n}.`,
  },

  // 4. Traditional Vedic Blessings (8 Wishes)
  {
    id: 25,
    category: 'Traditional Blessing',
    text: (n) =>
      `Sada Saubhagyavati Bhava. On this auspicious wedding ceremony, may the sacred fire and holy pheras bind ${n} in eternal devotion and spiritual harmony.`,
  },
  {
    id: 26,
    category: 'Traditional Blessing',
    text: (n) =>
      `May the divine grace illuminate your path together. Wishing ${n} unbroken companionship, righteous virtue (Dharma), and fruitful togetherness across all lifetimes.`,
  },
  {
    id: 27,
    category: 'Traditional Blessing',
    text: (n) =>
      `May the auspicious golden hue of the Haldi and the deep red of the Mehndi bring good fortune, prosperity, and joy into the sacred marriage of ${n}.`,
  },
  {
    id: 28,
    category: 'Traditional Blessing',
    text: (n) =>
      `May the sacred mantras chanted at the mandap invoke celestial blessings, long life, and eternal peace for ${n} and both families.`,
  },
  {
    id: 29,
    category: 'Traditional Blessing',
    text: (n) =>
      `May Lakshmi and Vishnu bless your home with prosperity, harmony, and righteousness in every step you take together, ${n}.`,
  },
  {
    id: 30,
    category: 'Traditional Blessing',
    text: (n) =>
      `Seven sacred steps, seven sacred promises, one eternal bond. Heartiest congratulations to ${n} on this divine union.`,
  },
  {
    id: 31,
    category: 'Traditional Blessing',
    text: (n) =>
      `May the fragrance of sandalwood and the sound of shehnai always echo in your marital journey, ${n}.`,
  },
  {
    id: 32,
    category: 'Traditional Blessing',
    text: (n) =>
      `Mangalam Bhagavan Vishnuh, Mangalam Garudadhvajah. Wishing ${n} an auspicious, virtuous, and divine matrimonial life.`,
  },

  // 5. Poetic & Romantic (8 Wishes)
  {
    id: 33,
    category: 'Poetic & Romantic',
    text: (n) =>
      `Like two rivers meeting at the ocean, may ${n} merge into a singular, breathtaking symphony of endless devotion and wonder.`,
  },
  {
    id: 34,
    category: 'Poetic & Romantic',
    text: (n) =>
      `In a fleeting world of rush and noise, your love is a quiet sanctuary. May ${n} always hold hands through sunsets and greet every sunrise with gratitude.`,
  },
  {
    id: 35,
    category: 'Poetic & Romantic',
    text: (n) =>
      `Yours is the kind of love poets spend lifetimes trying to capture in verses. Here is to the timeless masterpiece that ${n} are creating together.`,
  },
  {
    id: 36,
    category: 'Poetic & Romantic',
    text: (n) =>
      `May the starry sparkle in your eyes today remain undimmed across all the seasons to come. Cheers to eternity with ${n}!`,
  },
  {
    id: 37,
    category: 'Poetic & Romantic',
    text: (n) =>
      `True love is not just looking at each other, but looking outward in the same direction together. May ${n} always walk side by side.`,
  },
  {
    id: 38,
    category: 'Poetic & Romantic',
    text: (n) =>
      `When two souls are meant for each other, even the stars rearrange their courses to celebrate. All our love to ${n}!`,
  },
  {
    id: 39,
    category: 'Poetic & Romantic',
    text: (n) =>
      `May your love story be the warmest story ever told to your children and grandchildren. Beautiful beginnings for ${n}!`,
  },
  {
    id: 40,
    category: 'Poetic & Romantic',
    text: (n) =>
      `Today love found its truest home. Wishing ${n} a life bathed in golden sunshine and soft moonlit dreams.`,
  },

  // 6. Playful & Joyful (8 Wishes)
  {
    id: 41,
    category: 'Playful & Joyful',
    text: (n) =>
      `Huge congratulations to ${n}! Marriage is an alliance where one person is always right, and the other is the husband! Best of luck!`,
  },
  {
    id: 42,
    category: 'Playful & Joyful',
    text: (n) =>
      `Cheers to ${n}! May your love be modern, your compromises mutual, and your arguments resolved over late-night food deliveries!`,
  },
  {
    id: 43,
    category: 'Playful & Joyful',
    text: (n) =>
      `Congratulations on officially signing up to share your fries, blankets, and Netflix passwords for the rest of your life, ${n}!`,
  },
  {
    id: 44,
    category: 'Playful & Joyful',
    text: (n) =>
      `Remember the golden secret of marriage: When you are wrong, admit it immediately; when you are right, keep quiet! Celebrating ${n}!`,
  },
  {
    id: 45,
    category: 'Playful & Joyful',
    text: (n) =>
      `Marriage is all about finding that one person you want to annoy for the rest of your days. Congrats to ${n} on finding your match!`,
  },
  {
    id: 46,
    category: 'Playful & Joyful',
    text: (n) =>
      `I’m just here for the biryani and open dance floor, but seeing ${n} get hitched is a pretty awesome bonus! Congrats!`,
  },
  {
    id: 47,
    category: 'Playful & Joyful',
    text: (n) =>
      `Two become one... which means one person gets to steal the other's hoodie forever! Wishing ${n} endless cozy moments!`,
  },
  {
    id: 48,
    category: 'Playful & Joyful',
    text: (n) =>
      `May your wifi connection be strong and your patience with each other even stronger! Love to ${n}!`,
  },

  // 7. Short & Heartfelt (6 Wishes)
  {
    id: 49,
    category: 'Short & Heartfelt',
    text: (n) =>
      `Warmest congratulations to ${n}! Wishing you both a lifetime of happiness, health, and sweet togetherness.`,
  },
  {
    id: 50,
    category: 'Short & Heartfelt',
    text: (n) =>
      `Here's to love, laughter, and your happily ever after. Congratulations ${n}!`,
  },
  {
    id: 51,
    category: 'Short & Heartfelt',
    text: (n) =>
      `May today be the beginning of a lifetime filled with blessings and true companionship for ${n}.`,
  },
  {
    id: 52,
    category: 'Short & Heartfelt',
    text: (n) =>
      `Wishing the perfect couple, ${n}, a lifetime as beautiful as your wedding day!`,
  },
  {
    id: 53,
    category: 'Short & Heartfelt',
    text: (n) =>
      `Congratulations ${n}! May your journey ahead be blessed with pure happiness and peace.`,
  },
  {
    id: 54,
    category: 'Short & Heartfelt',
    text: (n) =>
      `To love, honor, and cherish: cheers to the wonderful union of ${n}!`,
  },
];

export const WishesGeneratorModal: React.FC<WishesGeneratorModalProps> = ({
  isOpen,
  onClose,
  activeCoupleNames = 'the happy couple',
  onUseWish,
}) => {
  const [coupleNames, setCoupleNames] = useState(activeCoupleNames);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [highlightedRandomWish, setHighlightedRandomWish] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Best Friend',
    'Sibling',
    'Parents & Elders',
    'Traditional Blessing',
    'Poetic & Romantic',
    'Playful & Joyful',
    'Short & Heartfelt',
  ];

  const filteredWishes = WISHES_DATABASE.filter(
    (w) => selectedCategory === 'All' || w.category === selectedCategory
  );

  const handleCopy = (text: string, id: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ffffff', '#3b82f6', '#93c5fd', '#fbbf24'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleInsert = (text: string) => {
    if (onUseWish) {
      onUseWish(text);
      onClose();
    }
  };

  // Generate a random wish for the couple
  const handleGenerateRandom = () => {
    const list = selectedCategory === 'All' ? WISHES_DATABASE : filteredWishes;
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const item = list[randomIndex];
    const generated = item.text(coupleNames.trim() || 'the happy couple');
    setHighlightedRandomWish(generated);

    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#ffffff', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-stone-800 bg-stone-950 p-6 text-white shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/20">
              <MessageSquareHeart className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  Ceremony Wishes Generator
                </h3>
                <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-300">
                  {WISHES_DATABASE.length}+ Wishes
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Personalized blessings across 7 relationship categories with instant random generator.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Couple Name Personalizer & Random Shuffle Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 shrink-0">
              Personalize for Couple:
            </span>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="e.g. Alexander & Sophia"
              className="flex-1 rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-2 text-xs text-white focus:border-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerateRandom}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Generate Random Wish</span>
          </button>
        </div>

        {/* Highlighted Randomly Generated Wish Box */}
        {highlightedRandomWish && (
          <div className="mt-3.5 rounded-xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-blue-500/10 p-4 relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Generated Wish for {coupleNames || 'the Couple'}</span>
              </span>
              <button
                onClick={() => setHighlightedRandomWish(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-white leading-relaxed">
              "{highlightedRandomWish}"
            </p>

            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
              {onUseWish && (
                <button
                  onClick={() => handleInsert(highlightedRandomWish)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-700 bg-stone-900 px-3 py-1 text-xs font-medium text-stone-200 hover:text-white"
                >
                  <Send className="h-3 w-3" />
                  <span>Insert into Guestbook</span>
                </button>
              )}

              <button
                onClick={() => handleCopy(highlightedRandomWish, 99999)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-black hover:bg-stone-200 shadow"
              >
                {copiedId === 99999 ? (
                  <>
                    <Check className="h-3 w-3 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Wish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-stone-800 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Wishes List */}
        <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {filteredWishes.map((item) => {
            const formattedText = item.text(coupleNames.trim() || 'the happy couple');
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-stone-800/80 bg-stone-900/60 p-4 transition-all hover:border-stone-600 hover:bg-stone-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    {item.category}
                  </span>
                </div>

                <p className="font-serif italic text-sm text-stone-200 leading-relaxed">
                  "{formattedText}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-stone-800/60">
                  {onUseWish && (
                    <button
                      onClick={() => handleInsert(formattedText)}
                      className="inline-flex items-center gap-1 rounded-full border border-stone-700 bg-stone-950 px-3 py-1 text-xs text-stone-300 hover:text-white hover:bg-stone-800"
                    >
                      <Send className="h-3 w-3" />
                      <span>Insert into Guestbook</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopy(formattedText, item.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-black hover:bg-stone-200 shadow"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-black" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Wish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
