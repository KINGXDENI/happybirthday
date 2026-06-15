// Cinematic flow variables
export const SECRET_PIN = "2308"; // 23 Agustus (Special date)

export const introTexts = [
  "Once strangers...",
  "Now, my everything.",
  "Happy Birthday, Keiza."
];

export interface SceneData {
  id: number;
  title: string;
  description: string;
  image: string;
  note?: string;
  date?: string;
}

export const scenes: SceneData[] = [
  {
    id: 1,
    title: "Habis Olahraga Tetep Cantik",
    description: "Foto selfie kamu pakai baju hitam olahraga dengan sisa keringat di wajah. Alih-alih keliatan capek, kamu malah keliatan seger dan manis banget dengan senyuman tipis itu.",
    image: "/keiza/1.jpeg",
    note: "Dulu pas awal mabar ML bareng temennya Firas, aku gak nyangka senyum manis ini yang bakal menemani hari-hariku sekarang.",
    date: "Post-Workout Glow — Jul 2025"
  },
  {
    id: 2,
    title: "Senyum Manis Kalem",
    description: "Foto selfie santai kamu pakai kaos putih sambil mengenakan kalung. Rambut panjangmu yang digerai natural dan tatapan matamu yang teduh bener-bener bikin adem yang melihatnya.",
    image: "/keiza/2.jpeg",
    note: "Inget gak pas kita telponan bertiga di Line sampai larut malam? Kamu cerita panjang lebar tentang tugas-tugas kuliahmu sambil cemberut lucu.",
    date: "Casual Vibe — Agt 2025"
  },
  {
    id: 3,
    title: "Pose Cemberut Gemes",
    description: "Foto kamu pakai kaos pink dengan ekspresi muka cemberut, bibir dimajuin (pouty face), dan mata melirik ke samping. Latar belakang bingkai foto piagam di dinding bikin momen ini kerasa rumahan banget.",
    image: "/keiza/3.jpeg",
    note: "Meskipun dulu sikapku di chat TikTok dingin kayak kulkas, aslinya tiap kali kamu post video OOTD baru langsung aku tonton berkali-kali.",
    date: "Pouty Expression — Agt 2025"
  },
  {
    id: 4,
    title: "Mata Merem & Nunjuk Pipi",
    description: "Gaya andalan kamu yang super menggemaskan! Selfie sambil merem manis, senyum lebar, dan jari telunjuk nempel di pipi tembammu yang lucu.",
    image: "/keiza/4.jpeg",
    note: "Aku bersyukur banget hari itu (23 Agustus 2025) kamu beraniin diri confess ke aku di tengah sikap cuekku. Terima kasih ya sayang sudah memilihku menjadi pacarmu.",
    date: "Anniversary — 23 Agt 2025"
  },
  {
    id: 5,
    title: "4 Grid Kacamata Bulat",
    description: "Kompilasi 4 foto (grid) pas kamu lagi tiduran pakai kacamata bulat besar. Mulai dari pose datar, senyum, sampai kedip sebelah mata (*wink*), semuanya berhasil borong keimutan borongan!",
    image: "/keiza/5.jpeg",
    note: "Semoga di usiamu yang baru ini, kamu selalu diberi kemudahan, kesehatan, dan kebahagiaan yang melimpah. Aku akan selalu ada di sini buat kamu.",
    date: "Four Shades of Cute — Jun 2026"
  }
];

export const songDetails = {
  title: "Perfect",
  artist: "Ed Sheeran",
  cover: "/lucu.jpg"
};

export const finalMessage = {
  title: "Happy Birthday Sayang!",
  message: "Di hari spesialmu ini, 15 Juni, terima kasih sudah menjadi bagian terindah dalam hidupku. Semoga di umur yang baru ini, kamu makin bahagia, makin sukses, dan tetap menjadi kamu yang apa adanya. Aku selalu ada di sini buat dukung kamu. I love you to the moon and back! 🌙✨",
  signature: "Deni ❤️"
};

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'other';
  delay: number;
}

export const chatMessages: ChatMessage[] = [
  { id: 1, text: "Haiii! ❤️", sender: "other", delay: 1000 },
  { id: 2, text: "Hari ini hari apa coba? 👀", sender: "other", delay: 1500 },
  { id: 3, text: "Hari ulang tahun kamu! 🎉", sender: "me", delay: 1000 }
];

// WhatsApp script variables
export interface ChatStep {
  id: string;
  sender: 'partner' | 'user' | 'system';
  type: 'text' | 'image' | 'voice' | 'card';
  content?: string;
  mediaUrl?: string;
  title?: string;
  duration?: string; // for voice note
  options?: string[]; // user reply choices
  delay?: number; // millisecond delay before typing starts or message appears
}

export const chatSteps: ChatStep[] = [
  {
    id: 'sys-1',
    sender: 'system',
    type: 'text',
    content: 'Pesan dan panggilan didekripsi secara akhir-ke-akhir. Tidak ada orang di luar chat ini, bahkan WhatsApp, yang dapat membaca atau mendengarnya, ketuk untuk info selengkapnya.'
  },
  {
    id: 'msg-1',
    sender: 'partner',
    type: 'text',
    content: 'Haiii!',
    delay: 1000
  },
  {
    id: 'msg-2',
    sender: 'partner',
    type: 'text',
    content: 'Hari ini hari apa coba?',
    delay: 1500,
    options: ['Hari ulang tahun aku!', 'Hari spesial kita?']
  },
  {
    id: 'msg-3',
    sender: 'partner',
    type: 'text',
    content: 'Hehe iya bener banget! Selamat ulang tahun ya sayang.',
    delay: 1200
  },
  {
    id: 'msg-4',
    sender: 'partner',
    type: 'text',
    content: 'Aku punya sesuatu buat kamu. Kita kilas balik kenangan kita yuk?',
    delay: 1500,
    options: ['Yuk, aku mau lihat', 'Wah apa tuh? Jadi penasaran']
  },
  {
    id: 'msg-5',
    sender: 'partner',
    type: 'text',
    content: 'Inget nggak pas pertama kali kenal? Di game Mobile Legends lewat temennya Firas. Terus kita mabar bareng.',
    delay: 1800,
    options: ['Iya, mabar seru banget dulu', 'Awal mula segalanya ya']
  },
  {
    id: 'msg-6',
    sender: 'partner',
    type: 'text',
    content: 'Hahaha iya! Lanjut dari situ kita saling bagi kontak Line.',
    delay: 1500
  },
  {
    id: 'msg-7',
    sender: 'partner',
    type: 'text',
    content: 'Terus kita buat grup bertiga bareng Firas, dan kita sering banget voice call bertiga sampai larut malam.',
    delay: 2000,
    options: ['Iya, telponan bertiga seru parah', 'Firas jadi obat nyamuk terus haha']
  },
  {
    id: 'msg-8',
    sender: 'partner',
    type: 'text',
    content: 'Iya kasihan Firas, tapi seru! Oiya, dengerin ini deh, ada rekaman suara buat kamu...',
    delay: 1500
  },
  {
    id: 'msg-9',
    sender: 'partner',
    type: 'voice',
    mediaUrl: '',
    duration: '0:18',
    delay: 1800,
    options: ['Mau dengerin terus setiap hari', 'Jadi kangen denger suaramu']
  },
  {
    id: 'msg-10',
    sender: 'partner',
    type: 'text',
    content: 'Hehe. Nah, terus pas waktu itu kita juga saling follow-followan TikTok.',
    delay: 1500
  },
  {
    id: 'msg-11',
    sender: 'partner',
    type: 'text',
    content: 'Tapi dulu sikapku ke kamu cuek dan dingin banget ya kayak kulkas...',
    delay: 2000,
    options: ['Iya ih, kesel banget dulu!', 'Tapi aslinya salting kan?']
  },
  {
    id: 'msg-12',
    sender: 'partner',
    type: 'text',
    content: 'Hahaha untung akhirnya kamu beraniin diri buat confess ke aku tanggal 23 Agustus.',
    delay: 1500
  },
  {
    id: 'msg-13',
    sender: 'partner',
    type: 'text',
    content: 'Dan nggak nyangka, sejak hari jadian kita itu, kita awet terus sampai sekarang.',
    delay: 2000,
    options: ['Keputusan terbaik kita', 'Aku beruntung miliki kamu']
  },
  {
    id: 'msg-14',
    sender: 'partner',
    type: 'text',
    content: 'Aku juga beruntung banget ada kamu di hidupku.',
    delay: 1500
  },
  {
    id: 'msg-14a',
    sender: 'partner',
    type: 'text',
    content: 'Terus kamu tahu nggak? Kamu selalu berhasil bikin aku terpana belakangan ini. Beruntung banget rasanya.',
    delay: 2000,
    options: ['Aamiin, makasih banyak sayang ❤️', 'Bisa aja sih gombalnya!']
  },
  {
    id: 'msg-15',
    sender: 'partner',
    type: 'text',
    content: 'Terakhir, aku punya surat khusus buat kamu. Tolong dibuka ya.',
    delay: 1800
  },
  {
    id: 'msg-16',
    sender: 'partner',
    type: 'card',
    title: 'Surat Spesial Ulang Tahun',
    content: 'Klik untuk membuka surat dari Deni.',
    delay: 1000
  }
];
