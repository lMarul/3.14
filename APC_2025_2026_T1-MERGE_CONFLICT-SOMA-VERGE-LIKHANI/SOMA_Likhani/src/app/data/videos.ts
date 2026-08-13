export interface Video {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  videoUrl: string;
  theory: string;
  genre: string;
  role: string;
  logline: string;
  releaseDate: string;
  views: number;
  likes: number;
  ageRating?: "G" | "PG" | "PG-13" | "R" | "18+";
  director?: string;
  cast?: Array<{ name: string; role: string }>;
}

export const videoData: Record<string, Video[]> = {
  animation: [
    {
      id: "anim-1",
      title: "Love at First Kill",
      author: "ketzel|Melaiza Ballesteros",
      thumbnail: "https://images.unsplash.com/photo-1604033384965-34604e3c78b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "2:47",
      videoUrl: "https://www.youtube.com/watch?v=Tz38yiSsTg4",
      theory: "Queer Theory, Zombie Apocalyptic Theory",
      genre: "Animation, Romance",
      role: "Director / Creator",
      logline: "zombie apocalypse lesbians, that's it, that's the story.",
      releaseDate: "2013-07-11",
      views: 12500,
      likes: 4500,
      ageRating: "R",
      director: "ketzel",
      cast: [
        { name: "Melaiza Ballesteros", role: "Voice Actor" },
        { name: "ketzel", role: "Animator" },
        { name: "Alex Cruz", role: "Sound Designer" }
      ]
    },
    {
      id: "anim-2",
      title: "Deadly Pursuit",
      author: "QW4TRO STUDIOS - Borje, Clemente, Dela Cruz, Paragua",
      thumbnail: "https://images.unsplash.com/photo-1576307302704-b6142d572612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "2:44",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      theory: "Formalism",
      genre: "Action, Thriller",
      role: "Animation Lead",
      logline: "A high-stakes chase through a futuristic cityscape where every second counts in a race against time.",
      releaseDate: "2024-01-12",
      views: 3200,
      likes: 850,
      director: "Borje",
      cast: [
        { name: "Clemente", role: "Lead Animator" },
        { name: "Dela Cruz", role: "Character Designer" },
        { name: "Paragua", role: "Background Artist" },
        { name: "Borje", role: "Storyboard Artist" }
      ]
    },
    {
      id: "anim-3",
      title: "Me Time",
      author: "Kwentong Barbero",
      thumbnail: "https://images.unsplash.com/photo-1702360174953-b9d72d5ddba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "2:27",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      theory: "Folkloric Analysis",
      genre: "Horror, Suspense",
      role: "Horror",
      logline: "A suspenseful short following a quiet moment that turns into an unexpected encounter.",
      releaseDate: "2014-11-03",
      views: 0,
      likes: 12000,
      ageRating: "18+",
      director: "Kwentong Barbero",
      cast: [
        { name: "Maria Reyes", role: "Lead Actress" },
        { name: "Juan Santos", role: "Supporting Actor" },
        { name: "Kwentong Barbero", role: "Writer/Director" },
        { name: "Ana Lopez", role: "Sound Design" }
      ]
    },
    {
      id: "anim-4",
      title: "Stargirl's Magical Delay",
      author: "Stargirl Productions: Andaya, Baylon, Causaren, Generoso",
      thumbnail: "https://images.unsplash.com/photo-1616243850919-e75024626543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "3:29",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      theory: "Queer Theory, Heroic Transformaytion",
      genre: "LGBTQ1+, Candy Pop, Fantasy",
      role: "Fantasy",
      logline: "A short about two characters in a fantasy world.",
      releaseDate: "2014-11-03",
      views: 0,
      likes: 12000,
      director: "Andaya",
      cast: [
        { name: "Baylon", role: "Animation Director" },
        { name: "Causaren", role: "Character Animator" },
        { name: "Generoso", role: "Visual Effects" },
        { name: "Andaya", role: "Story Artist" }
      ]
    },
    {
      id: "anim-5",
      title: "BOXED",
      author: "Agatha Marie Bequillo, Xavier Jonathan Badong",
      thumbnail: "https://images.unsplash.com/photo-1691351943492-cfee023e9cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "3:32",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      theory: "Cat",
      genre: "Psychological, Comedy",
      role: "Fantasy",
      logline: "A short about a cat.",
      releaseDate: "2014-11-03",
      views: 0,
      likes: 12000,
      director: "Agatha Marie Bequillo",
      cast: [
        { name: "Xavier Jonathan Badong", role: "Co-Director" },
        { name: "Agatha Marie Bequillo", role: "Animator/Writer" },
        { name: "Rico Fernandez", role: "Voice Actor" },
        { name: "Jasmine Torres", role: "Music Composer" }
      ]
    }
  ],
  liveAction: [
    {
      id: "live-1",
      title: "Saan Tayo Pupunta",
      author: "Sofia Cassandra Borje",
      thumbnail: "https://images.unsplash.com/photo-1767805035616-77c646633f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "13:00",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      theory: "Existentialism",
      genre: "Drama",
      role: "Writer",
      logline: "A boy tries to go back to his Lolo's hometown to find a sense of belonging in a world that keeps moving forward.",
      releaseDate: "2025-02-09",
      views: 8900,
      likes: 2100,
      director: "Sofia Cassandra Borje",
      cast: [
        { name: "Marco Reyes", role: "Lead Actor" },
        { name: "Rosa Santos", role: "Supporting Actress" },
        { name: "Carlos Mendoza", role: "Cinematographer" },
        { name: "Lisa Tan", role: "Production Designer" }
      ]
    },
    {
      id: "live-2",
      title: "Kalesa",
      author: "Alyannah Jaira Generoso",
      thumbnail: "https://images.unsplash.com/photo-1687677347924-a2ffcc5a6ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "5:45",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      theory: "Realism",
      genre: "Drama",
      role: "Writer",
      logline: "An exploration of the unseen moments that define a filmmaker's journey through the bustling streets of Manila.",
      releaseDate: "2025-12-15",
      views: 6700,
      likes: 1540,
      director: "Alyannah Jaira Generoso",
      cast: [
        { name: "Ernesto Silva", role: "Lead Actor" },
        { name: "Carmen Dela Rosa", role: "Supporting Actress" },
        { name: "Alyannah Jaira Generoso", role: "Writer/Director" },
        { name: "Miguel Santos", role: "Director of Photography" }
      ]
    }
  ],
  documentaries: [
    {
      id: "doc-1",
      title: "Wings of Valor",
      author: "Sean Amiel Magalong",
      thumbnail: "https://images.unsplash.com/photo-1757858566491-fd79177928db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      duration: "45:00",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      theory: "Bill Nichols and Trinh T. Minh-ha",
      genre: "Documentary",
      role: "Director",
      logline: "To show the Filipino youth that 'Aviation Heroism' is not an overnight miracle, but a result of Perseverance, Creative Learning, and Community Support. This film seeks to redefine heroism for a new generation leaving them with a profound appreciation for the men and women who turn the Philippine sky into a canvas of valor.",
      releaseDate: "2026-02-10",
      views: 3400,
      likes: 920,
      director: "Sean Amiel Magalong",
      cast: [
        { name: "Captain Roberto Cruz", role: "Featured Pilot" },
        { name: "Anna Valdez", role: "Interviewer" },
        { name: "James Lim", role: "Camera Operator" },
        { name: "Patricia Gomez", role: "Editor" }
      ]
    }
  ]
};

export const getAllVideos = () => {
  return Object.values(videoData).flat();
};

export const getVideoById = (id: string) => {
  return getAllVideos().find(v => v.id === id);
};