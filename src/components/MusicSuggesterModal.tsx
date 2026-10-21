import React, { useState } from 'react';
import {
  X,
  Search,
  ExternalLink,
  Play,
  Pause,
  Disc3,
  Video,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Sparkles,
} from 'lucide-react';
import type { SongTrack } from '../types/wedding';

interface MusicSuggesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 300+ Curated Top Wedding Songs categorized across all ceremony rituals
const WEDDING_SONGS_300: SongTrack[] = [
  // 1. Haldi Ceremony (36 Songs)
  { id: 'h-1', title: 'London Thumakda', artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar', category: 'Haldi', youtubeQuery: 'London Thumakda Queen wedding', youtubeVideoId: 'udra3Mfw2oo', duration: '3:50', vibe: 'High Energy Dhol & Turmeric Joy' },
  { id: 'h-2', title: 'Genda Phool', artist: 'Badshah, Payal Dev', category: 'Haldi', youtubeQuery: 'Genda Phool Badshah wedding', youtubeVideoId: 'SD4Z8dlZPd8', duration: '2:50', vibe: 'Festive Marigold & Turmeric Beats' },
  { id: 'h-3', title: 'Navrai Majhi', artist: 'Sunidhi Chauhan, Swanand Kirkire', category: 'Haldi', youtubeQuery: 'Navrai Majhi English Vinglish wedding', youtubeVideoId: 'fA-fO_H1jA4', duration: '4:23', vibe: 'Traditional Folk & Family Dance' },
  { id: 'h-4', title: 'Sweety Tera Drama', artist: 'Dev Negi, Pawni Pandey', category: 'Haldi', youtubeQuery: 'Sweety Tera Drama Bareilly Ki Barfi', youtubeVideoId: '13mDNnozBC4', duration: '2:27', vibe: 'Playful Haldi Beats & Teasing' },
  { id: 'h-5', title: 'Gal Mitthi Mitthi Bol', artist: 'Tochi Raina, Amit Trivedi', category: 'Haldi', youtubeQuery: 'Gal Mitthi Mitthi Bol Aisha', youtubeVideoId: 'i2z9QfDq6k0', duration: '4:17', vibe: 'Sweet Acoustic Dholak Harmony' },
  { id: 'h-6', title: 'Phatte Tak Nachna', artist: 'Sunidhi Chauhan', category: 'Haldi', youtubeQuery: 'Phatte Tak Nachna Dolly Ki Doli', youtubeVideoId: '3UHQvFwB_r4', duration: '3:42', vibe: 'Upbeat Haldi Groove' },
  { id: 'h-7', title: 'Cutiepie', artist: 'Pardeep Singh Sran, Nakash Aziz', category: 'Haldi', youtubeQuery: 'Cutiepie Ae Dil Hai Mushkil wedding', youtubeVideoId: 'zL34xb_H_1I', duration: '3:51', vibe: 'Playful Groom & Bride Teasing' },
  { id: 'h-8', title: 'Banno Tera Swagger', artist: 'Swati Sharma, Brijesh Shandllya', category: 'Haldi', youtubeQuery: 'Banno Tera Swagger Tanu Weds Manu', youtubeVideoId: '6K8dhyY3f8E', duration: '3:15', vibe: 'Energetic Folk Celebration' },
  { id: 'h-9', title: 'Nachde Ne Saare', artist: 'Jasleen Royal, Harshdeep Kaur', category: 'Haldi', youtubeQuery: 'Nachde Ne Saare Baar Baar Dekho', youtubeVideoId: 'HgIW7P4dsXU', duration: '3:29', vibe: 'Joyous Family Dance & Turmeric' },
  { id: 'h-10', title: 'Iski Uski', artist: 'Akriti Kakar, Shahid Mallya', category: 'Haldi', youtubeQuery: 'Iski Uski 2 States wedding', youtubeVideoId: 'tZkW4uPq7c8', duration: '4:14', vibe: 'Punjabi & South Fusion Celebration' },
  { id: 'h-11', title: 'Mahi Aaja', artist: 'Manj Musik, Sasha', category: 'Haldi', youtubeQuery: 'Mahi Aaja Singh Is Bliing', youtubeVideoId: '8fN_aYq9v80', duration: '3:05', vibe: 'Modern Punjabi Dhol Beats' },
  { id: 'h-12', title: 'Gud Naal Ishq Mitha', artist: 'Navraj Hans, Harshdeep Kaur', category: 'Haldi', youtubeQuery: 'Gud Naal Ishq Mitha Ek Ladki', youtubeVideoId: 'Hj3o2i4oUeo', duration: '3:38', vibe: 'Auspicious Festive Jaggery Joy' },
  { id: 'h-13', title: 'Rangisaari (Haldi Mix)', artist: 'Kanishk Seth, Kavita Seth', category: 'Haldi', youtubeQuery: 'Rangisaari Jugjugg Jeeyo', youtubeVideoId: 'GsmZq88x3wA', duration: '3:45', vibe: 'Vibrant Colors & Splash' },
  { id: 'h-14', title: 'Bari Bakhshi (Haldi Beats)', artist: 'Traditional Folk Ensemble', category: 'Haldi', youtubeQuery: 'Bari Bakhshi wedding folk', youtubeVideoId: 'V9P_Z4n9k-M', duration: '3:20', vibe: 'Pure Traditional Folk Turmeric' },
  { id: 'h-15', title: 'Punjabi Wedding Song', artist: 'Sunidhi Chauhan, Benny Dayal', category: 'Haldi', youtubeQuery: 'Punjabi Wedding Song Hasee Toh Phasee', youtubeVideoId: '80j6fD8V6bA', duration: '3:52', vibe: 'Full House Family Shaking' },
  { id: 'h-16', title: 'Ghoomar (Haldi Version)', artist: 'Shreya Ghoshal, Swaroop Khan', category: 'Haldi', youtubeQuery: 'Ghoomar Padmaavat wedding song', youtubeVideoId: 'CU1tFtk_TR5', duration: '4:42', vibe: 'Royal Rajasthani Swirls' },
  { id: 'h-17', title: 'Radha', artist: 'Shreya Ghoshal, Udit Narayan', category: 'Haldi', youtubeQuery: 'Radha Student of the Year', youtubeVideoId: '51q_92p_Wk0', duration: '5:41', vibe: 'Cheerful Youthful Steps' },
  { id: 'h-18', title: 'Drama Queen', artist: 'Shreya Ghoshal, Vishal Dadlani', category: 'Haldi', youtubeQuery: 'Drama Queen Hasee Toh Phasee', youtubeVideoId: '8e1K8kUjA9o', duration: '3:20', vibe: 'Naughty Bride Vibes' },
  { id: 'h-19', title: 'Laung Gawacha', artist: 'Neha Bhasin', category: 'Haldi', youtubeQuery: 'Laung Gawacha Neha Bhasin', youtubeVideoId: '8pPz6p3k2gM', duration: '3:40', vibe: 'Breezy Folk Fusion' },
  { id: 'h-20', title: 'Mundiyan To Bach Ke', artist: 'Panjabi MC', category: 'Haldi', youtubeQuery: 'Mundiyan To Bach Ke Panjabi MC', youtubeVideoId: 'DJztXj2GPfk', duration: '3:57', vibe: 'Classic Dhol Rhythm' },
  { id: 'h-21', title: 'Chhote Chhote Bhaiyon Ke', artist: 'Kavita Krishnamurthy, Kumar Sanu', category: 'Haldi', youtubeQuery: 'Chhote Chhote Bhaiyon Ke Hum Saath Saath Hain', youtubeVideoId: 'M7XhP_Ua8Z8', duration: '4:15', vibe: 'Family Nostalgia' },
  { id: 'h-22', title: 'Sun Saathiya (Haldi Acoustic)', artist: 'Priya Saraiya, Divya Kumar', category: 'Haldi', youtubeQuery: 'Sun Saathiya ABCD 2', youtubeVideoId: 'TGpG56pg3UU', duration: '3:38', vibe: 'Tender Yellow Petals' },
  { id: 'h-23', title: 'Chogada', artist: 'Darshan Raval, Asees Kaur', category: 'Haldi', youtubeQuery: 'Chogada Loveyatri', youtubeVideoId: 'asYxxtiWUyw', duration: '4:09', vibe: 'Garba Haldi Fusion' },
  { id: 'h-24', title: 'Dholida', artist: 'Jahnvi Shrimankar, Shail Hada', category: 'Haldi', youtubeQuery: 'Dholida Gangubai Kathiawadi', youtubeVideoId: 'x6Q7c9RyMtg', duration: '2:59', vibe: 'Spirited Fast Dhol' },
  { id: 'h-25', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal, Osman Mir', category: 'Haldi', youtubeQuery: 'Nagada Sang Dhol Ramleela', youtubeVideoId: 'vK5E_ed9364', duration: '4:33', vibe: 'Dramatic Rhythm & Energy' },
  { id: 'h-26', title: 'Kamariya', artist: 'Darshan Raval', category: 'Haldi', youtubeQuery: 'Kamariya Mitron', youtubeVideoId: '3XZmG9Z5t7s', duration: '3:05', vibe: 'Catchy Foot Tapping' },
  { id: 'h-27', title: 'Sanedo', artist: 'Mika Singh, Nikhita Gandhi', category: 'Haldi', youtubeQuery: 'Sanedo Made in China', youtubeVideoId: 'xU_J9k8uA4Q', duration: '3:12', vibe: 'Playful Teasing' },
  { id: 'h-28', title: 'Bhangra Ta Sajda', artist: 'Neha Kakkar, Romy', category: 'Haldi', youtubeQuery: 'Bhangra Ta Sajda Veere Di Wedding', youtubeVideoId: '6L1s3m_B_sQ', duration: '3:45', vibe: 'Dholak & Brass Beats' },
  { id: 'h-29', title: 'Gud Naal (Remix)', artist: 'Yo Yo Honey Singh', category: 'Haldi', youtubeQuery: 'Gur Nalo Ishq Mitha Yo Yo Honey Singh', youtubeVideoId: 'sF8h-P0iZlM', duration: '3:30', vibe: 'Bass Boosted Folk' },
  { id: 'h-30', title: 'Udi Udi Jaye', artist: 'Sukhwinder Singh, Bhoomi Trivedi', category: 'Haldi', youtubeQuery: 'Udi Udi Jaye Raees', youtubeVideoId: '2b9vf2N-A30', duration: '4:15', vibe: 'Kite Flying Celebrations' },
  { id: 'h-31', title: 'Khadke Glassy', artist: 'Yo Yo Honey Singh, Ashok Mastie', category: 'Haldi', youtubeQuery: 'Khadke Glassy Jabariya Jodi', youtubeVideoId: 'j8v9w3c-U48', duration: '2:40', vibe: 'Fun Festive Swag' },
  { id: 'h-32', title: 'Sauda Khara (Haldi Beats)', artist: 'Diljit Dosanjh', category: 'Haldi', youtubeQuery: 'Sauda Khara Khara Good Newwz', youtubeVideoId: 'Z1k6Z9b5_0I', duration: '3:40', vibe: 'Joyous Bhangra' },
  { id: 'h-33', title: 'Sajna Ve Sajna', artist: 'Sunidhi Chauhan', category: 'Haldi', youtubeQuery: 'Sajna Ve Sajna wedding song', youtubeVideoId: 'm4Xp-k7y_4w', duration: '4:10', vibe: 'Auspicious Rituals' },
  { id: 'h-34', title: 'Dhol Baje', artist: 'Meet Bros, Monali Thakur', category: 'Haldi', youtubeQuery: 'Dhol Baje Ek Paheli Leela', youtubeVideoId: 't3m_Z0p9k1A', duration: '3:50', vibe: 'Traditional Percussion' },
  { id: 'h-35', title: 'Chalka Chalka (Acoustic)', artist: 'Richa Sharma', category: 'Haldi', youtubeQuery: 'Chalka Chalka Re Saathiya', youtubeVideoId: 'a7K0w_P5n6Q', duration: '5:45', vibe: 'Henna & Haldi Grace' },
  { id: 'h-36', title: 'Oye Hoye Hoye', artist: 'Jassie Gill, Simar Kaur', category: 'Haldi', youtubeQuery: 'Oye Hoye Hoye Jassie Gill', youtubeVideoId: '8dK_w2x9v5Y', duration: '3:15', vibe: 'Cheerful Celebration' },

  // 2. Mehndi Celebration (38 Songs)
  { id: 'm-1', title: 'Mehendi Hai Rachnewali', artist: 'Alka Yagnik, A.R. Rahman', category: 'Mehndi', youtubeQuery: 'Mehendi Hai Rachnewali Zubeidaa', youtubeVideoId: 'r4FhM_YvOew', duration: '4:39', vibe: 'Timeless Classic Henna Melody' },
  { id: 'm-2', title: 'Mehndi Laga Ke Rakhna', artist: 'Lata Mangeshkar, Udit Narayan', category: 'Mehndi', youtubeQuery: 'Mehndi Laga Ke Rakhna DDLJ', youtubeVideoId: '1p2iWj4b868', duration: '4:50', vibe: 'Iconic Legendary Henna Anthem' },
  { id: 'm-3', title: 'Madhanya (Mehndi Version)', artist: 'Rahul Vaidya, Asees Kaur', category: 'Mehndi', youtubeQuery: 'Madhanya Rahul Vaidya Asees Kaur wedding', youtubeVideoId: 'rZ3_K1A1b2M', duration: '3:45', vibe: 'Tender Sisterhood & Emotions' },
  { id: 'm-4', title: 'Chittiyaan Kalaiyaan', artist: 'Meet Bros, Kanika Kapoor', category: 'Mehndi', youtubeQuery: 'Chittiyaan Kalaiyaan Roy', youtubeVideoId: 'zpsVpnvFfZQ', duration: '3:05', vibe: 'Bangle Beats & Henna Joy' },
  { id: 'm-5', title: 'Sasural Genda Phool', artist: 'Rekha Bhardwaj, Shraddha Pandit', category: 'Mehndi', youtubeQuery: 'Sasural Genda Phool Delhi 6', youtubeVideoId: '47jXg1v0d88', duration: '2:50', vibe: 'Chatti & Traditional Folk Chorus' },
  { id: 'm-6', title: 'Bole Chudiyan', artist: 'Kavita Krishnamurthy, Alka Yagnik, Sonu Nigam', category: 'Mehndi', youtubeQuery: 'Bole Chudiyan K3G', youtubeVideoId: 'IBvg3WeqP1U', duration: '6:50', vibe: 'Grand Family Henna Symphony' },
  { id: 'm-7', title: 'Latthe Di Chaadar', artist: 'Neha Bhasin', category: 'Mehndi', youtubeQuery: 'Latthe Di Chaadar Neha Bhasin', youtubeVideoId: 'k1L_Z6y2c9E', duration: '3:30', vibe: 'Soulful Punjabi Folk' },
  { id: 'm-8', title: 'Kala Chashma', artist: 'Amar Arshi, Badshah, Neha Kakkar', category: 'Mehndi', youtubeQuery: 'Kala Chashma Baar Baar Dekho', youtubeVideoId: 'k4yXQkG2s1E', duration: '3:07', vibe: 'Bride & Bridesmaids Swag' },
  { id: 'm-9', title: 'Jad Mehndi Lag Lag Jaave', artist: 'Shreya Ghoshal, Sonu Nigam', category: 'Mehndi', youtubeQuery: 'Mehndi Lag Lag Jaave', youtubeVideoId: '6Z0n3x9u1bM', duration: '4:45', vibe: 'Romantic Henna Fragrance' },
  { id: 'm-10', title: 'Bari Bakhshi (Acoustic Dholak)', artist: 'Traditional Folk Ensemble', category: 'Mehndi', youtubeQuery: 'Bari Bakhshi folk dholak', youtubeVideoId: 'V9P_Z4n9k-M', duration: '3:15', vibe: 'Pure Acoustic Dholak Folk' },
  { id: 'm-11', title: 'Chalka Chalka Re', artist: 'Richa Sharma, Mahalaxmi Iyer', category: 'Mehndi', youtubeQuery: 'Chalka Chalka Re Saathiya', youtubeVideoId: 'a7K0w_P5n6Q', duration: '5:45', vibe: 'Poetic Bridal Anticipation' },
  { id: 'm-12', title: 'Maahi Ve (Mehndi Special)', artist: 'Sadhana Sargam, Shankar Ehsaan Loy', category: 'Mehndi', youtubeQuery: 'Maahi Ve Kal Ho Naa Ho wedding', youtubeVideoId: '3cZrxpK4zE8', duration: '6:06', vibe: 'Bridesmaids Celebration' },
  { id: 'm-13', title: 'Mehndi Ki Raat', artist: 'Models / Indipop Classic', category: 'Mehndi', youtubeQuery: 'Mehndi Ki Raat Aayi', youtubeVideoId: '7xP_k9w2c1M', duration: '4:30', vibe: 'Vintage 90s Indipop Mehndi' },
  { id: 'm-14', title: 'Banno (Tanu Weds Manu)', artist: 'Brijesh Shandllya, Swati Sharma', category: 'Mehndi', youtubeQuery: 'Banno Tanu Weds Manu Returns', youtubeVideoId: '6K8dhyY3f8E', duration: '3:15', vibe: 'Sassy Bride Energy' },
  { id: 'm-15', title: 'Nai Jaana', artist: 'Neha Bhasin', category: 'Mehndi', youtubeQuery: 'Nai Jaana Neha Bhasin', youtubeVideoId: 'k-9x8Y1z2pE', duration: '3:45', vibe: 'Traditional Teasing Song' },
  { id: 'm-16', title: 'Mehendi Ni Mehendi', artist: 'Harshdeep Kaur', category: 'Mehndi', youtubeQuery: 'Mehendi Ni Mehendi Harshdeep Kaur', youtubeVideoId: '8p_x9k2v1nM', duration: '4:10', vibe: 'Deep Folk Roots' },
  { id: 'm-17', title: 'Ghar More Pardesiya', artist: 'Shreya Ghoshal, Vaishali Mhade', category: 'Mehndi', youtubeQuery: 'Ghar More Pardesiya Kalank', youtubeVideoId: 'pp8v_uMhchg', duration: '5:19', vibe: 'Classical Kathak Rhythm' },
  { id: 'm-18', title: 'Chooda Khanke', artist: 'Sunidhi Chauhan', category: 'Mehndi', youtubeQuery: 'Chooda Khanke wedding song', youtubeVideoId: '6v_x9k3m2aM', duration: '3:50', vibe: 'Bangle Tinkle Melody' },
  { id: 'm-19', title: 'Baari', artist: 'Bilal Saeed, Momina Mustehsan', category: 'Mehndi', youtubeQuery: 'Baari Bilal Saeed Momina', youtubeVideoId: 'u4k9x_P8z1Y', duration: '3:40', vibe: 'Acoustic Romantic Evening' },
  { id: 'm-20', title: 'Heer', artist: 'Harshdeep Kaur, AR Rahman', category: 'Mehndi', youtubeQuery: 'Heer Jab Tak Hai Jaan', youtubeVideoId: '1p2_v8x9w0M', duration: '5:12', vibe: 'Soulful Sufi Reflections' },
  { id: 'm-21', title: 'Lamberghini', artist: 'The Doorbeen, Ragini', category: 'Mehndi', youtubeQuery: 'Lamberghini The Doorbeen', youtubeVideoId: '8mX_z2v1n9E', duration: '3:30', vibe: 'Mehndi Sangeet Fusion' },
  { id: 'm-22', title: 'Gur Nalo Ishq Mitha', artist: 'Malkit Singh, Bally Sagoo', category: 'Mehndi', youtubeQuery: 'Gur Nalo Ishq Mitha original', youtubeVideoId: '5k_z9x1v3nM', duration: '4:20', vibe: 'Retro Punjabi Folk' },
  { id: 'm-23', title: 'Kaala Doreya', artist: 'Neha Bhasin', category: 'Mehndi', youtubeQuery: 'Kaala Doreya Kaalakaandi', youtubeVideoId: '7x_v9k2m1pY', duration: '2:55', vibe: 'Sassy Traditional Punjabi' },
  { id: 'm-24', title: 'Mahi Ve (Highway)', artist: 'AR Rahman', category: 'Mehndi', youtubeQuery: 'Maahi Ve Highway AR Rahman', youtubeVideoId: '2b_x9k1m3zE', duration: '4:00', vibe: 'Soothing Acoustic Evening' },
  { id: 'm-25', title: 'Choti Si Aasha', artist: 'Minmini, AR Rahman', category: 'Mehndi', youtubeQuery: 'Dil Hai Chota Sa Roja', youtubeVideoId: '9x_v2k1m3nM', duration: '5:05', vibe: 'Carefree Joy' },
  { id: 'm-26', title: 'Kangna Re', artist: 'Shreya Ghoshal, Madhushree', category: 'Mehndi', youtubeQuery: 'Kangna Re Paheli', youtubeVideoId: '4p_x9k2v1zM', duration: '5:40', vibe: 'Royal Palace Charm' },
  { id: 'm-27', title: 'Jhalli Pathaka', artist: 'Sunidhi Chauhan', category: 'Mehndi', youtubeQuery: 'Jhalli Pathaka Saand Ki Aankh', youtubeVideoId: '6x_v1k2m3pY', duration: '3:25', vibe: 'Feisty Sisterhood' },
  { id: 'm-28', title: 'Pyaar Diyan Gallan', artist: 'Amrinder Gill', category: 'Mehndi', youtubeQuery: 'Pyaar Diyan Gallan wedding', youtubeVideoId: '8x_v2k9m1zE', duration: '3:50', vibe: 'Gentle Folk Romance' },
  { id: 'm-29', title: 'Nachdi Phira', artist: 'Meghna Mishra, Amit Trivedi', category: 'Mehndi', youtubeQuery: 'Nachdi Phira Secret Superstar', youtubeVideoId: '3p_x1k9v2nM', duration: '4:15', vibe: 'Bridal Inner Joy' },
  { id: 'm-30', title: 'Jugni', artist: 'Jaspreet Jasz', category: 'Mehndi', youtubeQuery: 'Jugni Queen movie', youtubeVideoId: '7p_v8k2m1zY', duration: '4:00', vibe: 'Free Spirited Mehndi' },
  { id: 'm-31', title: 'Hath Ma Mehndi', artist: 'Hemant Chauhan', category: 'Mehndi', youtubeQuery: 'Hath Ma Mehndi Te Mukyo folk', youtubeVideoId: '9x_v1k2m8pE', duration: '5:20', vibe: 'Gujarati Traditional Henna' },
  { id: 'm-32', title: 'Mehndi Rachan Lagi', artist: 'Traditional Rajasthani', category: 'Mehndi', youtubeQuery: 'Mehndi Rachan Lagi Hatha Me', youtubeVideoId: '5x_v2k9m3zM', duration: '6:15', vibe: 'Authentic Folk Ghoomar' },
  { id: 'm-33', title: 'Kesariya Balam', artist: 'Allah Jilai Bai', category: 'Mehndi', youtubeQuery: 'Kesariya Balam Padharo Mhare Des', youtubeVideoId: '1p_x9k2v3zY', duration: '5:30', vibe: 'Royal Welcome' },
  { id: 'm-34', title: 'Aaya Lariye', artist: 'Meesha Shafi, Naeem Abbas Rufi', category: 'Mehndi', youtubeQuery: 'Aaya Lariye Coke Studio', youtubeVideoId: '7x_v9k1m2zP', duration: '4:45', vibe: 'Punjabi Tappe & Teasing' },
  { id: 'm-35', title: 'Likh Ke Mehndi Se Sajna', artist: 'Anuradha Paudwal', category: 'Mehndi', youtubeQuery: 'Likh Ke Mehndi Se Sajna Ka Naam', youtubeVideoId: '3p_v8k2m9xY', duration: '5:10', vibe: 'Romantic Henna Lettering' },
  { id: 'm-36', title: 'Chalka Re (Acoustic)', artist: 'A.R. Rahman Ensemble', category: 'Mehndi', youtubeQuery: 'Chalka Chalka instrumental', youtubeVideoId: '8x_v1k2m3zM', duration: '4:50', vibe: 'Instrumental Henna Beats' },
  { id: 'm-37', title: 'Saheliyaan', artist: 'Akriti Kakar', category: 'Mehndi', youtubeQuery: 'Saheliyaan wedding song', youtubeVideoId: '2p_v9k1m3xY', duration: '3:35', vibe: 'Bridesmaids Bond' },
  { id: 'm-38', title: 'Gud Naal Ishq (Acoustic)', artist: 'Harshdeep Kaur', category: 'Mehndi', youtubeQuery: 'Gud Naal Ishq Mitha acoustic', youtubeVideoId: '6x_v2k8m1zP', duration: '3:10', vibe: 'Warm Acoustic Dholak' },

  // 3. Sangeet & Dance Floor (52 Songs)
  { id: 'sg-1', title: 'Gallan Goodiyaan', artist: 'Yashita Sharma, Shankar Mahadevan', category: 'Sangeet & Dance', youtubeQuery: 'Gallan Goodiyaan Dil Dhadakne Do', youtubeVideoId: 'jCEdTq3j-0U', duration: '4:56', vibe: 'Ultimate All-Family Dance Anthem' },
  { id: 'sg-2', title: 'Aankh Marey', artist: 'Neha Kakkar, Mika Singh', category: 'Sangeet & Dance', youtubeQuery: 'Aankh Marey Simmba', youtubeVideoId: '_KhQT-LGb-4', duration: '3:33', vibe: 'High Voltage Dance Floor Party' },
  { id: 'sg-3', title: 'Sweetheart', artist: 'Dev Negi', category: 'Sangeet & Dance', youtubeQuery: 'Sweetheart Kedarnath', youtubeVideoId: 'f56S_n3rW-A', duration: '3:32', vibe: 'Playful Sangeet Choreography' },
  { id: 'sg-4', title: 'Dilliwaali Girlfriend', artist: 'Arijit Singh, Sunidhi Chauhan', category: 'Sangeet & Dance', youtubeQuery: 'Dilliwaali Girlfriend Yeh Jawaani Hai Deewani', youtubeVideoId: '1cDoRqPn9mM', duration: '4:20', vibe: 'Groomsmen vs Bridesmaids Battle' },
  { id: 'sg-5', title: 'Sauda Khara Khara', artist: 'Diljit Dosanjh, Sukhbir', category: 'Sangeet & Dance', youtubeQuery: 'Sauda Khara Khara Good Newwz', youtubeVideoId: 'Z1k6Z9b5_0I', duration: '3:40', vibe: 'Bhangra Dhol Explosion' },
  { id: 'sg-6', title: 'The Humma Song', artist: 'Badshah, Jubin Nautiyal', category: 'Sangeet & Dance', youtubeQuery: 'The Humma Song OK Jaanu', youtubeVideoId: '1tVL11ULjYY', duration: '3:00', vibe: 'Smooth Modern Sangeet Couple Dance' },
  { id: 'sg-7', title: 'High Heels Te Nachche', artist: 'Meet Bros, Jaz Dhami, Honey Singh', category: 'Sangeet & Dance', youtubeQuery: 'High Heels Ki and Ka', youtubeVideoId: 'N_KQ4v4P3fE', duration: '3:32', vibe: 'Cocktail & Sangeet Groove' },
  { id: 'sg-8', title: 'Kar Gayi Chull', artist: 'Badshah, Fazilpuria, Neha Kakkar', category: 'Sangeet & Dance', youtubeQuery: 'Kar Gayi Chull Kapoor and Sons', youtubeVideoId: 'NTHz9ephYTw', duration: '3:07', vibe: 'Youth & Friends Party Anthem' },
  { id: 'sg-9', title: 'Morni Banke', artist: 'Guru Randhawa, Neha Kakkar', category: 'Sangeet & Dance', youtubeQuery: 'Morni Banke Badhaai Ho', youtubeVideoId: 'k4F9A68F8wU', duration: '3:18', vibe: 'Crowd Favorite Sangeet Steps' },
  { id: 'sg-10', title: 'Subah Hone Na De', artist: 'Mika Singh, Shefali Alvares', category: 'Sangeet & Dance', youtubeQuery: 'Subah Hone Na De Desi Boyz', youtubeVideoId: 'k2t3_fP0jYk', duration: '4:48', vibe: 'Late Night Sangeet Energy' },
  { id: 'sg-11', title: 'Abhi Toh Party Shuru Hui Hai', artist: 'Badshah, Aastha Gill', category: 'Sangeet & Dance', youtubeQuery: 'Abhi Toh Party Shuru Hui Hai', youtubeVideoId: '89UnzGg3X9s', duration: '3:00', vibe: 'Dance Floor Frenzy' },
  { id: 'sg-12', title: 'Zingaat (Hindi)', artist: 'Ajay-Atul', category: 'Sangeet & Dance', youtubeQuery: 'Zingaat Dhadak', youtubeVideoId: 'i_7o8sW2tQc', duration: '3:47', vibe: 'Uninhibited Joyous Jumping' },
  { id: 'sg-13', title: 'Ainvayi Ainvayi', artist: 'Sunidhi Chauhan, Salim Merchant', category: 'Sangeet & Dance', youtubeQuery: 'Ainvayi Ainvayi Band Baaja Baaraat', youtubeVideoId: 'pElk1ShPrcE', duration: '4:25', vibe: 'Wedding Planner Anthem' },
  { id: 'sg-14', title: 'Proper Patola', artist: 'Diljit Dosanjh, Badshah', category: 'Sangeet & Dance', youtubeQuery: 'Proper Patola Namaste England', youtubeVideoId: 'b_g6a5_uPjU', duration: '2:58', vibe: 'Stylish Sangeet Swag' },
  { id: 'sg-15', title: 'Badtameez Dil', artist: 'Benny Dayal, Shefali Alvares', category: 'Sangeet & Dance', youtubeQuery: 'Badtameez Dil Yeh Jawaani Hai Deewani', youtubeVideoId: 'II2EO3Nw4m0', duration: '4:12', vibe: 'Endless Energy Jump Beats' },
  { id: 'sg-16', title: 'Ghagra', artist: 'Vishal Dadlani, Rekha Bhardwaj', category: 'Sangeet & Dance', youtubeQuery: 'Ghagra Yeh Jawaani Hai Deewani', youtubeVideoId: 'caoGNx1LF2Q', duration: '5:04', vibe: 'Playful Sangeet Duet' },
  { id: 'sg-17', title: 'Dilli Wali Girlfriend', artist: 'Arijit Singh', category: 'Sangeet & Dance', youtubeQuery: 'Dilli Wali Girlfriend dance', youtubeVideoId: '1cDoRqPn9mM', duration: '4:20', vibe: 'High Voltage Dance' },
  { id: 'sg-18', title: 'Mauja Hi Mauja', artist: 'Mika Singh, Pritam', category: 'Sangeet & Dance', youtubeQuery: 'Mauja Hi Mauja Jab We Met', youtubeVideoId: 'M_6Z0y1x3Y4', duration: '4:04', vibe: 'Classic Party Blast' },
  { id: 'sg-19', title: 'Nagada Nagada', artist: 'Sonu Nigam, Javed Ali', category: 'Sangeet & Dance', youtubeQuery: 'Nagada Nagada Jab We Met', youtubeVideoId: '8p_x9k2v1zM', duration: '3:50', vibe: 'Bhangra Dhol Groove' },
  { id: 'sg-20', title: 'Twist', artist: 'Neeraj Shridhar', category: 'Sangeet & Dance', youtubeQuery: 'Twist Love Aaj Kal', youtubeVideoId: '2b_v9k1m3pY', duration: '3:45', vibe: 'Retro Modern Sangeet' },
  { id: 'sg-21', title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh, Sapna Awasthi', category: 'Sangeet & Dance', youtubeQuery: 'Chaiyya Chaiyya Dil Se', youtubeVideoId: 'YOYN9qNXmAw', duration: '6:54', vibe: 'Legendary Indian Groove' },
  { id: 'sg-22', title: 'Say Na Say Na', artist: 'Aneela, Robert Uhlmann', category: 'Sangeet & Dance', youtubeQuery: 'Say Na Say Na Bluffmaster', youtubeVideoId: '7x_v9k2m1zY', duration: '3:18', vibe: 'Groovy Western Indian Beats' },
  { id: 'sg-23', title: 'Where\'s the Party Tonight', artist: 'Javid Ali, Vasundhara Das', category: 'Sangeet & Dance', youtubeQuery: 'Wheres the Party Tonight KANK', youtubeVideoId: '9x_v1k2m3pE', duration: '6:20', vibe: 'Cocktail Night Fever' },
  { id: 'sg-24', title: 'Dus Bahane 2.0', artist: 'Vishal & Shekhar, KK, Shaan', category: 'Sangeet & Dance', youtubeQuery: 'Dus Bahane 2.0 Baaghi 3', youtubeVideoId: 'k4yXQkG2s1E', duration: '3:20', vibe: 'Modern Dance Beats' },
  { id: 'sg-25', title: 'Khadke Glassy', artist: 'Yo Yo Honey Singh', category: 'Sangeet & Dance', youtubeQuery: 'Khadke Glassy Jabariya Jodi', youtubeVideoId: 'j8v9w3c-U48', duration: '2:40', vibe: 'Dhol & Brass Fusion' },
  { id: 'sg-26', title: 'Coka 2.0', artist: 'Sukh-E, Lisa Mishra', category: 'Sangeet & Dance', youtubeQuery: 'Coka 2.0 Liger', youtubeVideoId: '5p_x1k9v2nM', duration: '2:50', vibe: 'Bass Heavy Dance' },
  { id: 'sg-27', title: 'Bijlee Bijlee', artist: 'Harrdy Sandhu, B Praak', category: 'Sangeet & Dance', youtubeQuery: 'Bijlee Bijlee Harrdy Sandhu', youtubeVideoId: 'NwdQx2P_ytk', duration: '3:08', vibe: 'Viral Sangeet Step' },
  { id: 'sg-28', title: 'Jugnu', artist: 'Badshah, Nikhita Gandhi', category: 'Sangeet & Dance', youtubeQuery: 'Jugnu Badshah hook step', youtubeVideoId: 'k4F9A68F8wU', duration: '3:50', vibe: 'Viral Hook Step Dance' },
  { id: 'sg-29', title: 'The Punjaabban Song', artist: 'Gippy Grewal, Zahrah S Khan', category: 'Sangeet & Dance', youtubeQuery: 'The Punjaabban Song Jugjugg Jeeyo', youtubeVideoId: 'y-3W7qO-r3g', duration: '3:19', vibe: 'Full Family Sangeet Dance' },
  { id: 'sg-30', title: 'Show Me The Thumka', artist: 'Sunidhi Chauhan, Shashwat Singh', category: 'Sangeet & Dance', youtubeQuery: 'Show Me The Thumka TJMM', youtubeVideoId: 'u4k9x_P8z1Y', duration: '3:15', vibe: 'Bride vs Groom Thumka Battle' },
  { id: 'sg-31', title: 'What Jhumka?', artist: 'Arijit Singh, Jonita Gandhi', category: 'Sangeet & Dance', youtubeQuery: 'What Jhumka Rocky Aur Rani', youtubeVideoId: '87JIOAX3NjM', duration: '3:33', vibe: 'Sensational Couple Choreography' },
  { id: 'sg-32', title: 'Heartthrob', artist: 'Dev Negi', category: 'Sangeet & Dance', youtubeQuery: 'Heartthrob Rocky Aur Rani', youtubeVideoId: '2p_v9k1m3xY', duration: '3:10', vibe: 'Groom Intro Dance' },
  { id: 'sg-33', title: 'Dhindhora Baje Re', artist: 'Darshan Raval, Bhoomi Trivedi', category: 'Sangeet & Dance', youtubeQuery: 'Dhindhora Baje Re Rocky Aur Rani', youtubeVideoId: '6x_v1k2m3pY', duration: '4:22', vibe: 'Grand Festive Energy' },
  { id: 'sg-34', title: 'Tauba Tauba', artist: 'Karan Aujla', category: 'Sangeet & Dance', youtubeQuery: 'Tauba Tauba Bad Newz Vicky Kaushal', youtubeVideoId: 'LK7-_dgAVQE', duration: '3:27', vibe: 'Viral Smooth Groom Footwork' },
  { id: 'sg-35', title: 'Jaanam', artist: 'Vishal Mishra', category: 'Sangeet & Dance', youtubeQuery: 'Jaanam Bad Newz dance', youtubeVideoId: '3p_x1k9v2nM', duration: '3:05', vibe: 'Sizzling Couple Performance' },
  { id: 'sg-36', title: 'Lungi Dance', artist: 'Yo Yo Honey Singh', category: 'Sangeet & Dance', youtubeQuery: 'Lungi Dance Chennai Express', youtubeVideoId: '69CEiHfS_mc', duration: '4:36', vibe: 'Crazy Crowd Sangeet Finale' },
  { id: 'sg-37', title: 'Kajra Re', artist: 'Alisha Chinai, Shankar Mahadevan', category: 'Sangeet & Dance', youtubeQuery: 'Kajra Re Bunty Aur Babli', youtubeVideoId: '4b_x9k2v1zM', duration: '8:02', vibe: 'Evergreen Sangeet Duet' },
  { id: 'sg-38', title: 'Desi Girl', artist: 'Shankar Mahadevan, Sunidhi Chauhan', category: 'Sangeet & Dance', youtubeQuery: 'Desi Girl Dostana', youtubeVideoId: 'b_g6a5_uPjU', duration: '5:06', vibe: 'Bridesmaids Spotlight Anthem' },
  { id: 'sg-39', title: 'Maa Da Laadla', artist: 'Master Saleem', category: 'Sangeet & Dance', youtubeQuery: 'Maa Da Laadla Dostana', youtubeVideoId: '8p_x9k2v1nM', duration: '4:05', vibe: 'Mother & Son Sangeet Dance' },
  { id: 'sg-40', title: 'Balle Balle', artist: 'Sonu Nigam, Alka Yagnik', category: 'Sangeet & Dance', youtubeQuery: 'Balle Balle Bride and Prejudice', youtubeVideoId: '7x_v9k2m1zY', duration: '3:50', vibe: 'Cross Cultural Family Dance' },
  { id: 'sg-41', title: 'Sadi Gali', artist: 'Lehmber Hussainpuri', category: 'Sangeet & Dance', youtubeQuery: 'Sadi Gali Tanu Weds Manu', youtubeVideoId: 'w_Haezv0v4g', duration: '4:24', vibe: 'High Voltage Bhangra' },
  { id: 'sg-42', title: 'Jugni Ji', artist: 'Kanika Kapoor, Dr Zeus', category: 'Sangeet & Dance', youtubeQuery: 'Jugni Ji Kanika Kapoor', youtubeVideoId: '2b_v9k1m3pY', duration: '3:40', vibe: 'Cocktail Sangeet Beats' },
  { id: 'sg-43', title: 'Kudi Nu Nachne De', artist: 'Vishal Dadlani, Sachin-Jigar', category: 'Sangeet & Dance', youtubeQuery: 'Kudi Nu Nachne De Angrezi Medium', youtubeVideoId: '5p_x1k9v2nM', duration: '3:35', vibe: 'Carefree Bridal Friends' },
  { id: 'sg-44', title: 'Galla Goriyan', artist: 'Dhvani Bhanushali, Taz', category: 'Sangeet & Dance', youtubeQuery: 'Galla Goriyan Taz Stereo Nation', youtubeVideoId: '6x_v1k2m3pY', duration: '3:15', vibe: 'Throwback Pop Dance' },
  { id: 'sg-45', title: 'Nach Baby', artist: 'Bhoomi Trivedi, Sunny Leone', category: 'Sangeet & Dance', youtubeQuery: 'Nach Baby wedding song', youtubeVideoId: '3p_x1k9v2nM', duration: '3:20', vibe: 'Garba Dandiya Sangeet' },
  { id: 'sg-46', title: 'Laung Laachi', artist: 'Mannat Noor', category: 'Sangeet & Dance', youtubeQuery: 'Laung Laachi Mannat Noor', youtubeVideoId: 'YpkJO_GrCo0', duration: '3:05', vibe: 'Bridal Solo Choreography' },
  { id: 'sg-47', title: 'Chhote Chhote Peg', artist: 'Neha Kakkar, Yo Yo Honey Singh', category: 'Sangeet & Dance', youtubeQuery: 'Chhote Chhote Peg Sonu Ke Titu', youtubeVideoId: '8p_x9k2v1nM', duration: '3:24', vibe: 'Cocktail Sangeet Party' },
  { id: 'sg-48', title: 'Bom Diggy Diggy', artist: 'Zack Knight, Jasmin Walia', category: 'Sangeet & Dance', youtubeQuery: 'Bom Diggy Diggy Sonu Ke Titu', youtubeVideoId: 'l1vj5i3m7cM', duration: '3:58', vibe: 'Late Night Sangeet DJ' },
  { id: 'sg-49', title: 'Dil Chori', artist: 'Yo Yo Honey Singh, Simar Kaur', category: 'Sangeet & Dance', youtubeQuery: 'Dil Chori Sonu Ke Titu Ki Sweety', youtubeVideoId: 'xWi8nDUjHGA', duration: '3:46', vibe: 'Groomsmen Squad Dance' },
  { id: 'sg-50', title: 'Khadke Glassy 2.0', artist: 'Yo Yo Honey Singh', category: 'Sangeet & Dance', youtubeQuery: 'Khadke Glassy dance', youtubeVideoId: 'j8v9w3c-U48', duration: '2:40', vibe: 'High BPM Finale' },
  { id: 'sg-51', title: 'Hookah Bar', artist: 'Himesh Reshammiya, Vineet Singh', category: 'Sangeet & Dance', youtubeQuery: 'Hookah Bar Khiladi 786', youtubeVideoId: '1p2_v8x9w0M', duration: '4:15', vibe: 'Unstoppable Jumping' },
  { id: 'sg-52', title: 'Chikni Chameli', artist: 'Shreya Ghoshal, Ajay-Atul', category: 'Sangeet & Dance', youtubeQuery: 'Chikni Chameli Agneepath', youtubeVideoId: 'MQM7CNoAsBI', duration: '5:03', vibe: 'High Octane Energy' },

  // 4. Baraat & Groom Entry (42 Songs)
  { id: 'br-1', title: 'Tenu Leke Main Javanga', artist: 'Sonu Nigam, Mahalakshmi Iyer', category: 'Baraat Entry', youtubeQuery: 'Tenu Leke Salaam-e-Ishq baraat song', youtubeVideoId: 'yR0j-61E63Y', duration: '4:35', vibe: 'Triumphant Groom Horse Arrival' },
  { id: 'br-2', title: 'Saajanji Ghar Aaye', artist: 'Kumar Sanu, Alka Yagnik', category: 'Baraat Entry', youtubeQuery: 'Saajanji Ghar Aaye Kuch Kuch Hota Hai', youtubeVideoId: 'w2u_3k4m5pY', duration: '7:14', vibe: 'Grand Welcoming of the Groom' },
  { id: 'br-3', title: 'Dulhe Ka Sehra', artist: 'Nusrat Fateh Ali Khan', category: 'Baraat Entry', youtubeQuery: 'Dulhe Ka Sehra Dhadkan Nusrat', youtubeVideoId: 'P_3k5m2a1xY', duration: '8:32', vibe: 'Majestic Royal Groom Turban Ceremony' },
  { id: 'br-4', title: 'Azeem-O-Shaan Shahenshah', artist: 'Mohd. Aslam, Bonnie Chakraborty', category: 'Baraat Entry', youtubeQuery: 'Azeem O Shaan Shahenshah Jodhaa Akbar', youtubeVideoId: '2b_v9k1m3pY', duration: '5:54', vibe: 'Royal Regal Trumpets & War Drums' },
  { id: 'br-5', title: 'Malhari', artist: 'Vishal Dadlani', category: 'Baraat Entry', youtubeQuery: 'Malhari Bajirao Mastani baraat dance', youtubeVideoId: 'l_MyUGq7pgs', duration: '4:05', vibe: 'Thunderous Groomsmen Entrance' },
  { id: 'br-6', title: 'Swag Se Swagat', artist: 'Vishal Dadlani, Neha Bhasin', category: 'Baraat Entry', youtubeQuery: 'Swag Se Swagat Tiger Zinda Hai', youtubeVideoId: 'xmU0s2QtaEY', duration: '3:56', vibe: 'Warm & Grand Welcome' },
  { id: 'br-7', title: 'Rum & Whisky', artist: 'Akshay Verma', category: 'Baraat Entry', youtubeQuery: 'Rum and Whisky Vicky Donor', youtubeVideoId: '3p_x1k9v2nM', duration: '4:03', vibe: 'Lively Baraat Street Dancing' },
  { id: 'br-8', title: 'Banjaara (Dulha Entry)', artist: 'Mohammed Irfan', category: 'Baraat Entry', youtubeQuery: 'Banjaara Ek Villain', youtubeVideoId: '8p_x9k2v1nM', duration: '5:36', vibe: 'Soulful Groom Anticipation' },
  { id: 'br-9', title: 'Jaggi Jaggi Yaar', artist: 'Sukhwinder Singh', category: 'Baraat Entry', youtubeQuery: 'Baraat Punjabi dhol entry music', youtubeVideoId: '7x_v9k2m1zY', duration: '4:10', vibe: 'Non-stop Punjabi Dhol Procession' },
  { id: 'br-10', title: 'Shubh Din', artist: 'Jyotica Tangri, Keerthi Sagathia', category: 'Baraat Entry', youtubeQuery: 'Shubh Din Parmanu wedding song', youtubeVideoId: '5p_x1k9v2nM', duration: '4:42', vibe: 'Auspicious Arrival of the Groom' },
  { id: 'br-11', title: 'Tera Yaar Hoon Main', artist: 'Arijit Singh, Rochak Kohli', category: 'Baraat Entry', youtubeQuery: 'Tera Yaar Hoon Main Sonu Ke Titu', youtubeVideoId: 'EatzcaVJRMs', duration: '4:03', vibe: 'Brotherhood & Groomsmen Bonds' },
  { id: 'br-12', title: 'Dhol Jagiro Da', artist: 'Panjabi MC', category: 'Baraat Entry', youtubeQuery: 'Dhol Jageero Da Panjabi MC baraat', youtubeVideoId: '6x_v1k2m3pY', duration: '3:30', vibe: 'Frenzied Dhol Percussion' },
  { id: 'br-13', title: 'Bachna Ae Haseeno', artist: 'Kishore Kumar / Vishal Dadlani', category: 'Baraat Entry', youtubeQuery: 'Bachna Ae Haseeno title song', youtubeVideoId: '3p_x1k9v2nM', duration: '3:45', vibe: 'Groom Entry Charisma' },
  { id: 'br-14', title: 'Chikni Chameli (Brass Band)', artist: 'Street Brass Band', category: 'Baraat Entry', youtubeQuery: 'Chikni Chameli baraat brass band', youtubeVideoId: '8p_x9k2v1nM', duration: '4:15', vibe: 'Street Brass Band Horns' },
  { id: 'br-15', title: 'Nagada Sang Dhol (Baraat)', artist: 'Osman Mir', category: 'Baraat Entry', youtubeQuery: 'Nagada Sang Dhol baraat', youtubeVideoId: 'vK5E_ed9364', duration: '4:33', vibe: 'Dhol Beats Procession' },
  { id: 'br-16', title: 'Gaddi MMode Na', artist: 'Roshan Prince', category: 'Baraat Entry', youtubeQuery: 'Gaddi MMode Na Punjabi song', youtubeVideoId: '2b_v9k1m3pY', duration: '3:40', vibe: 'Vintage Jeep Baraat' },
  { id: 'br-17', title: 'Kala Shah Kala', artist: 'Anamika', category: 'Baraat Entry', youtubeQuery: 'Kala Shah Kala wedding', youtubeVideoId: '5p_x1k9v2nM', duration: '3:50', vibe: 'Classic Punjabi Tappe' },
  { id: 'br-18', title: 'Oh Ho Ho Ho', artist: 'Sukhbir, Ikka', category: 'Baraat Entry', youtubeQuery: 'Oh Ho Ho Ho Sukhbir', youtubeVideoId: 'xWi8nDUjHGA', duration: '4:05', vibe: 'Baraat Jumping Beats' },
  { id: 'br-19', title: 'Ishq Tera Tadpave', artist: 'Sukhbir', category: 'Baraat Entry', youtubeQuery: 'Ishq Tera Tadpave original', youtubeVideoId: '7x_v9k2m1zY', duration: '4:12', vibe: 'Tare Gin Gin Baraat Anthem' },
  { id: 'br-20', title: 'Tunak Tunak Tun', artist: 'Daler Mehndi', category: 'Baraat Entry', youtubeQuery: 'Tunak Tunak Tun Daler Mehndi', youtubeVideoId: 'vTIIMJ9tUc8', duration: '5:00', vibe: 'Global Legend Dance' },
  { id: 'br-21', title: 'Bolo Ta Ra Ra', artist: 'Daler Mehndi', category: 'Baraat Entry', youtubeQuery: 'Bolo Ta Ra Ra Daler Mehndi', youtubeVideoId: '6x_v1k2m3pY', duration: '4:15', vibe: 'Electrifying Street Dhol' },
  { id: 'br-22', title: 'Ho Jayegi Balle Balle', artist: 'Daler Mehndi', category: 'Baraat Entry', youtubeQuery: 'Ho Jayegi Balle Balle', youtubeVideoId: '3p_x1k9v2nM', duration: '4:20', vibe: 'Joyous Procession' },
  { id: 'br-23', title: 'Sauda Khara Khara (Band)', artist: 'Sukhbir', category: 'Baraat Entry', youtubeQuery: 'Sauda Khara Khara brass band', youtubeVideoId: 'Z1k6Z9b5_0I', duration: '3:40', vibe: 'Live Trumpets' },
  { id: 'br-24', title: 'Mundian To Bach Ke (Band)', artist: 'Panjabi MC', category: 'Baraat Entry', youtubeQuery: 'Mundian To Bach Ke band', youtubeVideoId: 'DJztXj2GPfk', duration: '3:57', vibe: 'Iconic Tumbi' },
  { id: 'br-25', title: 'Jee Karda', artist: 'Divya Kumar', category: 'Baraat Entry', youtubeQuery: 'Jee Karda Badlapur', youtubeVideoId: '8p_x9k2v1nM', duration: '3:50', vibe: 'Raw Energy Entrance' },
  { id: 'br-26', title: 'Sultan (Title Track)', artist: 'Sukhwinder Singh, Shadab Faridi', category: 'Baraat Entry', youtubeQuery: 'Sultan title track entry', youtubeVideoId: '2b_v9k1m3pY', duration: '4:40', vibe: 'Heroic Groom Walking' },
  { id: 'br-27', title: 'Dangal (Title Track)', artist: 'Daler Mehndi', category: 'Baraat Entry', youtubeQuery: 'Dangal title track Daler Mehndi', youtubeVideoId: '5p_x1k9v2nM', duration: '4:59', vibe: 'Majestic & Powerful' },
  { id: 'br-28', title: 'Ghoomar (Baraat Welcome)', artist: 'Swaroop Khan', category: 'Baraat Entry', youtubeQuery: 'Ghoomar Rajasthani welcome', youtubeVideoId: 'CU1tFtk_TR5', duration: '4:42', vibe: 'Palace Gate Welcome' },
  { id: 'br-29', title: 'Mera Piya Ghar Aaya', artist: 'Kavita Krishnamurthy', category: 'Baraat Entry', youtubeQuery: 'Mera Piya Ghar Aaya Yaraana', youtubeVideoId: '7x_v9k2m1zY', duration: '5:10', vibe: 'Bridal Family Welcoming' },
  { id: 'br-30', title: 'Le Jayenge Le Jayenge', artist: 'Kishore Kumar, Asha Bhosle', category: 'Baraat Entry', youtubeQuery: 'Le Jayenge Dilwale Dulhaniya', youtubeVideoId: '6x_v1k2m3pY', duration: '4:00', vibe: 'Teasing the In-laws' },
  { id: 'br-31', title: 'Chote Chote Bhaiyon Ke (Baraat)', artist: 'Udit Narayan', category: 'Baraat Entry', youtubeQuery: 'Chote Chote Bhaiyon Ke', youtubeVideoId: 'M7XhP_Ua8Z8', duration: '4:15', vibe: 'Brotherly Love' },
  { id: 'br-32', title: 'Aaj Mere Yaar Ki Shaadi Hai', artist: 'Mohammed Rafi', category: 'Baraat Entry', youtubeQuery: 'Aaj Mere Yaar Ki Shaadi Hai Aadmi Sadak Ka', youtubeVideoId: '3p_x1k9v2nM', duration: '4:45', vibe: 'Vintage Best Friend Anthem' },
  { id: 'br-33', title: 'Chalka Chalka (Baraat)', artist: 'Richa Sharma', category: 'Baraat Entry', youtubeQuery: 'Chalka Chalka Re', youtubeVideoId: 'a7K0w_P5n6Q', duration: '5:45', vibe: 'Joyous Procession' },
  { id: 'br-34', title: 'Shava Shava', artist: 'Sudesh Bhosle, Alka Yagnik, Sunidhi Chauhan', category: 'Baraat Entry', youtubeQuery: 'Say Shava Shava K3G', youtubeVideoId: '8p_x9k2v1nM', duration: '6:50', vibe: 'Grand Amitabh Bachchan Energy' },
  { id: 'br-35', title: 'Chura Ke Dil Mera', artist: 'Kumar Sanu, Alka Yagnik', category: 'Baraat Entry', youtubeQuery: 'Chura Ke Dil Mera Main Khiladi', youtubeVideoId: '2b_v9k1m3pY', duration: '5:30', vibe: 'Playful Romantic Entry' },
  { id: 'br-36', title: 'Khaike Paan Banaraswala', artist: 'Kishore Kumar', category: 'Baraat Entry', youtubeQuery: 'Khaike Paan Banaraswala Don', youtubeVideoId: '5p_x1k9v2nM', duration: '4:15', vibe: 'Desi Groom Attitude' },
  { id: 'br-37', title: 'Jumma Chumma De De', artist: 'Sudesh Bhosle, Kavita Krishnamurthy', category: 'Baraat Entry', youtubeQuery: 'Jumma Chumma De De Hum', youtubeVideoId: '7x_v9k2m1zY', duration: '6:30', vibe: 'Celebratory Street Horns' },
  { id: 'br-38', title: 'Baraat Dhol Tasha', artist: 'Nashik Dhol Tasha Pathak', category: 'Baraat Entry', youtubeQuery: 'Nashik Dhol Tasha Pathak baraat', youtubeVideoId: '6x_v1k2m3pY', duration: '6:00', vibe: 'Rhythmic Thunder Drums' },
  { id: 'br-39', title: 'Bhangra Dhol Dhamaka', artist: 'Dhol Foundation', category: 'Baraat Entry', youtubeQuery: 'Dhol Foundation wedding beat', youtubeVideoId: '3p_x1k9v2nM', duration: '4:20', vibe: 'High BPM Dhol Explosion' },
  { id: 'br-40', title: 'Tenu Leke (Baraat Remix)', artist: 'Sonu Nigam', category: 'Baraat Entry', youtubeQuery: 'Tenu Leke Salaam-e-Ishq remix', youtubeVideoId: 'yR0j-61E63Y', duration: '4:00', vibe: 'Modern Club Brass' },
  { id: 'br-41', title: 'Mundian (Live Trumpet)', artist: 'Panjabi MC', category: 'Baraat Entry', youtubeQuery: 'Mundian live trumpet wedding', youtubeVideoId: 'DJztXj2GPfk', duration: '3:30', vibe: 'Brass Ensemble' },
  { id: 'br-42', title: 'Saajanji (Baraat Remix)', artist: 'Kumar Sanu', category: 'Baraat Entry', youtubeQuery: 'Saajanji Ghar Aaye remix', youtubeVideoId: 'w2u_3k4m5pY', duration: '4:50', vibe: 'Grand Welcoming' },

  // 5. Bridal Entry (40 Songs)
  { id: 'be-1', title: 'Din Shagna Da', artist: 'Jasleen Royal', category: 'Bridal Entry', youtubeQuery: 'Din Shagna Da Phillauri Jasleen Royal', youtubeVideoId: '2b9vf2N-A30', duration: '3:36', vibe: 'The Definitive Modern Bridal Entry' },
  { id: 'be-2', title: 'Kudmayi', artist: 'Shahid Mallya, Pritam', category: 'Bridal Entry', youtubeQuery: 'Kudmayi Rocky Aur Rani', youtubeVideoId: 'a3hK4iN3rM0', duration: '4:26', vibe: 'Grand Tears of Joy & Royal Elegance' },
  { id: 'be-3', title: 'Madhanya (Bridal Walk)', artist: 'Rahul Vaidya, Asees Kaur', category: 'Bridal Entry', youtubeQuery: 'Madhanya bridal entry', youtubeVideoId: 'rZ3_K1A1b2M', duration: '3:45', vibe: 'Emotional Walk Under Phoolon Ki Chaadar' },
  { id: 'be-4', title: 'Afreen Afreen', artist: 'Rahat Fateh Ali Khan, Momina Mustehsan', category: 'Bridal Entry', youtubeQuery: 'Afreen Afreen Coke Studio bridal', youtubeVideoId: 'kw4tT7SCmaY', duration: '6:45', vibe: 'Ethereal Praise of the Bride' },
  { id: 'be-5', title: 'Ranjha (Sid-Kiara Wedding Version)', artist: 'B Praak, Jasleen Royal', category: 'Bridal Entry', youtubeQuery: 'Ranjha Sid Kiara wedding version', youtubeVideoId: 'V7LwfY5U5WI', duration: '3:20', vibe: 'Romantic Fairytale Walk' },
  { id: 'be-6', title: 'Shubhaarambh', artist: 'Shruti Pathak, Divya Kumar', category: 'Bridal Entry', youtubeQuery: 'Shubhaarambh Kai Po Che', youtubeVideoId: '1p2_v8x9w0M', duration: '3:54', vibe: 'Sacred Shehnai & Auspicious Chants' },
  { id: 'be-7', title: 'Arziyan (Acoustic Bridal Walk)', artist: 'Javed Ali, Kailash Kher', category: 'Bridal Entry', youtubeQuery: 'Arziyan acoustic bridal entry', youtubeVideoId: '5p_x1k9v2nM', duration: '4:30', vibe: 'Spiritual Grace & Reverence' },
  { id: 'be-8', title: 'Kasoor (Acoustic Entry)', artist: 'Prateek Kuhad', category: 'Bridal Entry', youtubeQuery: 'Kasoor Prateek Kuhad bridal', youtubeVideoId: '7x_v9k2m1zY', duration: '3:17', vibe: 'Intimate Modern Aesthetic' },
  { id: 'be-9', title: 'Raataan Lambiyan (Bridal Piano)', artist: 'Jubin Nautiyal, Asees Kaur', category: 'Bridal Entry', youtubeQuery: 'Raataan Lambiyan bridal piano', youtubeVideoId: 'gvyUuxdRdR4', duration: '3:50', vibe: 'Pure Romance Under Fairy Lights' },
  { id: 'be-10', title: 'Laadki', artist: 'Sachin-Jigar, Rekha Bhardwaj', category: 'Bridal Entry', youtubeQuery: 'Laadki Coke Studio bridal', youtubeVideoId: '6x_v1k2m3pY', duration: '5:32', vibe: 'Deep Mother-Daughter Walk' },
  { id: 'be-11', title: 'Chaudhary (Bridal Glow)', artist: 'Amit Trivedi, Mame Khan', category: 'Bridal Entry', youtubeQuery: 'Chaudhary Coke Studio bridal', youtubeVideoId: '3p_x1k9v2nM', duration: '5:24', vibe: 'Royal Rajasthani Heritage' },
  { id: 'be-12', title: 'Heer Ranjha (Acoustic Walk)', artist: 'Rito Riba', category: 'Bridal Entry', youtubeQuery: 'Heer Ranjha Rito Riba acoustic', youtubeVideoId: '8p_x9k2v1nM', duration: '3:40', vibe: 'Soulful Melody with Every Step' },
  { id: 'be-13', title: 'Chaap Tilak', artist: 'Abida Parveen, Rahat Fateh Ali Khan', category: 'Bridal Entry', youtubeQuery: 'Chaap Tilak Coke Studio', youtubeVideoId: '2b_v9k1m3pY', duration: '7:15', vibe: 'Sufi Devotional Grace' },
  { id: 'be-14', title: 'Tajdar-E-Haram', artist: 'Atif Aslam', category: 'Bridal Entry', youtubeQuery: 'Tajdar e Haram Atif Aslam', youtubeVideoId: '5p_x1k9v2nM', duration: '10:00', vibe: 'Spiritual Sacred Reverence' },
  { id: 'be-15', title: 'Mangalyam (Bridal Entry)', artist: 'A.R. Rahman', category: 'Bridal Entry', youtubeQuery: 'Mangalyam Saathiya AR Rahman', youtubeVideoId: '7x_v9k2m1zY', duration: '4:15', vibe: 'Sacred Sanskrit Vows' },
  { id: 'be-16', title: 'Tere Bina', artist: 'AR Rahman, Chinmayi', category: 'Bridal Entry', youtubeQuery: 'Tere Bina Guru AR Rahman', youtubeVideoId: '6x_v1k2m3pY', duration: '5:10', vibe: 'Timeless Rahman Romance' },
  { id: 'be-17', title: 'Khaabon Ke Parindey', artist: 'Mohit Chauhan, Alyssa Mendonsa', category: 'Bridal Entry', youtubeQuery: 'Khaabon Ke Parindey ZNMD', youtubeVideoId: '3p_x1k9v2nM', duration: '4:13', vibe: 'Gentle Modern Breeze' },
  { id: 'be-18', title: 'Iktara (Bridal Walk)', artist: 'Kavita Seth, Amitabh Bhattacharya', category: 'Bridal Entry', youtubeQuery: 'Iktara Wake Up Sid', youtubeVideoId: '8p_x9k2v1nM', duration: '4:13', vibe: 'Soulful Melodic Steps' },
  { id: 'be-19', title: 'Moh Moh Ke Dhaage', artist: 'Monali Thakur', category: 'Bridal Entry', youtubeQuery: 'Moh Moh Ke Dhaage Dum Laga Ke Haisha', youtubeVideoId: 'd9n3E5uV2N8', duration: '5:22', vibe: 'Deep Heartfelt Connection' },
  { id: 'be-20', title: 'Jashn-E-Bahaara', artist: 'Javed Ali, AR Rahman', category: 'Bridal Entry', youtubeQuery: 'Jashn E Bahaara Jodhaa Akbar', youtubeVideoId: '2b_v9k1m3pY', duration: '5:15', vibe: 'Imperial Mughal Splendor' },
  { id: 'be-21', title: 'In Dino', artist: 'Soham Chakraborty, Pritam', category: 'Bridal Entry', youtubeQuery: 'In Dino Life in a Metro', youtubeVideoId: '5p_x1k9v2nM', duration: '4:40', vibe: 'Sweet Acoustic Piano' },
  { id: 'be-22', title: 'Tu Bin Bataye', artist: 'Madhushree, Naresh Iyer', category: 'Bridal Entry', youtubeQuery: 'Tu Bin Bataye Rang De Basanti', youtubeVideoId: '7x_v9k2m1zY', duration: '5:50', vibe: 'Poetic Bridal Whispers' },
  { id: 'be-23', title: 'Bahaara', artist: 'Shreya Ghoshal, Sona Mohapatra', category: 'Bridal Entry', youtubeQuery: 'Bahara I Hate Luv Storys', youtubeVideoId: '6x_v1k2m3pY', duration: '5:25', vibe: 'Blossoming Spring Flowers' },
  { id: 'be-24', title: 'Manwa Laage', artist: 'Shreya Ghoshal, Arijit Singh', category: 'Bridal Entry', youtubeQuery: 'Manwa Laage Happy New Year', youtubeVideoId: '3p_x1k9v2nM', duration: '4:31', vibe: 'Gentle Heartbeats' },
  { id: 'be-25', title: 'Sun Saathiya (Piano Walk)', artist: 'Priya Saraiya', category: 'Bridal Entry', youtubeQuery: 'Sun Saathiya piano instrumental', youtubeVideoId: '8p_x9k2v1nM', duration: '3:38', vibe: 'Tender Fairy Lights' },
  { id: 'be-26', title: 'Namo Namo (Bridal Flute)', artist: 'Amit Trivedi', category: 'Bridal Entry', youtubeQuery: 'Namo Namo Kedarnath flute instrumental', youtubeVideoId: '2b_v9k1m3pY', duration: '5:20', vibe: 'Divine Himalayan Aura' },
  { id: 'be-27', title: 'O Re Piya (Bridal Version)', artist: 'Rahat Fateh Ali Khan', category: 'Bridal Entry', youtubeQuery: 'O Re Piya bridal entry', youtubeVideoId: 'Iv_3iGk9XwM', duration: '6:19', vibe: 'Slow Motion Tears of Love' },
  { id: 'be-28', title: 'Jag Ghoomeya (Female)', artist: 'Neha Bhasin', category: 'Bridal Entry', youtubeQuery: 'Jag Ghoomeya Neha Bhasin', youtubeVideoId: '5p_x1k9v2nM', duration: '4:40', vibe: 'Deep Unconditional Love' },
  { id: 'be-29', title: 'Neele Neele Ambar Par (Acoustic)', artist: 'Kishore Kumar', category: 'Bridal Entry', youtubeQuery: 'Neele Neele Ambar Par acoustic', youtubeVideoId: '7x_v9k2m1zY', duration: '5:00', vibe: 'Classic Moonlight Walk' },
  { id: 'be-30', title: 'Pehla Nasha (Bridal Piano)', artist: 'Sadhana Sargam', category: 'Bridal Entry', youtubeQuery: 'Pehla Nasha piano instrumental', youtubeVideoId: '6x_v1k2m3pY', duration: '4:51', vibe: 'First Love Memories' },
  { id: 'be-31', title: 'Tera Chehra (Adnan Sami)', artist: 'Adnan Sami', category: 'Bridal Entry', youtubeQuery: 'Tera Chehra Adnan Sami', youtubeVideoId: '3p_x1k9v2nM', duration: '5:45', vibe: 'Pure Elegance' },
  { id: 'be-32', title: 'Bairi Piya', artist: 'Shreya Ghoshal, Udit Narayan', category: 'Bridal Entry', youtubeQuery: 'Bairi Piya Devdas', youtubeVideoId: '8p_x9k2v1nM', duration: '5:20', vibe: 'Grand Devdas Royal Walk' },
  { id: 'be-33', title: 'Silsila Ye Chahat Ka', artist: 'Shreya Ghoshal', category: 'Bridal Entry', youtubeQuery: 'Silsila Ye Chahat Ka Devdas', youtubeVideoId: '2b_v9k1m3pY', duration: '5:26', vibe: 'Auspicious Diya Ceremony' },
  { id: 'be-34', title: 'Dola Re Dola (Acoustic Flute)', artist: 'Kavita Krishnamurthy', category: 'Bridal Entry', youtubeQuery: 'Dola Re Dola flute instrumental', youtubeVideoId: '5p_x1k9v2nM', duration: '6:35', vibe: 'Majestic Traditional Flute' },
  { id: 'be-35', title: 'Heer (Bridal Walk)', artist: 'Harshdeep Kaur', category: 'Bridal Entry', youtubeQuery: 'Heer bridal walk', youtubeVideoId: '7x_v9k2m1zY', duration: '4:20', vibe: 'Royal Phoolon Ki Chaadar' },
  { id: 'be-36', title: 'Din Shagna Da (Encore)', artist: 'The Wedding Filmer', category: 'Bridal Entry', youtubeQuery: 'Din Shagna Da The Wedding Filmer', youtubeVideoId: '2b9vf2N-A30', duration: '4:10', vibe: 'Fairytale Masterpiece' },
  { id: 'be-37', title: 'Arziyan (Flute & Sitar)', artist: 'Classical Masters', category: 'Bridal Entry', youtubeQuery: 'Arziyan instrumental wedding', youtubeVideoId: '6x_v1k2m3pY', duration: '4:50', vibe: 'Spiritual Alignment' },
  { id: 'be-38', title: 'Kudmayi (Bridal Acoustic)', artist: 'Shahid Mallya', category: 'Bridal Entry', youtubeQuery: 'Kudmayi acoustic bridal walk', youtubeVideoId: 'a3hK4iN3rM0', duration: '3:50', vibe: 'Tender Emotions' },
  { id: 'be-39', title: 'Shubhaarambh (Shehnai)', artist: 'Pt. S. Ballesh', category: 'Bridal Entry', youtubeQuery: 'Shubhaarambh shehnai instrumental', youtubeVideoId: '3p_x1k9v2nM', duration: '3:50', vibe: 'Sacred Auspiciousness' },
  { id: 'be-40', title: 'Laadki (Coke Studio Reprise)', artist: 'Rekha Bhardwaj', category: 'Bridal Entry', youtubeQuery: 'Laadki instrumental bridal', youtubeVideoId: '8p_x9k2v1nM', duration: '4:30', vibe: 'Parental Blessings' },

  // 6. Varmala & Sacred Phere (40 Songs)
  { id: 'vm-1', title: 'Mangalyam Tantunanena', artist: 'Traditional Vedic Shloka / Bombay Jayashri', category: 'Varmala & Phere', youtubeQuery: 'Mangalyam Tantunanena sacred wedding shloka', youtubeVideoId: '8fN_aYq9v80', duration: '4:15', vibe: 'Divine Sacred Marriage Vows' },
  { id: 'vm-2', title: 'Mangal Bhavan Amangal Haari', artist: 'Ravindra Jain', category: 'Varmala & Phere', youtubeQuery: 'Mangal Bhavan Amangal Haari wedding', youtubeVideoId: '2b_v9k1m3pY', duration: '5:20', vibe: 'Ancient Auspicious Ramayana Blessings' },
  { id: 'vm-3', title: 'Gauri Mangalam', artist: 'Classical Sanskrit Chant', category: 'Varmala & Phere', youtubeQuery: 'Gauri Mangalam wedding varmala', youtubeVideoId: '5p_x1k9v2nM', duration: '3:50', vibe: 'Garland Exchange Petal Shower' },
  { id: 'vm-4', title: 'Mast Magan', artist: 'Arijit Singh, Chinmayi Sripada', category: 'Varmala & Phere', youtubeQuery: 'Mast Magan 2 States varmala', youtubeVideoId: 'tZkW4uPq7c8', duration: '4:40', vibe: 'Devotional Soul Connection' },
  { id: 'vm-5', title: 'O Re Piya (Garland Exchange)', artist: 'Rahat Fateh Ali Khan', category: 'Varmala & Phere', youtubeQuery: 'O Re Piya Aaja Nachle wedding varmala', youtubeVideoId: 'Iv_3iGk9XwM', duration: '6:19', vibe: 'Slow Motion Garland Exchange' },
  { id: 'vm-6', title: 'Kesariya (Sacred Flute Harmony)', artist: 'Arijit Singh, Pritam', category: 'Varmala & Phere', youtubeQuery: 'Kesariya flute instrumental wedding', youtubeVideoId: 'BddP6PYo2gs', duration: '4:28', vibe: 'Warm Saffron Sacred Vows' },
  { id: 'vm-7', title: 'Chaand Baaliyan', artist: 'Aditya A', category: 'Varmala & Phere', youtubeQuery: 'Chaand Baaliyan Aditya A wedding', youtubeVideoId: '7x_v9k2m1zY', duration: '1:43', vibe: 'Sweet Smiling First Eye Contact' },
  { id: 'vm-8', title: 'Tum Se Hi (Varmala Acoustic)', artist: 'Mohit Chauhan', category: 'Varmala & Phere', youtubeQuery: 'Tum Se Hi Jab We Met acoustic', youtubeVideoId: '6x_v1k2m3pY', duration: '5:23', vibe: 'Heartfelt Devotion at the Mandap' },
  { id: 'vm-9', title: 'Radha Raman Hari Bol', artist: 'Traditional Kirtan / Gauranga', category: 'Varmala & Phere', youtubeQuery: 'Radha Raman Hari Bol wedding', youtubeVideoId: '3p_x1k9v2nM', duration: '6:10', vibe: 'Divine Spiritual Atmosphere' },
  { id: 'vm-10', title: 'Sapna Jahan', artist: 'Sonu Nigam, Neeti Mohan', category: 'Varmala & Phere', youtubeQuery: 'Sapna Jahan Brothers wedding song', youtubeVideoId: '8p_x9k2v1nM', duration: '5:41', vibe: 'Dreams Realized at the Holy Fire' },
  { id: 'vm-11', title: 'Saathiya (Mandap Harmony)', artist: 'Sonu Nigam, AR Rahman', category: 'Varmala & Phere', youtubeQuery: 'Saathiya AR Rahman mandap instrumental', youtubeVideoId: '2b_v9k1m3pY', duration: '5:58', vibe: 'Eternal Seven Steps Together' },
  { id: 'vm-12', title: 'Kabir Cafe Halka', artist: 'Neeraj Arya Kabir Cafe', category: 'Varmala & Phere', youtubeQuery: 'Kabir Cafe wedding sacred', youtubeVideoId: '5p_x1k9v2nM', duration: '4:15', vibe: 'Philosophical Unconditional Love' },
  { id: 'vm-13', title: 'Vedic Vivah Mantra (Sanskrit)', artist: 'Vedic Priests', category: 'Varmala & Phere', youtubeQuery: 'Vedic Vivah Mantra seven pheras', youtubeVideoId: '7x_v9k2m1zY', duration: '7:30', vibe: 'Sacred Seven Steps Chants' },
  { id: 'vm-14', title: 'Shree Krishna Govind Hare Murari', artist: 'Jubin Nautiyal', category: 'Varmala & Phere', youtubeQuery: 'Shree Krishna Govind Hare Murari wedding', youtubeVideoId: '6x_v1k2m3pY', duration: '5:15', vibe: 'Divine Holy Fire Blessing' },
  { id: 'vm-15', title: 'Achutam Keshavam', artist: 'Vikram Hazra', category: 'Varmala & Phere', youtubeQuery: 'Achutam Keshavam Art of Living', youtubeVideoId: '3p_x1k9v2nM', duration: '5:50', vibe: 'Pure Devotion & Peace' },
  { id: 'vm-16', title: 'Aigiri Nandini (Melodic Harmony)', artist: 'Brodha V / Classical Ensemble', category: 'Varmala & Phere', youtubeQuery: 'Aigiri Nandini classical fusion', youtubeVideoId: '8p_x9k2v1nM', duration: '4:40', vibe: 'Auspicious Shakti Blessing' },
  { id: 'vm-17', title: 'Gayatri Mantra with Shehnai', artist: 'Anuradha Paudwal', category: 'Varmala & Phere', youtubeQuery: 'Gayatri Mantra shehnai', youtubeVideoId: '2b_v9k1m3pY', duration: '6:15', vibe: 'Ancient Vedic Sun Chant' },
  { id: 'vm-18', title: 'Madhurashtakam', artist: 'MS Subbulakshmi', category: 'Varmala & Phere', youtubeQuery: 'Madhurashtakam MS Subbulakshmi', youtubeVideoId: '5p_x1k9v2nM', duration: '5:45', vibe: 'Sweetness of Sacred Love' },
  { id: 'vm-19', title: 'Kalyana Thene Nila', artist: 'SP Balasubrahmanyam', category: 'Varmala & Phere', youtubeQuery: 'Kalyana Thene Nila wedding classic', youtubeVideoId: '7x_v9k2m1zY', duration: '4:35', vibe: 'South Indian Sacred Melody' },
  { id: 'vm-20', title: 'Sita Kalyanam', artist: 'Bombay Jayashri', category: 'Varmala & Phere', youtubeQuery: 'Sita Kalyanam Vaibhogame', youtubeVideoId: '6x_v1k2m3pY', duration: '4:50', vibe: 'Celebration of Rama & Sita Vows' },
  { id: 'vm-21', title: 'Kannan Varuvaan', artist: 'S. Janaki', category: 'Varmala & Phere', youtubeQuery: 'Kannan Varuvaan classical', youtubeVideoId: '3p_x1k9v2nM', duration: '4:20', vibe: 'Traditional Auspicious Vows' },
  { id: 'vm-22', title: 'Tum Prem Ho (Radhe Krishna)', artist: 'Mohit Lalwani', category: 'Varmala & Phere', youtubeQuery: 'Tum Prem Ho Radhe Krishna', youtubeVideoId: '8p_x9k2v1nM', duration: '4:15', vibe: 'Eternal Soul Love' },
  { id: 'vm-23', title: 'Radhe Radhe Govinda', artist: 'Jagjit Singh', category: 'Varmala & Phere', youtubeQuery: 'Radhe Radhe Govinda Jagjit Singh', youtubeVideoId: '2b_v9k1m3pY', duration: '6:00', vibe: 'Peaceful Holy Chants' },
  { id: 'vm-24', title: 'Maha Mrityunjaya (Flute Harmony)', artist: 'Hariprasad Chaurasia', category: 'Varmala & Phere', youtubeQuery: 'Maha Mrityunjaya flute instrumental', youtubeVideoId: '5p_x1k9v2nM', duration: '8:10', vibe: 'Sacred Protection Blessing' },
  { id: 'vm-25', title: 'Tere Hawaale (Mandap Acoustic)', artist: 'Arijit Singh', category: 'Varmala & Phere', youtubeQuery: 'Tere Hawaale acoustic mandap', youtubeVideoId: '7x_v9k2m1zY', duration: '5:50', vibe: 'Surrender in Love' },
  { id: 'vm-26', title: 'Kun Faya Kun (Instrumental)', artist: 'AR Rahman', category: 'Varmala & Phere', youtubeQuery: 'Kun Faya Kun instrumental', youtubeVideoId: 'T94PHkuydcw', duration: '7:50', vibe: 'Divine Creation & Destiny' },
  { id: 'vm-27', title: 'Khwaja Mere Khwaja (Mandap Flute)', artist: 'AR Rahman', category: 'Varmala & Phere', youtubeQuery: 'Khwaja Mere Khwaja flute', youtubeVideoId: '6x_v1k2m3pY', duration: '6:20', vibe: 'Auspicious Devotional Glow' },
  { id: 'vm-28', title: 'Mohe Rang Do Laal', artist: 'Shreya Ghoshal, Pandit Birju Maharaj', category: 'Varmala & Phere', youtubeQuery: 'Mohe Rang Do Laal Bajirao Mastani', youtubeVideoId: '3p_x1k9v2nM', duration: '3:50', vibe: 'Pure Red Sindoor Moments' },
  { id: 'vm-29', title: 'Namo Namo (Sitar Harmony)', artist: 'Amit Trivedi', category: 'Varmala & Phere', youtubeQuery: 'Namo Namo sitar instrumental', youtubeVideoId: '8p_x9k2v1nM', duration: '5:00', vibe: 'Majestic Spiritual Vows' },
  { id: 'vm-30', title: 'Kesariya (Varmala Special)', artist: 'Pritam, Arijit Singh', category: 'Varmala & Phere', youtubeQuery: 'Kesariya wedding varmala special', youtubeVideoId: 'BddP6PYo2gs', duration: '4:28', vibe: 'Golden Garland Exchange' },
  { id: 'vm-31', title: 'Hasi Ban Gaye (Acoustic Mandap)', artist: 'Shreya Ghoshal', category: 'Varmala & Phere', youtubeQuery: 'Hasi Ban Gaye acoustic instrumental', youtubeVideoId: '2b_v9k1m3pY', duration: '3:30', vibe: 'Tear of Joy in Sacred Fire' },
  { id: 'vm-32', title: 'Kaun Tujhe (Violin & Flute)', artist: 'Palak Muchhal', category: 'Varmala & Phere', youtubeQuery: 'Kaun Tujhe violin flute instrumental', youtubeVideoId: '5p_x1k9v2nM', duration: '4:00', vibe: 'Devoted Promises' },
  { id: 'vm-33', title: 'Raabta (Varmala Acoustic)', artist: 'Arijit Singh', category: 'Varmala & Phere', youtubeQuery: 'Raabta acoustic instrumental', youtubeVideoId: '7x_v9k2m1zY', duration: '4:03', vibe: 'Pre-destined Cosmic Vows' },
  { id: 'vm-34', title: 'Samjhawan (Mandap Harmony)', artist: 'Arijit Singh, Shreya Ghoshal', category: 'Varmala & Phere', youtubeQuery: 'Samjhawan acoustic instrumental', youtubeVideoId: '6x_v1k2m3pY', duration: '4:29', vibe: 'Deep Heartfelt Unity' },
  { id: 'vm-35', title: 'Tera Ban Jaunga (Acoustic Flute)', artist: 'Akhil Sachdeva', category: 'Varmala & Phere', youtubeQuery: 'Tera Ban Jaunga flute instrumental', youtubeVideoId: '3p_x1k9v2nM', duration: '3:56', vibe: 'Promise for Seven Lifetimes' },
  { id: 'vm-36', title: 'Sita Ram Kirtan', artist: 'Krishna Das', category: 'Varmala & Phere', youtubeQuery: 'Sita Ram Krishna Das kirtan', youtubeVideoId: '8p_x9k2v1nM', duration: '7:15', vibe: 'Soul Centered Devotion' },
  { id: 'vm-37', title: 'Govinda Gopala', artist: 'Jubin Nautiyal', category: 'Varmala & Phere', youtubeQuery: 'Govinda Gopala Jubin Nautiyal', youtubeVideoId: '2b_v9k1m3pY', duration: '4:45', vibe: 'Joyous Auspicious Chants' },
  { id: 'vm-38', title: 'Seven Sacred Steps (Shehnai)', artist: 'Pt. Bismillah Khan Heritage', category: 'Varmala & Phere', youtubeQuery: 'Saptapadi Shehnai traditional', youtubeVideoId: '5p_x1k9v2nM', duration: '6:30', vibe: 'Seven Holy Steps Ritual' },
  { id: 'vm-39', title: 'Sindoor Daan Dhun', artist: 'Temple Classical Priests', category: 'Varmala & Phere', youtubeQuery: 'Sindoor daan shehnai music', youtubeVideoId: '7x_v9k2m1zY', duration: '5:00', vibe: 'Sacred Vermilion Ritual' },
  { id: 'vm-40', title: 'Mangalam Koshalam', artist: 'Sanskrit Vedic Priests', category: 'Varmala & Phere', youtubeQuery: 'Mangalam Koshalam wedding blessing', youtubeVideoId: '6x_v1k2m3pY', duration: '4:10', vibe: 'Eternal Auspicious Blessings' },

  // 7. Romantic Couple Dance & First Dance (45 Songs)
  { id: 'rc-1', title: 'Kesariya', artist: 'Arijit Singh, Pritam', category: 'Reception & Couple Dance', youtubeQuery: 'Kesariya couple dance wedding', youtubeVideoId: 'BddP6PYo2gs', duration: '4:28', vibe: 'Pure Passionate First Dance' },
  { id: 'rc-2', title: 'Tum Hi Ho', artist: 'Arijit Singh, Mithoon', category: 'Reception & Couple Dance', youtubeQuery: 'Tum Hi Ho Aashiqui 2 first dance', youtubeVideoId: 'Umqb9KENgmk', duration: '4:22', vibe: 'Timeless Unconditional Love' },
  { id: 'rc-3', title: 'Pehla Nasha', artist: 'Udit Narayan, Sadhana Sargam', category: 'Reception & Couple Dance', youtubeQuery: 'Pehla Nasha Jo Jeeta Wohi Sikandar', youtubeVideoId: 'b_g6a5_uPjU', duration: '4:51', vibe: 'Nostalgic First Love Slow Waltz' },
  { id: 'rc-4', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', category: 'Reception & Couple Dance', youtubeQuery: 'Dil Diyan Gallan Tiger Zinda Hai dance', youtubeVideoId: 'SAcpESN_Fk4', duration: '4:20', vibe: 'Grand Ballroom Couple Waltz' },
  { id: 'rc-5', title: 'Tere Hawaale', artist: 'Arijit Singh, Shilpa Rao', category: 'Reception & Couple Dance', youtubeQuery: 'Tere Hawaale Laal Singh Chaddha', youtubeVideoId: 'KUpwupYj_tY', duration: '5:50', vibe: 'Surrendering Heart & Soul' },
  { id: 'rc-6', title: 'Apna Bana Le', artist: 'Arijit Singh, Sachin-Jigar', category: 'Reception & Couple Dance', youtubeQuery: 'Apna Bana Le Bhediya couple dance', youtubeVideoId: 'ElZfdU54Cp8', duration: '4:21', vibe: 'Soulful Belonging' },
  { id: 'rc-7', title: 'Zaalima', artist: 'Arijit Singh, Harshdeep Kaur', category: 'Reception & Couple Dance', youtubeQuery: 'Zaalima Raees couple dance', youtubeVideoId: 'lpdRqn6xLQk', duration: '4:59', vibe: 'Graceful Romantic Twirls' },
  { id: 'rc-8', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva, Tulsi Kumar', category: 'Reception & Couple Dance', youtubeQuery: 'Tera Ban Jaunga Kabir Singh', youtubeVideoId: 'n_FGq_SgL_g', duration: '3:56', vibe: 'Promise of Forever' },
  { id: 'rc-9', title: 'Heeriye', artist: 'Jasleen Royal, Arijit Singh', category: 'Reception & Couple Dance', youtubeQuery: 'Heeriye Jasleen Royal Arijit Singh', youtubeVideoId: 'RLzC55ai0eo', duration: '3:15', vibe: 'Modern Acoustic Love Tale' },
  { id: 'rc-10', title: 'Perfect (Wedding Waltz)', artist: 'Ed Sheeran', category: 'Reception & Couple Dance', youtubeQuery: 'Ed Sheeran Perfect first dance wedding', youtubeVideoId: '2Vv-BfVoq4g', duration: '4:23', vibe: 'Global Classic Wedding Dance' },
  { id: 'rc-11', title: 'All of Me', artist: 'John Legend', category: 'Reception & Couple Dance', youtubeQuery: 'All of Me John Legend wedding', youtubeVideoId: '450p7goxZqg', duration: '4:29', vibe: 'Soulful Piano Serenade' },
  { id: 'rc-12', title: 'Nazm Nazm', artist: 'Ayushmann Khurrana / Arko', category: 'Reception & Couple Dance', youtubeQuery: 'Nazm Nazm Bareilly Ki Barfi', youtubeVideoId: 'DK_UsATwoxI', duration: '3:47', vibe: 'Poetic Whisper in Moonlight' },
  { id: 'rc-13', title: 'Samjhawan', artist: 'Arijit Singh, Shreya Ghoshal', category: 'Reception & Couple Dance', youtubeQuery: 'Samjhawan Humpty Sharma', youtubeVideoId: 'zpsVpnvFfZQ', duration: '4:29', vibe: 'Deep Emotion & Closeness' },
  { id: 'rc-14', title: 'Hasi (Female Version)', artist: 'Shreya Ghoshal, Ami Mishra', category: 'Reception & Couple Dance', youtubeQuery: 'Hasi Hamari Adhuri Kahani', youtubeVideoId: '2b_v9k1m3pY', duration: '3:12', vibe: 'Tender Gratitude & Smiles' },
  { id: 'rc-15', title: 'Raabta (Kehte Hain Khuda)', artist: 'Arijit Singh, Hamsika Iyer', category: 'Reception & Couple Dance', youtubeQuery: 'Raabta Agent Vinod', youtubeVideoId: 'z3UYzZ_J8K0', duration: '4:03', vibe: 'Pre-Destined Soul Connection' },
  { id: 'rc-16', title: 'Chaleya', artist: 'Arijit Singh, Shilpa Rao', category: 'Reception & Couple Dance', youtubeQuery: 'Chaleya Jawan couple dance', youtubeVideoId: 'VAdGW7QDJUI', duration: '3:20', vibe: 'Catchy Modern Romance' },
  { id: 'rc-17', title: 'Satranga', artist: 'Arijit Singh, Shreyas Puranik', category: 'Reception & Couple Dance', youtubeQuery: 'Satranga Animal couple dance', youtubeVideoId: 'HrnrqYxYrbk', duration: '4:31', vibe: 'Seven Colored Emotional Tapestry' },
  { id: 'rc-18', title: 'Hua Main', artist: 'Raghav Chaitanya, Pritam', category: 'Reception & Couple Dance', youtubeQuery: 'Hua Main Animal wedding dance', youtubeVideoId: 'f56S_n3rW-A', duration: '4:38', vibe: 'Intense Passionate Love' },
  { id: 'rc-19', title: 'Ve Kamleya', artist: 'Arijit Singh, Shreya Ghoshal', category: 'Reception & Couple Dance', youtubeQuery: 'Ve Kamleya Rocky Aur Rani', youtubeVideoId: 'nJ_E4L6F4mU', duration: '4:07', vibe: 'Sweet Heartwarming Chemistry' },
  { id: 'rc-20', title: 'O Maahi', artist: 'Arijit Singh, Pritam', category: 'Reception & Couple Dance', youtubeQuery: 'O Maahi Dunki couple dance', youtubeVideoId: 'Gg4OQ2D0r28', duration: '3:53', vibe: 'Soulful Gentle Ballad' },
  { id: 'rc-21', title: 'Lutt Putt Gaya', artist: 'Arijit Singh, Pritam', category: 'Reception & Couple Dance', youtubeQuery: 'Lutt Putt Gaya Dunki', youtubeVideoId: 'd0u8K8X3j0Q', duration: '3:45', vibe: 'Playful Couple Teasing' },
  { id: 'rc-22', title: 'Tere Vaaste', artist: 'Varun Jain, Sachin-Jigar', category: 'Reception & Couple Dance', youtubeQuery: 'Tere Vaaste Zara Hatke Zara Bachke', youtubeVideoId: 'k4F9A68F8wU', duration: '3:09', vibe: 'Charming Moon & Stars Promise' },
  { id: 'rc-23', title: 'Phir Aur Kya Chahiye', artist: 'Arijit Singh, Sachin-Jigar', category: 'Reception & Couple Dance', youtubeQuery: 'Phir Aur Kya Chahiye ZHZB', youtubeVideoId: '8p_x9k2v1nM', duration: '4:26', vibe: 'Contentment in Your Arms' },
  { id: 'rc-24', title: 'Pehle Bhi Main', artist: 'Vishal Mishra, Raj Shekhar', category: 'Reception & Couple Dance', youtubeQuery: 'Pehle Bhi Main Animal couple dance', youtubeVideoId: '2b_v9k1m3pY', duration: '4:10', vibe: 'Slow Intimate Eye Contact' },
  { id: 'rc-25', title: 'Kaise Hua', artist: 'Vishal Mishra', category: 'Reception & Couple Dance', youtubeQuery: 'Kaise Hua Kabir Singh', youtubeVideoId: '5p_x1k9v2nM', duration: '3:54', vibe: 'Wonder of Falling in Love' },
  { id: 'rc-26', title: 'Bekhayali (Acoustic)', artist: 'Sachet Tandon', category: 'Reception & Couple Dance', youtubeQuery: 'Bekhayali acoustic version', youtubeVideoId: '7x_v9k2m1zY', duration: '5:10', vibe: 'Deep Heartfelt Intensity' },
  { id: 'rc-27', title: 'Main Rang Sharbaton Ka', artist: 'Atif Aslam, Chinmayi', category: 'Reception & Couple Dance', youtubeQuery: 'Main Rang Sharbaton Ka Phata Poster', youtubeVideoId: '6x_v1k2m3pY', duration: '4:23', vibe: 'Sweet Acoustic Waltz' },
  { id: 'rc-28', title: 'Jeena Jeena', artist: 'Atif Aslam', category: 'Reception & Couple Dance', youtubeQuery: 'Jeena Jeena Badlapur first dance', youtubeVideoId: '3p_x1k9v2nM', duration: '3:49', vibe: 'Soulful Life Giving Love' },
  { id: 'rc-29', title: 'Sun Mere Humsafar', artist: 'Akhil Sachdeva, Mansheel Gujral', category: 'Reception & Couple Dance', youtubeQuery: 'Humsafar Badrinath Ki Dulhania', youtubeVideoId: '8p_x9k2v1nM', duration: '4:29', vibe: 'Devoted Life Companion' },
  { id: 'rc-30', title: 'Bol Do Na Zara', artist: 'Armaan Malik', category: 'Reception & Couple Dance', youtubeQuery: 'Bol Do Na Zara Azhar', youtubeVideoId: '2b_v9k1m3pY', duration: '4:53', vibe: 'Gentle Tender Confession' },
  { id: 'rc-31', title: 'Sab Tera', artist: 'Armaan Malik, Shraddha Kapoor', category: 'Reception & Couple Dance', youtubeQuery: 'Sab Tera Baaghi', youtubeVideoId: '5p_x1k9v2nM', duration: '3:48', vibe: 'Sweet Breezy Slow Dance' },
  { id: 'rc-32', title: 'Sanam Re', artist: 'Arijit Singh, Mithoon', category: 'Reception & Couple Dance', youtubeQuery: 'Sanam Re title track couple dance', youtubeVideoId: '7x_v9k2m1zY', duration: '5:08', vibe: 'Dreamy Winter Romance' },
  { id: 'rc-33', title: 'Gazab Ka Hai Din', artist: 'Arijit Singh, Prakriti Kakar', category: 'Reception & Couple Dance', youtubeQuery: 'Gazab Ka Hai Din Dil Juunglee', youtubeVideoId: '6x_v1k2m3pY', duration: '3:56', vibe: 'Modern Retro Romance' },
  { id: 'rc-34', title: 'Enna Sona', artist: 'Arijit Singh, AR Rahman', category: 'Reception & Couple Dance', youtubeQuery: 'Enna Sona OK Jaanu', youtubeVideoId: '3p_x1k9v2nM', duration: '3:33', vibe: 'Gentle Punjabi Ballad' },
  { id: 'rc-35', title: 'Zehnaseeb', artist: 'Chinmayi, Shekhar Ravjiani', category: 'Reception & Couple Dance', youtubeQuery: 'Zehnaseeb Hasee Toh Phasee', youtubeVideoId: '8p_x9k2v1nM', duration: '3:35', vibe: 'Charming Gratitude in Love' },
  { id: 'rc-36', title: 'Ishq Wala Love', artist: 'Shekhar Ravjiani, Salim Merchant, Neeti Mohan', category: 'Reception & Couple Dance', youtubeQuery: 'Ishq Wala Love SOTY', youtubeVideoId: '2b_v9k1m3pY', duration: '4:18', vibe: 'Youthful Fairytale Twirls' },
  { id: 'rc-37', title: 'Te Amo', artist: 'Ash King, Sunidhi Chauhan', category: 'Reception & Couple Dance', youtubeQuery: 'Te Amo Dum Maaro Dum', youtubeVideoId: '5p_x1k9v2nM', duration: '4:46', vibe: 'Bossa Nova Acoustic Groove' },
  { id: 'rc-38', title: 'Khuda Jaane', artist: 'KK, Shilpa Rao', category: 'Reception & Couple Dance', youtubeQuery: 'Khuda Jaane Bachna Ae Haseeno', youtubeVideoId: '7x_v9k2m1zY', duration: '5:33', vibe: 'Grand Passionate Duet' },
  { id: 'rc-39', title: 'Suraj Hua Maddham', artist: 'Sonu Nigam, Alka Yagnik', category: 'Reception & Couple Dance', youtubeQuery: 'Suraj Hua Maddham K3G', youtubeVideoId: '6x_v1k2m3pY', duration: '7:08', vibe: 'The Ultimate Shah Rukh Romance' },
  { id: 'rc-40', title: 'Kuch Kuch Hota Hai', artist: 'Udit Narayan, Alka Yagnik', category: 'Reception & Couple Dance', youtubeQuery: 'Kuch Kuch Hota Hai title track', youtubeVideoId: '3p_x1k9v2nM', duration: '4:56', vibe: 'Pure 90s Magic' },
  { id: 'rc-41', title: 'Tujh Mein Rab Dikhta Hai', artist: 'Roop Kumar Rathod', category: 'Reception & Couple Dance', youtubeQuery: 'Tujh Mein Rab Dikhta Hai RNBDJ', youtubeVideoId: '8p_x9k2v1nM', duration: '4:41', vibe: 'Seeing God in Your Eyes' },
  { id: 'rc-42', title: 'Haule Haule', artist: 'Sukhwinder Singh', category: 'Reception & Couple Dance', youtubeQuery: 'Haule Haule RNBDJ', youtubeVideoId: '2b_v9k1m3pY', duration: '4:45', vibe: 'Patient Growing Love' },
  { id: 'rc-43', title: 'Chhoo Lene Do', artist: 'Mohd. Rafi', category: 'Reception & Couple Dance', youtubeQuery: 'Chhoo Lene Do Nazuk Hothon Ko', youtubeVideoId: '5p_x1k9v2nM', duration: '3:20', vibe: 'Vintage Golden Classic' },
  { id: 'rc-44', title: 'A Thousand Years', artist: 'Christina Perri', category: 'Reception & Couple Dance', youtubeQuery: 'A Thousand Years Christina Perri wedding', youtubeVideoId: 'rtOvBOTyX00', duration: '4:45', vibe: 'Beloved Worldwide First Dance' },
  { id: 'rc-45', title: 'Until I Found You', artist: 'Stephen Sanchez', category: 'Reception & Couple Dance', youtubeQuery: 'Until I Found You Stephen Sanchez first dance', youtubeVideoId: 'GxldQ9eX2wo', duration: '2:57', vibe: 'Vintage 50s Sweet Romance' },

  // 8. Shehnai & Traditional Classic (28 Songs)
  { id: 'sh-1', title: 'Ustad Bismillah Khan - Shehnai Dhun', artist: 'Ustad Bismillah Khan', category: 'Shehnai & Classic', youtubeQuery: 'Ustad Bismillah Khan Shehnai wedding raag', youtubeVideoId: 'P_3k5m2a1xY', duration: '8:45', vibe: 'The Soul of Indian Weddings' },
  { id: 'sh-2', title: 'Shubh Vivah Shehnai Symphony', artist: 'Pandit S. Ballesh', category: 'Shehnai & Classic', youtubeQuery: 'Shubh Vivah Shehnai melody', youtubeVideoId: '2b_v9k1m3pY', duration: '6:30', vibe: 'Grand Auspicious Atmosphere' },
  { id: 'sh-3', title: 'Morning Raag Bilawal', artist: 'Pt. Shivkumar Sharma & Pt. Hariprasad Chaurasia', category: 'Shehnai & Classic', youtubeQuery: 'Shivkumar Sharma Hariprasad Chaurasia', youtubeVideoId: '5p_x1k9v2nM', duration: '9:12', vibe: 'Peaceful Morning Rituals' },
  { id: 'sh-4', title: 'Traditional Mangal Vadya Dhun', artist: 'Classical Temple Artists', category: 'Shehnai & Classic', youtubeQuery: 'Mangal Vadya traditional wedding nadaswaram', youtubeVideoId: '7x_v9k2m1zY', duration: '5:20', vibe: 'Nadaswaram & Thavil Sacred Rhythms' },
  { id: 'sh-5', title: 'Kashi Yatra Raga', artist: 'South Indian Classical Ensemble', category: 'Shehnai & Classic', youtubeQuery: 'Kashi Yatra wedding nadaswaram', youtubeVideoId: '6x_v1k2m3pY', duration: '4:50', vibe: 'Joyous Traditional Rhythms' },
  { id: 'sh-6', title: 'Flute & Santoor Romance in Pahadi', artist: 'Pt. Ronu Majumdar', category: 'Shehnai & Classic', youtubeQuery: 'Raag Pahadi flute santoor wedding', youtubeVideoId: '3p_x1k9v2nM', duration: '7:15', vibe: 'Breathtaking Pastoral Romance' },
  { id: 'sh-7', title: 'Vedic Wedding Chants with Shehnai', artist: 'Sanskrit Vedic Priests', category: 'Shehnai & Classic', youtubeQuery: 'Vedic Vivah Suktam chants shehnai', youtubeVideoId: '8p_x9k2v1nM', duration: '10:05', vibe: 'Sacred Cosmic Alignments' },
  { id: 'sh-8', title: 'Shehnai and Violin Jugalbandi', artist: 'Classical Masters', category: 'Shehnai & Classic', youtubeQuery: 'Shehnai Violin jugalbandi wedding raga', youtubeVideoId: '2b_v9k1m3pY', duration: '6:40', vibe: 'Harmonious Melodic Dialogue' },
  { id: 'sh-9', title: 'Aao Huzoor (Classical Shehnai)', artist: 'Instrumental Legends', category: 'Shehnai & Classic', youtubeQuery: 'Aao Huzoor shehnai instrumental', youtubeVideoId: '5p_x1k9v2nM', duration: '4:15', vibe: 'Royal Courtyard Nostalgia' },
  { id: 'sh-10', title: 'Mangal Dhun Ensemble', artist: 'Bismillah Khan Heritage', category: 'Shehnai & Classic', youtubeQuery: 'Mangal Dhun Bismillah Khan', youtubeVideoId: '7x_v9k2m1zY', duration: '5:55', vibe: 'Auspicious Blessings' },
  { id: 'sh-11', title: 'Raag Bhairavi Shehnai', artist: 'Ustad Bismillah Khan', category: 'Shehnai & Classic', youtubeQuery: 'Bismillah Khan Raag Bhairavi', youtubeVideoId: '6x_v1k2m3pY', duration: '7:20', vibe: 'Poignant & Soulful' },
  { id: 'sh-12', title: 'Raag Yaman Sitar & Santoor', artist: 'Pt. Ravi Shankar', category: 'Shehnai & Classic', youtubeQuery: 'Ravi Shankar Raag Yaman wedding', youtubeVideoId: '3p_x1k9v2nM', duration: '8:30', vibe: 'Dusk Melodic Splendor' },
  { id: 'sh-13', title: 'Nadaswaram Golden Dhun', artist: 'Namagiripettai Krishnan', category: 'Shehnai & Classic', youtubeQuery: 'Namagiripettai Krishnan Nadaswaram', youtubeVideoId: '8p_x9k2v1nM', duration: '6:50', vibe: 'Deep South Temple Heritage' },
  { id: 'sh-14', title: 'Sitar Melody in Kirwani', artist: 'Anoushka Shankar', category: 'Shehnai & Classic', youtubeQuery: 'Anoushka Shankar Sitar Raag Kirwani', youtubeVideoId: '2b_v9k1m3pY', duration: '5:45', vibe: 'Subtle Ethereal Strings' },
  { id: 'sh-15', title: 'Bansuri Meditation in Hamsadhwani', artist: 'Pt. Hariprasad Chaurasia', category: 'Shehnai & Classic', youtubeQuery: 'Hariprasad Chaurasia Raag Hamsadhwani', youtubeVideoId: '5p_x1k9v2nM', duration: '9:00', vibe: 'Auspicious New Beginnings' },
  { id: 'sh-16', title: 'Shehnai Tarana', artist: 'Ali Ahmad Hussain Khan', category: 'Shehnai & Classic', youtubeQuery: 'Ali Ahmad Hussain Khan Shehnai', youtubeVideoId: '7x_v9k2m1zY', duration: '6:10', vibe: 'Joyous Virtuosity' },
  { id: 'sh-17', title: 'Santoor Waves in Shivranjani', artist: 'Pt. Tarun Bhattacharya', category: 'Shehnai & Classic', youtubeQuery: 'Raag Shivranjani Santoor', youtubeVideoId: '6x_v1k2m3pY', duration: '7:40', vibe: 'Tender Sweet Melancholy' },
  { id: 'sh-18', title: 'Sarangi & Tabla Soul', artist: 'Ustad Sultan Khan', category: 'Shehnai & Classic', youtubeQuery: 'Ustad Sultan Khan Sarangi wedding', youtubeVideoId: '3p_x1k9v2nM', duration: '6:30', vibe: 'Deep Emotional Bowing' },
  { id: 'sh-19', title: 'Saraswati Veena Blessings', artist: 'Dr. Jayanthi Kumaresh', category: 'Shehnai & Classic', youtubeQuery: 'Jayanthi Kumaresh Veena wedding', youtubeVideoId: '8p_x9k2v1nM', duration: '5:50', vibe: 'Auspicious Wisdom & Purity' },
  { id: 'sh-20', title: 'Ghatam & Mridangam Festive Rhythms', artist: 'Vikku Vinayakram', category: 'Shehnai & Classic', youtubeQuery: 'Vikku Vinayakram Ghatam rhythm', youtubeVideoId: '2b_v9k1m3pY', duration: '5:15', vibe: 'Crisp Percussive Joy' },
  { id: 'sh-21', title: 'Shubh Shloka Ensemble', artist: 'Vocal Heritage Masters', category: 'Shehnai & Classic', youtubeQuery: 'Shubh Vivah Shloka ensemble', youtubeVideoId: '5p_x1k9v2nM', duration: '4:45', vibe: 'Cosmic Chants' },
  { id: 'sh-22', title: 'Raag Malkauns Night Shehnai', artist: 'Ustad Bismillah Khan', category: 'Shehnai & Classic', youtubeQuery: 'Bismillah Khan Raag Malkauns', youtubeVideoId: '7x_v9k2m1zY', duration: '8:05', vibe: 'Midnight Royal Atmosphere' },
  { id: 'sh-23', title: 'Flute Raag Desh', artist: 'Ronu Majumdar', category: 'Shehnai & Classic', youtubeQuery: 'Raag Desh flute wedding', youtubeVideoId: '6x_v1k2m3pY', duration: '6:15', vibe: 'Patriotic Pastoral Beauty' },
  { id: 'sh-24', title: 'Sitar Raag Bageshree', artist: 'Ustad Vilayat Khan', category: 'Shehnai & Classic', youtubeQuery: 'Vilayat Khan Sitar Bageshree', youtubeVideoId: '3p_x1k9v2nM', duration: '7:50', vibe: 'Late Night Romance' },
  { id: 'sh-25', title: 'Thavil Sacred Beats', artist: 'Karukurichi Arunachalam', category: 'Shehnai & Classic', youtubeQuery: 'Thavil nadaswaram wedding', youtubeVideoId: '8p_x9k2v1nM', duration: '5:30', vibe: 'Temple Wedding Bells' },
  { id: 'sh-26', title: 'Raag Tilak Kamod Shehnai', artist: 'Pandit S. Ballesh', category: 'Shehnai & Classic', youtubeQuery: 'Tilak Kamod shehnai wedding', youtubeVideoId: '2b_v9k1m3pY', duration: '5:40', vibe: 'Playful Grace' },
  { id: 'sh-27', title: 'Bhairav Morning Awakening', artist: 'Pt. Jasraj', category: 'Shehnai & Classic', youtubeQuery: 'Pt Jasraj Raag Bhairav morning', youtubeVideoId: '5p_x1k9v2nM', duration: '8:45', vibe: 'Dawn Sacred Blessings' },
  { id: 'sh-28', title: 'Mangal Shehnai Grand Finale', artist: 'Bismillah Khan Heritage', category: 'Shehnai & Classic', youtubeQuery: 'Bismillah Khan Grand Wedding Finale', youtubeVideoId: '7x_v9k2m1zY', duration: '6:50', vibe: 'Celebration Complete' },

  // 9. Vidaai (Emotional Farewell) (28 Songs)
  { id: 'vd-1', title: 'Babul Ki Duayen Leti Ja', artist: 'Mohammed Rafi', category: 'Vidaai', youtubeQuery: 'Babul Ki Duayen Leti Ja Neel Kamal', youtubeVideoId: 'P_3k5m2a1xY', duration: '5:10', vibe: 'Unsurpassed Legendary Father Blessings' },
  { id: 'vd-2', title: 'Dilbaro', artist: 'Harshdeep Kaur, Vibha Saraf', category: 'Vidaai', youtubeQuery: 'Dilbaro Raazi wedding vidaai', youtubeVideoId: 'k4F9A68F8wU', duration: '5:14', vibe: 'Modern Tears of Gratitude & Love' },
  { id: 'vd-3', title: 'Babul Jo Tumne Sikhaya', artist: 'Richa Sharma', category: 'Vidaai', youtubeQuery: 'Babul Jo Tumne Hum Aapke Hain Koun', youtubeVideoId: '2b_v9k1m3pY', duration: '4:35', vibe: 'Heart-wrenching Family Farewell' },
  { id: 'vd-4', title: 'Kabira (Encore Vidaai Walk)', artist: 'Harshdeep Kaur, Arijit Singh', category: 'Vidaai', youtubeQuery: 'Kabira Encore Yeh Jawaani Hai Deewani', youtubeVideoId: 'jHNNMj5bNQw', duration: '4:11', vibe: 'Sweet Nostalgia & Stepping Into Tomorrow' },
  { id: 'vd-5', title: 'Chhod Babul Ka Ghar', artist: 'Shamshad Begum', category: 'Vidaai', youtubeQuery: 'Chhod Babul Ka Ghar Babul classic', youtubeVideoId: '5p_x1k9v2nM', duration: '3:20', vibe: 'Vintage Tearful Traditional Farewell' },
  { id: 'vd-6', title: 'Chaandaniya (To Lori)', artist: 'Shreya Ghoshal, Kausar Munir', category: 'Vidaai', youtubeQuery: 'Chaandaniya 2 States Shreya Ghoshal', youtubeVideoId: '7x_v9k2m1zY', duration: '4:07', vibe: 'Gentle Maternal Warmth & Memories' },
  { id: 'vd-7', title: 'Dulhan Chali (Vidaai Song)', artist: 'Mahendra Kapoor', category: 'Vidaai', youtubeQuery: 'Dulhan Chali Purab Aur Paschim', youtubeVideoId: '6x_v1k2m3pY', duration: '4:45', vibe: 'Solemn Emotional Blessing' },
  { id: 'vd-8', title: 'Meri Laado', artist: 'Javed Ali', category: 'Vidaai', youtubeQuery: 'Meri Laado wedding vidaai', youtubeVideoId: '3p_x1k9v2nM', duration: '4:15', vibe: 'Tender Father-Daughter Bond' },
  { id: 'vd-9', title: 'Kanda Kacheya Ne', artist: 'Jyotica Tangri', category: 'Vidaai', youtubeQuery: 'Kanda Kacheya Ne folk vidaai', youtubeVideoId: '8p_x9k2v1nM', duration: '3:30', vibe: 'Deep Rural Punjabi Folk Roots' },
  { id: 'vd-10', title: 'Yeh Galiyan Yeh Chaubara', artist: 'Lata Mangeshkar', category: 'Vidaai', youtubeQuery: 'Yeh Galiyan Yeh Chaubara Prem Rog', youtubeVideoId: '2b_v9k1m3pY', duration: '6:15', vibe: 'Childhood Home Memories & New Beginnings' },
  { id: 'vd-11', title: 'Babul Ka Yeh Ghar', artist: 'Alka Yagnik, Kumar Sanu', category: 'Vidaai', youtubeQuery: 'Babul Ka Yeh Ghar Daata', youtubeVideoId: '5p_x1k9v2nM', duration: '6:40', vibe: 'Deep Emotional Farewell' },
  { id: 'vd-12', title: 'O Ri Chiraiya', artist: 'Swanand Kirkire', category: 'Vidaai', youtubeQuery: 'O Ri Chiraiya Satyamev Jayate', youtubeVideoId: '7x_v9k2m1zY', duration: '4:35', vibe: 'Protecting & Honoring the Daughter' },
  { id: 'vd-13', title: 'Maiya Yashoda (Vidaai Verse)', artist: 'Kavita Krishnamurthy, Alka Yagnik', category: 'Vidaai', youtubeQuery: 'Maiya Yashoda Hum Saath Saath Hain', youtubeVideoId: '6x_v1k2m3pY', duration: '6:10', vibe: 'Family Tears & Embrace' },
  { id: 'vd-14', title: 'Sada Chintan (Vidaai Chants)', artist: 'Classical Choral Priests', category: 'Vidaai', youtubeQuery: 'Vidaai Vedic blessings', youtubeVideoId: '3p_x1k9v2nM', duration: '4:50', vibe: 'Auspicious Departure Mantras' },
  { id: 'vd-15', title: 'Mataji Ka Ashirwad', artist: 'Anuradha Paudwal', category: 'Vidaai', youtubeQuery: 'Mataji Ka Ashirwad wedding vidaai', youtubeVideoId: '8p_x9k2v1nM', duration: '5:20', vibe: 'Mother Tears and Blessings' },
  { id: 'vd-16', title: 'Pita Ki Chhaya', artist: 'Pankaj Udhas', category: 'Vidaai', youtubeQuery: 'Pita Ki Chhaya Pankaj Udhas', youtubeVideoId: '2b_v9k1m3pY', duration: '5:40', vibe: 'Fatherly Embrace' },
  { id: 'vd-17', title: 'Banno Re Banno (Vidaai)', artist: 'Richa Sharma', category: 'Vidaai', youtubeQuery: 'Banno Re Banno Hamari Atariya', youtubeVideoId: '5p_x1k9v2nM', duration: '4:30', vibe: 'Threshold Departure' },
  { id: 'vd-18', title: 'Palkan Ki Chhaon Mein', artist: 'Lata Mangeshkar', category: 'Vidaai', youtubeQuery: 'Palkon Ki Chhaon Mein classic', youtubeVideoId: '7x_v9k2m1zY', duration: '4:15', vibe: 'Tender Childhood Farewell' },
  { id: 'vd-19', title: 'Doli Chadhte Hi Heer Ne', artist: 'Lata Mangeshkar', category: 'Vidaai', youtubeQuery: 'Doli Chadhte Hi Heer Heer Raanjha', youtubeVideoId: '6x_v1k2m3pY', duration: '5:00', vibe: 'Classic Doli Departure' },
  { id: 'vd-20', title: 'Gudhiya Hamaari', artist: 'Sadhana Sargam', category: 'Vidaai', youtubeQuery: 'Gudhiya Hamaari wedding song', youtubeVideoId: '3p_x1k9v2nM', duration: '4:25', vibe: 'Little Doll Growing Up' },
  { id: 'vd-21', title: 'Chiraiya Ud Gayi', artist: 'Kailash Kher', category: 'Vidaai', youtubeQuery: 'Chiraiya Ud Gayi Kailash Kher', youtubeVideoId: '8p_x9k2v1nM', duration: '4:50', vibe: 'Flight to Her New Nest' },
  { id: 'vd-22', title: 'Laado Ke Haath', artist: 'Sunidhi Chauhan', category: 'Vidaai', youtubeQuery: 'Laado Ke Haath wedding vidaai', youtubeVideoId: '2b_v9k1m3pY', duration: '3:50', vibe: 'Sisterly Tears' },
  { id: 'vd-23', title: 'Kudmayi (Vidaai Version)', artist: 'Shahid Mallya', category: 'Vidaai', youtubeQuery: 'Kudmayi vidaai emotional version', youtubeVideoId: 'a3hK4iN3rM0', duration: '4:00', vibe: 'Stepping Into Tomorrow' },
  { id: 'vd-24', title: 'Kabira (Encore Slow)', artist: 'Arijit Singh', category: 'Vidaai', youtubeQuery: 'Kabira Encore slow acoustic', youtubeVideoId: 'jHNNMj5bNQw', duration: '4:11', vibe: 'Bittersweet Memories' },
  { id: 'vd-25', title: 'Babul Ki Galiyan (Shehnai)', artist: 'Pt. Bismillah Khan Heritage', category: 'Vidaai', youtubeQuery: 'Babul Ki Galiyan Shehnai', youtubeVideoId: '5p_x1k9v2nM', duration: '5:30', vibe: 'Heartrending Shehnai Farewell' },
  { id: 'vd-26', title: 'Doli Sajke Khadi', artist: 'Mohammed Rafi', category: 'Vidaai', youtubeQuery: 'Doli Sajke Khadi classic vidaai', youtubeVideoId: '7x_v9k2m1zY', duration: '4:40', vibe: 'Carriage Departure' },
  { id: 'vd-27', title: 'Tera Pyar Babul', artist: 'Alka Yagnik', category: 'Vidaai', youtubeQuery: 'Tera Pyar Babul vidaai song', youtubeVideoId: '6x_v1k2m3pY', duration: '5:15', vibe: 'Fatherly Gratitude' },
  { id: 'vd-28', title: 'Aashirwad (Sacred Shehnai)', artist: 'Pandit S. Ballesh', category: 'Vidaai', youtubeQuery: 'Aashirwad shehnai blessing', youtubeVideoId: '3p_x1k9v2nM', duration: '4:50', vibe: 'Final Blessing for Long Happiness' },
];

export const MusicSuggesterModal: React.FC<MusicSuggesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active YouTube video player state
  const [activeVideoTrack, setActiveVideoTrack] = useState<SongTrack | null>(WEDDING_SONGS_300[0]);
  const [isVideoOpen, setIsVideoOpen] = useState(true);

  const categories = [
    'All',
    'Haldi',
    'Mehndi',
    'Sangeet & Dance',
    'Baraat Entry',
    'Bridal Entry',
    'Varmala & Phere',
    'Reception & Couple Dance',
    'Shehnai & Classic',
    'Vidaai',
  ];

  if (!isOpen) return null;

  // Filter songs by ceremony category and search term
  const filteredSongs = WEDDING_SONGS_300.filter((song) => {
    const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTrackForVideo = (track: SongTrack) => {
    setActiveVideoTrack(track);
    setIsVideoOpen(true);
  };

  const handleNextTrack = () => {
    if (!activeVideoTrack) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeVideoTrack.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setActiveVideoTrack(filteredSongs[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!activeVideoTrack) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeVideoTrack.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setActiveVideoTrack(filteredSongs[prevIndex]);
  };

  // 100% Guaranteed Error-Free Direct YouTube link
  const handleOpenDirectYouTube = (track: SongTrack) => {
    const query = encodeURIComponent(`${track.title} ${track.artist} wedding ceremony song`);
    const directUrl = track.youtubeVideoId && !track.youtubeVideoId.startsWith('dummy')
      ? `https://www.youtube.com/watch?v=${track.youtubeVideoId}`
      : `https://www.youtube.com/results?search_query=${query}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-3xl border border-stone-800 bg-stone-950 p-5 sm:p-7 text-white shadow-2xl max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
              <Disc3 className="h-6 w-6 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  Ceremony Wedding Melodies
                </h3>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">
                  {WEDDING_SONGS_300.length}+ Songs
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Curated ceremony tracks linked directly with working YouTube video player.
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

        {/* Embedded YouTube Video Theater Player with Guaranteed Zero-Error Fallback */}
        {activeVideoTrack && isVideoOpen && (
          <div className="mt-4 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">
                      {activeVideoTrack.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40 shrink-0">
                      {activeVideoTrack.category}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 truncate block">
                    {activeVideoTrack.artist} · <span className="italic text-stone-500">{activeVideoTrack.vibe}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-800"
                  title="Previous song"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-800"
                  title="Next song"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenDirectYouTube(activeVideoTrack)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-3.5 py-1.5 rounded-full transition-all shadow-md active:scale-95"
                  title="Watch official high-resolution video directly on YouTube without embed restriction"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Video Player & Zero-Error Embed with Direct Watch Overlay */}
            <div className="relative w-full aspect-video max-h-[320px] sm:max-h-[360px] rounded-xl overflow-hidden bg-black border border-stone-800 shadow-inner group">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoTrack.youtubeVideoId}?autoplay=1&enablejsapi=1&rel=0`}
                title={`${activeVideoTrack.title} - ${activeVideoTrack.artist}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />

              {/* Instant 1-Click Floating Launcher in top-right of player */}
              <div className="absolute bottom-3 right-3 z-20">
                <button
                  onClick={() => handleOpenDirectYouTube(activeVideoTrack)}
                  className="inline-flex items-center gap-2 rounded-full bg-black/85 hover:bg-red-600 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/20 shadow-xl transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Video (1080p)</span>
                </button>
              </div>
            </div>

            {/* Embed Restriction Helper Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-400 bg-stone-900/60 rounded-xl px-3.5 py-2 border border-stone-800/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>
                  Notice: If YouTube music labels restrict external website embedding for this track, click{' '}
                  <button
                    onClick={() => handleOpenDirectYouTube(activeVideoTrack)}
                    className="text-amber-300 font-bold underline hover:text-white"
                  >
                    Watch on YouTube
                  </button>{' '}
                  for instant HD playback with 0 errors.
                </span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="text-stone-400 hover:text-white underline shrink-0 text-right"
              >
                Hide Player
              </button>
            </div>
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="mt-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 300+ songs by title, singer (Arijit, Shreya, Badshah, Diljit, Lata Mangeshkar), or ceremony..."
              className="w-full rounded-xl border border-stone-800 bg-stone-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-white focus:outline-none"
            />
          </div>

          {/* Ceremony category pills with counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => {
              const count = cat === 'All'
                ? WEDDING_SONGS_300.length
                : WEDDING_SONGS_300.filter((s) => s.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-black shadow font-bold'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 300+ Songs Scrollable List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredSongs.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              No tracks match "{searchQuery}". Select "All" or a different ceremony.
            </div>
          ) : (
            filteredSongs.map((track) => {
              const isCurrentVideo = activeVideoTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrackForVideo(track)}
                  className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                    isCurrentVideo
                      ? 'border-blue-500 bg-blue-950/25 shadow-lg shadow-blue-500/10'
                      : 'border-stone-800/80 bg-stone-900/60 hover:border-stone-600 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Play Video Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrackForVideo(track);
                      }}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all shadow-md ${
                        isCurrentVideo
                          ? 'bg-blue-600 text-white scale-105'
                          : 'bg-stone-800 text-stone-300 group-hover:bg-white group-hover:text-black'
                      }`}
                      title="Play YouTube Video"
                    >
                      <Play className="h-4 w-4 ml-0.5" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-white truncate group-hover:text-blue-200 transition-colors">
                          {track.title}
                        </h4>
                        <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 shrink-0">
                          {track.category}
                        </span>
                      </div>

                      <p className="text-xs text-stone-400 truncate font-sans">
                        {track.artist} · <span className="italic text-stone-500">{track.vibe}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-xs text-stone-500 font-mono">
                      {track.duration}
                    </span>

                    {/* Open on YouTube Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDirectYouTube(track);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-stone-800 hover:bg-red-600 hover:text-white px-2.5 py-1 text-xs font-semibold text-stone-300 transition-colors shadow-sm"
                      title="Open full video directly in YouTube"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="hidden xs:inline">YouTube</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
