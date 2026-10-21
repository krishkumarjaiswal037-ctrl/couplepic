import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Sparkles,
  Dices,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Users,
  Trophy,
  X,
  Flame,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  Sun,
  Sparkle,
  Music,
  Heart,
} from 'lucide-react';

export interface CeremonyGame {
  id: string;
  title: string;
  ceremony: 'Haldi' | 'Mehndi' | 'Sangeet & Cocktail' | 'Baraat Entry' | 'Varmala & Mandap' | 'Reception';
  categoryColor: string;
  accentGradient: string;
  borderAccent: string;
  players: string;
  duration: string;
  propsNeeded: string;
  energyVibe: string;
  shortDesc: string;
  rules: string[];
  hostTip: string;
}

export const CEREMONY_GAMES_30: CeremonyGame[] = [
  // 1. Haldi Games (6)
  {
    id: 'g-h1',
    title: 'Yellow Marigold Ring Hunt',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'Couple & Family Elders',
    duration: '10 - 15 mins',
    propsNeeded: 'Large brass or terracotta tub, turmeric water, 50 fresh marigolds, 1 silver coin',
    energyVibe: 'Playful Laughter & Traditional Blessings',
    shortDesc: 'A golden hunt where the couple dives into turmeric water filled with marigold petals to find the lucky coin.',
    rules: [
      'Fill a traditional brass tub with warm turmeric water and floating fresh yellow marigolds.',
      'Drop a silver rupee coin into the center without the couple looking.',
      'Both must submerge their hands at the same time on the count of three.',
      'Best of 3 rounds: whoever finds the coin twice wins the title of household boss!',
    ],
    hostTip: 'Have family members splash small droplets of rosewater each time someone almost grabs the coin!',
  },
  {
    id: 'g-h2',
    title: 'Turmeric Cheek Tag Battle',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'Bridesmaids vs Groomsmen',
    duration: '15 mins',
    propsNeeded: 'Safe organic herbal haldi paste, yellow cotton sashes',
    energyVibe: 'High Energy Chaos & Joy',
    shortDesc: 'Two teams attempt to tag opponents with yellow haldi fingerprints without getting tagged back.',
    rules: [
      'Each team selects 4 champions wearing yellow ceremony sashes.',
      'Players get one dab of haldi on both index fingers.',
      'Tagged players must freeze for 10 seconds while doing a Bollywood hook-step to unfreeze.',
      'The team with the cleanest clothes at the end of 5 minutes wins!',
    ],
    hostTip: 'Keep dhol beats playing non-stop in the background to pump up the frantic pacing.',
  },
  {
    id: 'g-h3',
    title: 'Spoon & Lemon Turmeric Relay',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'All Cousins & Siblings (8-16)',
    duration: '15 - 20 mins',
    propsNeeded: 'Wooden spoons, bright yellow lemons, start/finish flower markers',
    energyVibe: 'Nostalgic Childhood Fun',
    shortDesc: 'The classic balance race with an auspicious wedding twist where cousins race in pairs.',
    rules: [
      'Split into Team Bride and Team Groom with 4 racers per side.',
      'Each racer holds a wooden spoon with a yellow lemon clenched between teeth.',
      'Walk briskly around the marigold centerpiece and pass the lemon to the next cousin.',
      'If the lemon falls, that runner must dance 5 seconds of Bhangra before resuming.',
    ],
    hostTip: 'Award funny titles like "Most Dramatic Stumble" and "Unshakable Balancer".',
  },
  {
    id: 'g-h4',
    title: 'Haldi Tug of War (Rassi Kheench)',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'Full Families (10 vs 10)',
    duration: '10 mins',
    propsNeeded: 'Jute rope decorated with yellow ribbons, marigold center line',
    energyVibe: 'Friendly Family Rivalry & Cheering',
    shortDesc: 'A thrilling strength test between the bride and groom’s families to see who takes the crown.',
    rules: [
      'Mark the center boundary with crushed yellow marigold petals.',
      'Teams line up on either side of the decorated rope.',
      'The DJ triggers a massive dhol crescendo on start.',
      'First side to pull the ribbon 2 meters past the floral marker claims the round.',
    ],
    hostTip: 'The losing team has to serve sweets (ladoos) to the winners!',
  },
  {
    id: 'g-h5',
    title: 'Golden Glow Miniature Face Paint',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'Couple & Closest Friends',
    duration: '15 mins',
    propsNeeded: 'Cosmetic grade turmeric paste, fine paint brushes, hand mirrors',
    energyVibe: 'Artistic, Sweet & Cute Moments',
    shortDesc: 'The bride and groom paint cute traditional motifs (swastika, hearts, mustaches) on their partner’s cheeks.',
    rules: [
      'Each partner has 60 seconds with a fine brush and herbal haldi.',
      'Groom paints a motif representing their proposal; Bride paints a motif representing their future home.',
      'Audience votes by loudness of applause.',
    ],
    hostTip: 'Great opportunity for the wedding photographer to capture candid laughing portraits!',
  },
  {
    id: 'g-h6',
    title: 'Marigold Ring Toss for Blessings',
    ceremony: 'Haldi',
    categoryColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentGradient: 'from-amber-500/25 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400',
    players: 'Kids & Grandparents',
    duration: '15 mins',
    propsNeeded: 'Woven flower rings, 5 carved wooden pedestals with funny prize tags',
    energyVibe: 'Multi-Generational Bonding',
    shortDesc: 'Guests toss flower rings over designated gift bottles and blessing pedestals.',
    rules: [
      'Stand behind the yellow silk line (3 meters away).',
      'Each player receives 3 fragrant marigold rings.',
      'Ringing a pedestal wins the blessing token written beneath it (e.g. First Dance with Bride).',
    ],
    hostTip: 'Keep mini gift pouches with dried fruits ready for every participant.',
  },

  // 2. Mehndi Games (6)
  {
    id: 'g-m1',
    title: 'Find the Hidden Groom Name',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'Groom vs The Bride Tribe',
    duration: '10 mins',
    propsNeeded: 'Bride’s freshly finished bridal henna, magnifying glass for comedy, 60s countdown timer',
    energyVibe: 'Romantic Teasing & Suspense',
    shortDesc: 'The groom must find his letters concealed inside the bride’s intricate henna vines before the timer rings.',
    rules: [
      'The mehndi artist conceals the groom’s initials across palm and fingers.',
      'Groom gets 90 seconds to inspect without touching.',
      'If he fails, he must sing a romantic chorus to the bride or pay a fine to the bridesmaids!',
    ],
    hostTip: 'Have the bridesmaids distract the groom with fake clues and playful giggles.',
  },
  {
    id: 'g-m2',
    title: 'Henna Cone Pictionary',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'Teams of 4 (Bride Squad vs Groom Squad)',
    duration: '20 mins',
    propsNeeded: 'Large drawing boards, paper plates, chocolate/herb piping cones, wedding prompt cards',
    energyVibe: 'Hilarious Creative Guesses',
    shortDesc: 'Players pipe drawings of famous Bollywood wedding moments onto plates while their team guesses.',
    rules: [
      'One drawer per round gets a wedding secret card (e.g. "DDLJ train scene", "Sabyasachi Lehenga").',
      'They have 45 seconds to draw using only an icing/henna cone.',
      'No letters, numbers, or hand gestures allowed.',
      'First team to 5 correct guesses wins luxury sweet boxes.',
    ],
    hostTip: 'Choose funny ceremony-specific prompts that all relatives will recognize.',
  },
  {
    id: 'g-m3',
    title: 'Glass Bangles Tower Stacking',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'Women & Girls of all ages',
    duration: '15 mins',
    propsNeeded: '100 colorful glass bangles, velvet table mats, 60-second music timer',
    energyVibe: 'Gentle Precision & Suspense',
    shortDesc: 'Stack delicate glass bangles into the tallest freestanding tower without letting it crash.',
    rules: [
      'Each contestant gets a velvet mat and 25 glass bangles.',
      'Must build a vertical tower using only one hand.',
      'If the tower topples, you have to restart from zero.',
      'Tallest tower standing after 60 seconds wins a gift hamper.',
    ],
    hostTip: 'Play soft sitar or flute background music to test their zen composure!',
  },
  {
    id: 'g-m4',
    title: 'Mehndi Antakshari Faceoff',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'Whole Family Circles',
    duration: '25 mins',
    propsNeeded: 'Microphone, ceremony bell or dholak, letter spinner',
    energyVibe: 'Loud Group Singing & Memories',
    shortDesc: 'Traditional Indian singing competition where every song MUST feature wedding words like Mehndi, Banno, or Chooda.',
    rules: [
      'Team A sings a wedding verse; Team B must catch the ending syllable.',
      'Bonus 5 points if the lyrics mention Henna, Haldi, or the Couple’s names.',
      '10-second timer to start singing or forfeit the round.',
    ],
    hostTip: 'Have a grandma or aunt act as the strict referee with a wooden spoon!',
  },
  {
    id: 'g-m5',
    title: 'Scent of Henna & Spices Blind Guess',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'Groom & Groomsmen',
    duration: '10 mins',
    propsNeeded: 'Blindfolds, 6 ceramic bowls with eucalyptus oil, cloves, cardamom, rose water, henna, saffron',
    energyVibe: 'Sensory & Humorous',
    shortDesc: 'Blindfolded groomsmen test their culinary and herbal senses to guess iconic Indian wedding aromatics.',
    rules: [
      'Contestant is blindfolded securely.',
      'Host holds 5 scented bowls under their nose for 3 seconds each.',
      'Contestant must state the exact aroma name.',
      'Hilarious wrong answers guarantee roaring family laughs.',
    ],
    hostTip: 'Throw in an unexpected scent like coffee or mango pickle as a curveball.',
  },
  {
    id: 'g-m6',
    title: 'Bride Tribe Love Story Trivia',
    ceremony: 'Mehndi',
    categoryColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentGradient: 'from-emerald-500/25 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400',
    players: 'All Guests',
    duration: '15 mins',
    propsNeeded: 'Trivia paddle cards (Pink for Bride, Blue for Groom), host microphone',
    energyVibe: 'Intimate Storytelling & Revelations',
    shortDesc: 'A lighthearted quiz uncovering hilarious secrets from the couple’s dating journey.',
    rules: [
      'Host reads 10 true-or-false statements about the couple.',
      'Guests raise paddles to vote (e.g. "Who said I love you first?").',
      'The couple reveals the truth simultaneously for surprises and laughs.',
    ],
    hostTip: 'Ask the couple’s best friends beforehand to provide 3 verified funny insider facts.',
  },

  // 3. Sangeet & Cocktail Games (8)
  {
    id: 'g-s1',
    title: 'The Classic Couple Shoe Game',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'Bride & Groom on Center Stage',
    duration: '15 - 20 mins',
    propsNeeded: '2 chairs back-to-back, 1 shoe of bride and 1 shoe of groom for each partner',
    energyVibe: 'The Highlight of the Night',
    shortDesc: 'Sitting back-to-back, the couple raises shoes to answer reveal questions like "Who takes longer to get ready?".',
    rules: [
      'Couple sits back-to-back so they cannot see each other’s answers.',
      'Hold one of your own shoes in right hand, partner’s shoe in left hand.',
      'Host asks rapid-fire questions: "Who is the better driver?", "Who made the first move?".',
      'Raise the shoe of the person who fits best. Match score shows couple compatibility!',
    ],
    hostTip: 'Mix 70% funny lighthearted questions with 30% deeply sweet questions for emotional impact.',
  },
  {
    id: 'g-s2',
    title: 'Bollywood Hook-Step Roulette',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'Any willing guests (Dance Floor)',
    duration: '20 mins',
    propsNeeded: 'DJ sound system, spinning spotlight or randomized music tracklist',
    energyVibe: 'Electrifying Dance Floor Fire',
    shortDesc: 'The DJ plays 15-second song snippets, and contestants must execute the signature hook step instantly.',
    rules: [
      'Contestants form a large circle on the dance floor.',
      'DJ drops iconic tracks: Kala Chashma, Chaiyya Chaiyya, Tauba Tauba, Zingaat.',
      'Anyone who freezes or does the wrong step gets eliminated.',
      'Final 3 dancers win a VIP cocktail round and stage applause.',
    ],
    hostTip: 'Encourage uncles and aunties to jump in — their retro disco steps always steal the show!',
  },
  {
    id: 'g-s3',
    title: 'Groomsmen vs Bridesmaids Dance Battle',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'Bride Squad vs Groom Squad (5 vs 5)',
    duration: '15 mins',
    propsNeeded: 'High-energy DJ beat drops, scoreboard paddles 1-10 held by parents',
    energyVibe: 'Legendary Squad Energy',
    shortDesc: 'A choreographed 3-round street style vs Bollywood face-off where both sides trade dance moves.',
    rules: [
      'Round 1: 90s Retro Bollywood duel.',
      'Round 2: Punjabi Dhol & Bhangra madness.',
      'Round 3: Slow-motion dramatic couple rescue dance.',
      'Parents judge each round by raising scorecards.',
    ],
    hostTip: 'Both squads should unite for the final 60 seconds into a joint crowd performance.',
  },
  {
    id: 'g-s4',
    title: 'Paper Dance (Shrinking Island)',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: '6 to 10 Couples',
    duration: '15 mins',
    propsNeeded: 'Newspaper sheets or decorative floral paper squares, upbeat romantic songs',
    energyVibe: 'Cute, Creative & Romantic',
    shortDesc: 'Couples dance on a sheet of paper. Each round the paper is folded in half until only piggybacking works!',
    rules: [
      'Each couple starts on a full newspaper sheet.',
      'When the music plays, you must dance strictly on the paper.',
      'When music stops, both partners must remain on the paper without touching the floor.',
      'Fold paper in half each round. Partners can lift, carry, or balance on one foot!',
    ],
    hostTip: 'The final round always results in grooms carrying brides like superhero rescues!',
  },
  {
    id: 'g-s5',
    title: 'Musical Chairs with Prop Dares',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: '10 to 15 Guests',
    duration: '20 mins',
    propsNeeded: '10 chairs, funny props (sunglasses, feathered boas, fake moustaches), dare bowl',
    energyVibe: 'Uncontrollable Laughs',
    shortDesc: 'Standard musical chairs, but the player who misses a chair must draw a dare and wear a crazy prop.',
    rules: [
      'Chairs arranged in an outward facing circle.',
      'When music abruptly stops, scramble for a seat.',
      'The eliminated player must draw a dare (e.g. "Propose to the DJ", "Sing like an opera star").',
      'The last player standing claims the Grand Sangeet Trophy.',
    ],
    hostTip: 'Keep dares harmless, funny, and photogenic for great video clips.',
  },
  {
    id: 'g-s6',
    title: 'Rapid-Fire Couple Roast & Toast',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'Best Man, Maid of Honor & Couple',
    duration: '15 mins',
    propsNeeded: 'Cocktail glasses, 2 wireless microphones, buzzer sound effect',
    energyVibe: 'Warm Heartfelt Humor',
    shortDesc: 'A loving roast where closest friends share 2-minute comedic anecdotes followed by a champagne toast.',
    rules: [
      'Strict 2-minute time limit per speaker.',
      'Rules: 3 funny truths, 1 heartfelt blessing, 0 inappropriate secrets.',
      'If buzzer rings, the speaker must take a sip of their drink and wrap up.',
    ],
    hostTip: 'Ensure speakers know the boundaries so everyone, including grandparents, can enjoy the jokes.',
  },
  {
    id: 'g-s7',
    title: 'Guess the Love Song in 3 Seconds',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'All Table Groups',
    duration: '15 mins',
    propsNeeded: 'DJ setup with short 3-second song intros, table buzzers or bells',
    energyVibe: 'Competitive Music Nerds',
    shortDesc: 'DJ plays just 3 seconds of a legendary love track — first table to stand up and sing the chorus wins.',
    rules: [
      'Hear 3 seconds of instrumental audio.',
      'First team to ring their bell gets the chance.',
      'Must sing at least 2 full lines of the chorus to score.',
      '5 points per correct track, minus 2 for false rings.',
    ],
    hostTip: 'Include classics from Kishore Kumar, AR Rahman, and modern Arijit Singh anthems.',
  },
  {
    id: 'g-s8',
    title: 'Glowstick Limbo Dance Line',
    ceremony: 'Sangeet & Cocktail',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentGradient: 'from-purple-500/25 to-indigo-500/5',
    borderAccent: 'group-hover:border-purple-400',
    players: 'Entire Party / Late Night Crew',
    duration: '20 mins',
    propsNeeded: 'LED illuminated glow limbo stick, glow necklaces for all participants',
    energyVibe: 'Late Night High Energy Club Vibe',
    shortDesc: 'How low can wedding guests bend backwards under a glowing neon limbo stick?',
    rules: [
      'Contestants line up behind the bride and groom.',
      'Bend backwards under the bar without touching it or falling.',
      'Stick lowers 10 cm every round.',
      'Finalist who goes lowest without touching ground wins bragging rights!',
    ],
    hostTip: 'Dim the venue lights and fire up smoke machines for maximum visual effect.',
  },

  // 4. Baraat & Welcoming Games (5)
  {
    id: 'g-b1',
    title: 'Joota Chupai Negotiation Showdown',
    ceremony: 'Baraat Entry',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentGradient: 'from-blue-500/25 to-cyan-500/5',
    borderAccent: 'group-hover:border-blue-400',
    players: 'Sisters-in-Law vs Groom & Groomsmen',
    duration: '20 mins',
    propsNeeded: 'Groom’s ceremonial jootis/shoes, decorated velvet envelope, negotiation megaphone',
    energyVibe: 'Legendary Indian Wedding Tradition',
    shortDesc: 'Bridesmaids stealthily snatch the groom’s shoes during the mandap rituals and negotiate a royal ransom.',
    rules: [
      'Groom must remove shoes before stepping into the sacred mandap.',
      'Bridesmaids conceal them in an undisclosed location.',
      'When ceremonies finish, the groom cannot leave without shoes.',
      'High-stakes bargaining begins! Groomsmen counter-offer until an auspicious cash sum or gifts are agreed.',
    ],
    hostTip: 'Groomsmen should plant decoy shoes to fool the bridesmaids early on!',
  },
  {
    id: 'g-b2',
    title: 'Ribbon Cutting Toll & Family Riddles',
    ceremony: 'Baraat Entry',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentGradient: 'from-blue-500/25 to-cyan-500/5',
    borderAccent: 'group-hover:border-blue-400',
    players: 'Groom vs Bride’s Sisters at Entrance Door',
    duration: '10 - 15 mins',
    propsNeeded: 'Red silk ribbon, golden scissors, platter with sweets, 5 secret riddle cards',
    energyVibe: 'Grand Welcoming Gatekeeper Battle',
    shortDesc: 'Sisters guard the entrance gate with a silk ribbon until the groom proves his worth with wit and sweets.',
    rules: [
      'Ribbon stretched tightly across the main wedding palace entrance.',
      'Groom must answer 3 custom riddles about the bride (e.g. her favorite midnight snack).',
      'If he gets one wrong, he must perform 10 pushups in his sherwani or sing a love line.',
      'Cut ribbon and feed sweets to sisters to enter.',
    ],
    hostTip: 'Keep the banter witty and fast; have a cash shagun envelope ready in his pocket.',
  },
  {
    id: 'g-b3',
    title: 'Rose Petal Shower Basket Catch',
    ceremony: 'Baraat Entry',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentGradient: 'from-blue-500/25 to-cyan-500/5',
    borderAccent: 'group-hover:border-blue-400',
    players: 'Groomsmen Squad',
    duration: '10 mins',
    propsNeeded: 'Petal cannons, decorated wicker baskets, 1000 red & pink rose petals',
    energyVibe: 'Auspicious & Photogenic Rain',
    shortDesc: 'As petals are tossed during groom arrival, groomsmen catch them in wicker baskets.',
    rules: [
      'Groomsmen hold baskets balanced over their heads.',
      'During the floral entryway walk, bridal family showers petals from balconies.',
      'Most petals collected in 2 minutes wins the Blessing Basket Award.',
    ],
    hostTip: 'Slow-motion video of this looks breathtaking on wedding reels.',
  },
  {
    id: 'g-b4',
    title: 'Dhol Beats Freestyling Faceoff',
    ceremony: 'Baraat Entry',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentGradient: 'from-blue-500/25 to-cyan-500/5',
    borderAccent: 'group-hover:border-blue-400',
    players: 'Baraat Dhol Players & Groomsmen',
    duration: '15 mins',
    propsNeeded: 'Traditional Punjab / Nashik Dhols, brass sticks',
    energyVibe: 'Heart-Pounding Percussion',
    shortDesc: 'Two master dhol players trade increasingly fast rhythms while groomsmen match with bhangra jumps.',
    rules: [
      'Player A drops a complex 8-count beat; Player B must replicate and speed it up.',
      'Crowd forms a jumping circle, roaring approval for each bar.',
    ],
    hostTip: 'Give earplugs to infants nearby; the volume reaches peak celebration levels!',
  },
  {
    id: 'g-b5',
    title: 'Royal Turban (Safa) Tying Speed Race',
    ceremony: 'Baraat Entry',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentGradient: 'from-blue-500/25 to-cyan-500/5',
    borderAccent: 'group-hover:border-blue-400',
    players: 'Uncles vs Groomsmen in pairs',
    duration: '10 mins',
    propsNeeded: '5-meter raw silk safa cloths, brooch pins, feathers',
    energyVibe: 'Regal Elegance & Fun Competition',
    shortDesc: 'Pairs race to tie a flawless royal wedding turban within 90 seconds.',
    rules: [
      'One partner is the model, one is the safa artist.',
      'Wrap, fold, and crown the turban securely.',
      'Judged on symmetry, royal crest placement, and firmness (must survive a head nod!).',
    ],
    hostTip: 'Elder relatives make wonderful judges for authentic traditional pleating.',
  },

  // 5. Varmala & Mandap Rituals (5)
  {
    id: 'g-v1',
    title: 'The Varmala Height Lift Challenge',
    ceremony: 'Varmala & Mandap',
    categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentGradient: 'from-rose-500/25 to-pink-500/5',
    borderAccent: 'group-hover:border-rose-400',
    players: 'Couple lifted by Brothers & Cousins',
    duration: '10 mins',
    propsNeeded: 'Fragrant fresh rose and jasmine varmalas, confetti blasters',
    energyVibe: 'Triumphant Royal Climax',
    shortDesc: 'Brothers hoist both bride and groom onto their shoulders to see who can playfully dodge the garland first.',
    rules: [
      'Groom tries to place garland around bride’s neck; bride’s brothers lift her high out of reach.',
      'Groom’s squad lifts him higher in response.',
      'Whoever lands their garland first without dropping petals wins the playful upper hand in marriage.',
    ],
    hostTip: 'Sync confetti blasters and pyrotechnic cold sparks the second both garlands are placed!',
  },
  {
    id: 'g-v2',
    title: 'Kangna: Ring in the Milk Bowl',
    ceremony: 'Varmala & Mandap',
    categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentGradient: 'from-rose-500/25 to-pink-500/5',
    borderAccent: 'group-hover:border-rose-400',
    players: 'Bride & Groom post-pheras',
    duration: '15 mins',
    propsNeeded: 'Large silver bowl, whole milk mixed with rosewater, crimson rose petals, gold wedding ring',
    energyVibe: 'Cherished Ancient Tradition',
    shortDesc: 'A golden wedding band is tossed into an opaque bowl of rosewater and milk; first to fish it out 3 times rules the house.',
    rules: [
      'Bowl filled with opaque milky rosewater so the ring is invisible.',
      'Couple dips right hand only at the signal.',
      'Play 3 rounds: best 2 out of 3 determines who makes the major family decisions!',
    ],
    hostTip: 'Both families cheer passionately for their respective side; keep hand towels nearby.',
  },
  {
    id: 'g-v3',
    title: 'Untie the Sacred Gathbandhan Knot',
    ceremony: 'Varmala & Mandap',
    categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentGradient: 'from-rose-500/25 to-pink-500/5',
    borderAccent: 'group-hover:border-rose-400',
    players: 'Newlywed Couple',
    duration: '10 mins',
    propsNeeded: 'Sacred wedding sash with multi-layered knot tied by the groom’s sister',
    energyVibe: 'Gentle Intimacy & Teamwork',
    shortDesc: 'The couple must untie the intricate sacred wedding knot using only their left hands.',
    rules: [
      'Groom and bride can only use their non-dominant hand.',
      'Cannot use teeth, pins, or external help.',
      'Shows patience, teamwork, and how they solve complicated life puzzles together.',
    ],
    hostTip: 'The sister who tied the knot gets a special token gift when it is successfully opened.',
  },
  {
    id: 'g-v4',
    title: 'Seven Sacred Vows (Saptapadi) Quiz',
    ceremony: 'Varmala & Mandap',
    categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentGradient: 'from-rose-500/25 to-pink-500/5',
    borderAccent: 'group-hover:border-rose-400',
    players: 'Couple & Priest / Emcee',
    duration: '12 mins',
    propsNeeded: 'Microphone, 7 golden scroll cards, sacred fire mandap backdrop',
    energyVibe: 'Deeply Meaningful & Touching',
    shortDesc: 'A sweet modern interpretation where after traditional pheras, the couple recites one improvised humorous 8th vow.',
    rules: [
      'After completing the 7 sacred pheras around the agni (fire).',
      'Bride reveals an 8th vow (e.g. "I promise never to start the next episode without you").',
      'Groom responds with his own (e.g. "I promise to always untangle your jewelry").',
    ],
    hostTip: 'One of the most emotional and viral moments for family and guest videos.',
  },
  {
    id: 'g-v5',
    title: 'The Sacred Coin Counting Duel',
    ceremony: 'Varmala & Mandap',
    categoryColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentGradient: 'from-rose-500/25 to-pink-500/5',
    borderAccent: 'group-hover:border-rose-400',
    players: 'Bride vs Groom',
    duration: '10 mins',
    propsNeeded: 'Two silk pouches filled with 21 auspicious silver & brass coins',
    energyVibe: 'Concentration & Light Teasing',
    shortDesc: 'With hands behind their backs, the couple counts the exact number of coins by tactile touch alone.',
    rules: [
      'Each partner receives an identical pouch of mixed coins.',
      'Keep hands strictly behind your back.',
      'First to announce the exact tally correctly claims victory.',
    ],
    hostTip: 'Slip in a uniquely shaped coin (like an octagonal piece) to test their tactile memory!',
  },

  // 6. Reception & After-Party (6)
  {
    id: 'g-r1',
    title: 'Who Is Most Likely To...?',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'Couple on Stage & Guests via voting paddles',
    duration: '20 mins',
    propsNeeded: 'Printed paddle face cutouts of Bride and Groom for all banquet tables',
    energyVibe: 'Whole Ballroom Interactive Fun',
    shortDesc: 'A ballroom-wide game where all 200+ guests vote simultaneously on funny future life scenarios.',
    rules: [
      'Host reads scenarios: "Who is most likely to burn toast?", "Who will spoil the kids more?".',
      'All tables raise their Bride or Groom paddle at the count of three.',
      'Couple on stage reveals their own pick. Tables with the most matches win a bottle of wine!',
    ],
    hostTip: 'Show live audience paddle counts with roving camera shots.',
  },
  {
    id: 'g-r2',
    title: 'Blindfolded Hand Identification',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'Groom & 6 Mystery Participants (including Bride & Mother-in-law)',
    duration: '12 mins',
    propsNeeded: 'Opaque silk blindfold, 6 chairs in a straight line',
    energyVibe: 'High Stakes & Hilarious Tension',
    shortDesc: 'The blindfolded groom must feel only the hands of 6 lined-up individuals and correctly identify his new wife.',
    rules: [
      'Groom is blindfolded and spins around 3 times.',
      'Walks down the line gently touching only the wrists and fingers of each participant.',
      'Participants include the bride, bridesmaids, and hilariously a male cousin or his father!',
      'Groom must announce his final choice with absolute confidence.',
    ],
    hostTip: 'Swap the groom’s best friend into slot #4 for comedy gold when the groom holds his hand!',
  },
  {
    id: 'g-r3',
    title: 'The Couple Memory Timeline Puzzle',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'Each Dining Table (Team Challenge)',
    duration: '15 mins',
    propsNeeded: 'Envelope per table with 8 funny childhood & dating photos without dates',
    energyVibe: 'Engaging Table Icebreaker',
    shortDesc: 'Table guests collaborate to arrange 8 mystery photos of the couple in exact chronological order.',
    rules: [
      'Each table opens their sealed memory envelope on host command.',
      'Discuss and place photos 1 through 8 from earliest childhood to the proposal.',
      'Couple on stage reveals the true dates on the main screens.',
      'First table with 100% accuracy wins table champagne.',
    ],
    hostTip: 'Include funny awkward teenage school photos for maximum collective laughter.',
  },
  {
    id: 'g-r4',
    title: 'Pass the Auspicious Coconut (Hot Potato)',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'All Guests (30+)',
    duration: '15 mins',
    propsNeeded: 'Decorated golden coconut (Shagun Nariyal), energetic DJ music track',
    energyVibe: 'Rapid Speed & Sudden Shock',
    shortDesc: 'Pass a decorated golden coconut around the room. When the DJ stops the music, holder must execute a dare.',
    rules: [
      'Pass the golden coconut around circle rapidly.',
      'Cannot hold it for more than 1 second.',
      'When track halts abruptly, person holding coconut performs a mini karaoke line or gives 30-second speech.',
    ],
    hostTip: 'DJ should use sudden needle-scratch sound effects to catch people by surprise.',
  },
  {
    id: 'g-r5',
    title: 'The Best Man & Maid of Honor Lip Sync Duel',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'Best Man vs Maid of Honor',
    duration: '12 mins',
    propsNeeded: 'Props box (guitars, hats, boas, microphones), 90s party mashup',
    energyVibe: 'Theatrical Stage Performance',
    shortDesc: 'The two chief bridal party leads battle it out with exaggerated theatrical lip syncing to high-energy pop songs.',
    rules: [
      'Each contestant gets 90 seconds to lip sync a classic dance anthem.',
      'Judged on dramatic facial expressions, stage presence, and prop creativity.',
      'Couple on stage declares the winner with the golden microphone trophy.',
    ],
    hostTip: 'Secretly give them song choices 2 hours before the reception so they can plan simple choreography.',
  },
  {
    id: 'g-r6',
    title: 'Glow Train & Infinite DJ Finale',
    ceremony: 'Reception',
    categoryColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentGradient: 'from-cyan-500/25 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400',
    players: 'Everyone in Attendance',
    duration: '20 mins',
    propsNeeded: '500 neon glowsticks, LED batons, whistle for the train leader',
    energyVibe: 'Pure Euphoria & Joyous Celebration',
    shortDesc: 'The grand reception finale where the bride and groom lead an unstoppable 100-person glow-train through the ballroom.',
    rules: [
      'Every guest cracks and wears 3 neon glowsticks.',
      'Couple starts the engine train at the center stage.',
      'Weave between all dining tables collecting uncles, aunts, friends, and kids.',
      'Ends with a massive concentric circle surrounding the couple for the final song.',
    ],
    hostTip: 'Dim house lights 100% so the venue transforms into a sea of neon rings and lights.',
  },
];

interface CeremonyGameDeciderProps {
  onOpenCreate?: () => void;
  onOpenMusic?: () => void;
}

export const CeremonyGameDecider3D: React.FC<CeremonyGameDeciderProps> = ({
  onOpenCreate,
  onOpenMusic,
}) => {
  const [selectedCeremony, setSelectedCeremony] = useState<string>('All');
  const [selectedGameForModal, setSelectedGameForModal] = useState<CeremonyGame | null>(null);
  const [isDeciding, setIsDeciding] = useState(false);
  const [decidedGame, setDecidedGame] = useState<CeremonyGame | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const ceremonies = [
    'All',
    'Haldi',
    'Mehndi',
    'Sangeet & Cocktail',
    'Baraat Entry',
    'Varmala & Mandap',
    'Reception',
  ];

  const filteredGames = selectedCeremony === 'All'
    ? CEREMONY_GAMES_30
    : CEREMONY_GAMES_30.filter((g) => g.ceremony === selectedCeremony);

  // 3D Auto-sliding carousel interval
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollStep = 340;

        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = 340;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Interactive Game Decider Roller (Selects a random exciting game with celebration)
  const handleRollGameDecider = () => {
    if (isDeciding) return;
    setIsDeciding(true);
    setDecidedGame(null);

    let rollCount = 0;
    const maxRolls = 14;
    const pool = filteredGames.length > 0 ? filteredGames : CEREMONY_GAMES_30;

    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setDecidedGame(pool[randomIndex]);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        const finalPick = pool[Math.floor(Math.random() * pool.length)];
        setDecidedGame(finalPick);
        setIsDeciding(false);
        setSelectedGameForModal(finalPick);

        // Scroll into view if possible
        const targetElement = document.getElementById(`game-card-${finalPick.id}`);
        if (targetElement && carouselRef.current) {
          targetElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }, 110);
  };

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12">
      {/* Decider Section Header with 3D Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800/80 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-300 shadow-md">
            <Gamepad2 className="h-4 w-4 text-amber-400 animate-bounce" />
            <span className="uppercase tracking-widest">Interactive Ceremony Entertainment</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ceremony Games Decider
          </h2>
          <p className="mt-1 text-sm text-stone-400 max-w-2xl">
            Over <strong className="text-white font-semibold">{CEREMONY_GAMES_30.length}+ curated ritual games</strong> categorized across Haldi, Mehndi, Sangeet, Baraat, Varmala, and Reception. Pick your favorite or let the 3D Decider choose!
          </p>
        </div>

        {/* 3D Decider Roll Button & Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="p-2.5 rounded-full border border-stone-800 bg-stone-900 text-stone-300 hover:text-white hover:border-stone-600 transition-colors shadow-sm"
            title={isAutoPlay ? 'Pause 3D Auto-Slide' : 'Resume 3D Auto-Slide'}
          >
            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleRollGameDecider}
            disabled={isDeciding}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl ${
              isDeciding
                ? 'bg-amber-500 text-black animate-pulse'
                : 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-black hover:scale-105 active:scale-95 shadow-amber-500/20'
            }`}
          >
            <Dices className={`h-4 w-4 ${isDeciding ? 'animate-spin' : ''}`} />
            <span>{isDeciding ? 'Deciding Game...' : 'Roll Game Decider'}</span>
          </button>
        </div>
      </div>

      {/* Ceremony Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none mb-6">
        <div className="flex items-center gap-1.5 shrink-0">
          {ceremonies.map((ceremony) => {
            const count = ceremony === 'All'
              ? CEREMONY_GAMES_30.length
              : CEREMONY_GAMES_30.filter((g) => g.ceremony === ceremony).length;

            return (
              <button
                key={ceremony}
                onClick={() => setSelectedCeremony(ceremony)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCeremony === ceremony
                    ? 'bg-white text-black font-bold shadow-lg scale-105'
                    : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
                }`}
              >
                {ceremony} ({count})
              </button>
            );
          })}
        </div>

        {/* Manual Arrow Controls */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2">
          <button
            onClick={() => handleManualScroll('left')}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors shadow"
            title="Slide left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors shadow"
            title="Slide right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Auto-Sliding Cards Container */}
      <div
        ref={carouselRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory perspective-container"
        style={{ perspective: '1200px' }}
      >
        {filteredGames.map((game, idx) => {
          const isWinner = decidedGame?.id === game.id;

          return (
            <div
              key={game.id}
              id={`game-card-${game.id}`}
              onClick={() => setSelectedGameForModal(game)}
              className={`group shrink-0 w-[300px] sm:w-[330px] rounded-3xl border bg-stone-950/90 p-5 cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between snap-center shadow-xl backdrop-blur-md relative overflow-hidden ${
                isWinner
                  ? 'border-amber-400 ring-2 ring-amber-400/60 shadow-[0_15px_35px_rgba(251,191,36,0.3)] scale-[1.03] -translate-y-2'
                  : 'border-stone-800/80 hover:border-stone-500 hover:scale-[1.02] hover:-translate-y-1.5'
              }`}
              style={{
                transform: 'perspective(1000px) rotateY(-1deg)',
                boxShadow: isWinner
                  ? '0 20px 40px -10px rgba(251,191,36,0.35)'
                  : '0 15px 30px -10px rgba(0,0,0,0.8)',
              }}
            >
              {/* Top ambient color glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${game.accentGradient} opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Card Header & Ceremony Badge */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${game.categoryColor}`}>
                    {game.ceremony}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                    <Clock className="h-3 w-3 text-stone-500" />
                    <span>{game.duration}</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                  {game.title}
                </h3>

                <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed font-sans">
                  {game.shortDesc}
                </p>
              </div>

              {/* Card Meta details */}
              <div className="relative z-10 mt-5 pt-3 border-t border-stone-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-stone-500" />
                    <span className="truncate max-w-[170px]">{game.players}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                    #{idx + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-300 font-semibold truncate max-w-[190px]">
                    ✦ {game.energyVibe}
                  </span>

                  <span className="text-[11px] font-bold text-white underline group-hover:text-amber-200 transition-colors">
                    How to Play →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide indicator & tip */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>3D Auto-sliding active (hover to pause) · Showing {filteredGames.length} ceremony games</span>
        </div>
        <span className="hidden sm:inline">Click any game card to see full rules & host tips</span>
      </div>

      {/* GAME DETAIL & RULES 3D MODAL */}
      {selectedGameForModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGameForModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-7 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${selectedGameForModal.categoryColor}`}>
                    {selectedGameForModal.ceremony}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    ✦ {selectedGameForModal.energyVibe}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedGameForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedGameForModal(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Specs Pill Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Participants</span>
                  <span className="text-stone-200 font-semibold">{selectedGameForModal.players}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Duration</span>
                  <span className="text-stone-200 font-semibold">{selectedGameForModal.duration}</span>
                </div>
              </div>

              <div className="col-span-2 flex items-start gap-2 pt-1 border-t border-stone-800/80">
                <Trophy className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Props & Setup Needed</span>
                  <span className="text-stone-300">{selectedGameForModal.propsNeeded}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Rules */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Game Rules & How to Play:
              </h4>
              <div className="space-y-2">
                {selectedGameForModal.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emcee / Host Pro Tip */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Host / DJ Pro Tip:
              </span>
              <p className="leading-relaxed text-stone-300">
                {selectedGameForModal.hostTip}
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <button
                onClick={handleRollGameDecider}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Roll Another Game</span>
              </button>

              <button
                onClick={() => setSelectedGameForModal(null)}
                className="rounded-full bg-white px-6 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-stone-200 shadow-lg active:scale-95 transition-all"
              >
                Close & Play
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
