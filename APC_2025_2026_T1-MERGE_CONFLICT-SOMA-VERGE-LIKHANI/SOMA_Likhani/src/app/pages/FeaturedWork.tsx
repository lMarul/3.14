import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { usePublishedMedia, useSiteConfig } from "../hooks/useLikhaniData";
import { Play, Heart, Eye, Film, Quote, User } from "lucide-react";
import { VideoCard } from "../components/media/VideoCard";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { BackButton } from "../components/navigation/BackButton";
import { SiteFooter } from "../components/layout/SiteFooter";

// ─── Unsplash production still images ───────────────────────────────────────
const STILL_1 = "https://images.unsplash.com/photo-1702126952856-f366d8cb5462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";
const STILL_2 = "https://images.unsplash.com/photo-1730641884360-0f6bb86e70e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";
const STILL_3 = "https://images.unsplash.com/photo-1643651387452-101da4784cc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";
const CREATOR_PORTRAIT = "https://images.unsplash.com/photo-1674507887257-589c5b3b9ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=480&q=80";

// Archive process frame images (Storyboard · Lighting · Final Composite)
const FRAME_1 = "https://images.unsplash.com/photo-1685463894505-d33387aa8430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";
const FRAME_2 = "https://images.unsplash.com/photo-1762028893554-d4c6b6721057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";
const FRAME_3 = "https://images.unsplash.com/photo-1661313563001-c689cc83790c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isYouTubeUrl(url: string | null | undefined): boolean {
  return !!url && (url.includes("youtube.com") || url.includes("youtu.be"));
}
function getYouTubeVideoId(url: string) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ─── Editorial content per video ─────────────────────────────────────────────
const editorialContent: Record<string, {
  curatorNote: string;
  aboutWork: string;
  directorNote: string;
  productionContext: string;
  whyFeatured: string;
  creatorProfile: string;
  stillCaptions: [string, string, string];
}> = {
  "anim-3": {
    curatorNote: "An exceptional work of suspense animation demonstrating mastery of psychological pacing and atmospheric sound design. Selected for its outstanding technical and thematic execution.",
    aboutWork: "Me Time transforms an ordinary moment of solitude into a building exercise in dread — eschewing jump-scare mechanics in favor of environmental tension, slow compositions, and deliberate sound layering that forces the viewer into uncomfortable intimacy with the protagonist's unraveling perception.\n\nThe narrative operates on two registers simultaneously: the surface-level horror of an unexpected intrusion, and the deeper psychological horror of isolation itself.",
    directorNote: "This film started from a very personal place — those quiet moments when you're alone and become hyperaware of every small sound around you. I wanted to explore whether animation could carry that kind of intimate terror without conventional horror tropes. The challenge was restraint: doing less to create more.",
    productionContext: "Produced over eight weeks as part of the APC-SoMA Advanced Animation Studio course. Me Time was developed by Kwentong Barbero as a solo directorial project with collaborative support from the school's sound design department, using hand-drawn character animation composited over digitally painted environments.",
    whyFeatured: "Me Time demonstrates that effective horror requires craft, patience, and directorial vision — not elaborate effects. It stands as a reference work for students exploring tension-driven narrative structure and the expressive potential of silence in animated storytelling.",
    creatorProfile: "Kwentong Barbero is a student animator and narrative director at APC-SoMA, specialising in psychological short-form animation. Their work consistently explores the relationship between environmental sound and emotional unease.",
    stillCaptions: ["Pre-production storyboard development", "Character animation keyframe study", "Sound design and compositing session"],
  },
  "anim-4": {
    curatorNote: "A visually joyful and technically precise animation demonstrating collaborative world-building at a high level. Selected for its creative ambition and cohesive team execution.",
    aboutWork: "Stargirl's Magical Delay constructs a richly textured fantastical universe within a compact runtime, drawing from Queer Theory and the heroic transformation tradition. The result is a protagonist journey that is simultaneously playful and sincere.\n\nThe animation achieves a careful tonal balance: visually exuberant enough to feel celebratory, yet restrained enough in its narrative arc to carry genuine emotional weight.",
    directorNote: "We wanted to make something that felt genuinely joyful — not hollow, but acknowledging why joy can be hard-won. The transformation sequence was our central design challenge: how do you make something visually spectacular that also feels emotionally earned?",
    productionContext: "Produced as a collaborative studio project with four principal contributors each leading a distinct production area — story and direction, character animation, visual effects, and background art. The team developed a shared visual language in pre-production, a discipline reflected clearly in the final work's consistency.",
    whyFeatured: "The work is featured for its demonstration of effective creative collaboration under a unified directorial vision — showing how a small team can produce work with the visual coherence and thematic clarity of a single-author project.",
    creatorProfile: "Stargirl Productions is a four-person collaborative collective formed within APC-SoMA's animation programme. The team specialises in identity-driven fantasy narratives and character-led short-form animation.",
    stillCaptions: ["Character concept art and colour studies", "Collaborative pre-production workshop", "Animation timing and motion review"],
  },
  "doc-1": {
    curatorNote: "A documentary of significant institutional relevance at the intersection of aviation, perseverance, and Filipino identity. Featured for its journalistic discipline and contribution to the archive's non-fiction collection.",
    aboutWork: "Wings of Valor reframes aviation heroism not as spectacle, but as the product of sustained community effort, creative learning, and personal perseverance — following Filipino aviation figures whose stories have remained largely outside mainstream documentation.\n\nThe director's intent to redefine heroism for a new generation is reflected in structural choices throughout: the film consistently foregrounds the human relationships that enable exceptional achievement.",
    directorNote: "I grew up hearing about Filipino pilots and aviation pioneers, but their stories were always told as individual triumphs. The more research I did, the more I realised that every achievement depended on a community — teachers, mentors, families, fellow students. The film is really about that invisible scaffolding.",
    productionContext: "Produced by Sean Amiel Magalong as a thesis documentary project requiring over three months of pre-production research and six weeks of principal production. The film incorporated archival materials, original interviews, and observational footage, requiring coordination with aviation institutions and community organisations.",
    whyFeatured: "Wings of Valor is featured for its research depth, structural maturity, and meaningful contribution to the documentation of Filipino aviation culture. It demonstrates what a student documentary can achieve when rooted in genuine investigative curiosity.",
    creatorProfile: "Sean Amiel Magalong is a documentary filmmaker and researcher at APC-SoMA, focusing on Filipino cultural identity and institutional history. His work prioritises archival research and community testimony as storytelling foundations.",
    stillCaptions: ["Archival research and material review", "Subject interview and field production", "Post-production edit and audio mix"],
  },
};

const defaultEditorial = {
  curatorNote: "A carefully crafted multimedia work selected for its demonstration of technical skill, thematic clarity, and the intentional storytelling that defines the strongest student work produced within APC-SoMA.",
  aboutWork: "This work represents a significant achievement in student multimedia production, demonstrating a clear command of formal genre conventions while introducing a distinctive creative perspective. The director demonstrates an ability to work within structural constraints while maintaining a strong personal voice.\n\nViewed as a whole, it contributes meaningfully to the ongoing conversation within APC-SoMA about what student filmmaking can and should aspire to be.",
  directorNote: "Every creative choice in this film was made in service of a single emotional truth. We wanted the audience to leave with something they couldn't fully articulate — a feeling that lingered longer than the images. Whether we achieved that is for the viewer to decide.",
  productionContext: "This work was produced as part of the APC-SoMA curriculum under faculty supervision and endorsement. The production involved a collaborative team working across pre-production, principal photography or animation, and post-production over a full semester.",
  whyFeatured: "This work is featured in the Likhani Archive Spotlight for its demonstration of clarity of vision, technical discipline, and purposeful storytelling — the qualities the archive most values.",
  creatorProfile: "A student filmmaker and multimedia artist at APC-SoMA, working within the school's faculty-endorsed production programme. Their work is characterised by intentional narrative structure and disciplined visual design.",
  stillCaptions: ["Pre-production planning and development", "Principal photography or animation production", "Post-production and final assembly"] as [string, string, string],
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ThumbnailPlaceholder({ title, isDark }: { title: string; isDark: boolean }) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isLightsOut = currentTheme === 'lights-out';
  const isDim = currentTheme === 'dim';

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center select-none ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-[#e4e0d8]"}`}>
      <Film className={`w-8 h-8 mb-2 opacity-20 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
      <p className={`font-['Poppins'] text-[11px] text-center px-4 leading-snug opacity-25 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        {title}
      </p>
    </div>
  );
}

// Production still card — image with caption
function StillCard({ src, caption, index, isDark }: { src: string; caption: string; index: number; isDark: boolean }) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isLightsOut = currentTheme === 'lights-out';
  const isDim = currentTheme === 'dim';
  
  const [err, setErr] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative w-full overflow-hidden rounded-lg ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-[#e4e0d8]"}`}
        style={{ aspectRatio: "4 / 3" }}
      >
        {!err ? (
          <img
            src={src}
            alt={caption}
            className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className={`w-6 h-6 opacity-20 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
        )}
        {/* archive-style frame number */}
        <span className={`absolute top-2 left-2 font-['Poppins'] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${isDark ? "bg-black/60 text-gray-400" : "bg-white/70 text-gray-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className={`font-['Poppins'] text-[11px] leading-snug ${isDark ? "text-gray-600" : "text-gray-400"}`}>
        {caption}
      </p>
    </div>
  );
}

// Related archive entry card — minimal, editorial
function RelatedCard({ video, isDark, primaryRed, navigate }: { video: any; isDark: boolean; primaryRed: string; navigate: (to: string) => void }) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isLightsOut = currentTheme === 'lights-out';
  const isDim = currentTheme === 'dim';

  const [err, setErr] = useState(false);
  const year = video.releaseDate?.split("-")[0] || "2026";
  return (
    <div
      className="flex flex-col gap-3 cursor-pointer group"
      onClick={() => navigate(`/featured/${video.id}`)}
    >
      <div
        className={`relative w-full overflow-hidden rounded-lg ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-[#e4e0d8]"}`}
        style={{ aspectRatio: "16 / 9" }}
      >
        {!err ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className={`w-6 h-6 opacity-20 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      {/* Card caption row — like the reference image */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`font-['Poppins'] text-[12px] font-bold uppercase tracking-wide leading-snug ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {video.title}
          </p>
          <p className={`font-['Poppins'] text-[11px] mt-0.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            {video.genre?.split(",")[0]?.trim()} · {year}
          </p>
        </div>
        <span
          className="font-['Poppins'] text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5 transition-colors"
          style={{ color: primaryRed }}
        >
          More ↗
        </span>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const makeDefault = (work: any) => [
  { id: 'hero', type: 'hero', visible: true, data: { tag: 'Featured Archive Entry', curatorNote: 'An exceptional work selected for its outstanding technical and thematic execution.', production: 'APC School of Multimedia Arts', banner: '', theory: 'Folkloric Analysis' } },
  { id: 'the-work', type: 'the-work', visible: true, data: { heading: 'The Work', body: 'This work represents a significant achievement in student multimedia production, demonstrating a clear command of formal genre conventions while introducing a distinctive creative perspective.\n\nViewed as a whole, it contributes meaningfully to the ongoing conversation within APC-SoMA about what student filmmaking can and should aspire to be.', cast: (work?.creator || 'Student') + '|Director\nProducer|TBA\nEditor|TBA' } },
  { id: 'behind-scenes', type: 'behind-scenes', visible: true, data: { heading: 'Behind the Scenes', cap1: 'Pre-production planning', cap2: 'Principal photography', cap3: 'Post-production assembly', img1: '', img2: '', img3: '' } },
  { id: 'creator', type: 'creator', visible: true, data: { portrait: '', heading: 'Creator Spotlight', name: work?.creator || 'Creator Name', role: 'Director · Film', profile: 'A student filmmaker and multimedia artist at APC-SoMA, working within the school\'s faculty-endorsed production programme.', quote: 'Every creative choice in this film was made in service of a single emotional truth.', footer: work?.creator || 'Creator Name' } },
  { id: 'context', type: 'context', visible: true, data: { heading1: 'Context', body1: 'This work was produced as part of the APC-SoMA curriculum under faculty supervision and endorsement.', heading2: 'Why It Is Featured', body2: 'This work is featured for its demonstration of clarity of vision, technical discipline, and purposeful storytelling.', theory: 'Folkloric Analysis' } },
  { id: 'archive-frames', type: 'archive-frames', visible: false, data: { heading: 'Archive Process Frames', cap1: 'Process Frame 01', cap2: 'Process Frame 02', cap3: 'Process Frame 03', img1: '', img2: '', img3: '' } },
  { id: 'screening', type: 'screening', visible: true, data: { heading: 'Archive Screening', title: work?.title || 'Work Title', meta: 'Film · 2026 · ' + (work?.duration || '12:00'), intro: 'The following screening is provided as part of the Likhani faculty-endorsed archive. The work is presented in its original form as submitted for academic review.' } },
];

export default function FeaturedWork() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  const { media: allVideos, loading } = usePublishedMedia();
  const foundVideo = allVideos.find((v) => v.id === id);
  const video = foundVideo 
    ? {
        ...foundVideo,
        thumbnail: foundVideo.posterUrl,
        author: foundVideo.creator,
        likes: foundVideo.likeCount || 0,
        views: foundVideo.viewCount || 0,
        cast: [],
        theory: null,
      } 
    : undefined;

  const { config, loading: configLoading } = useSiteConfig(`featured_work_${id}`);
  const sections = (config && config.sections && Array.isArray(config.sections) && config.sections.length > 0) 
    ? config.sections 
    : (video ? makeDefault(video) : []);

  const [imgError, setImgError] = useState(false);
  const [playerActive, setPlayerActive] = useState(false);
  const [portraitErr, setPortraitErr] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  if (loading || configLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
        <div className="animate-pulse font-['Poppins'] font-bold text-xl">
          Loading Likhani...
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className={`min-h-screen ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f7f6f3] text-gray-900"}`}>
        <Navbar />
        <div className="w-full max-w-[1200px] mx-auto px-8 py-20 text-center">
          <p className="font-['Poppins'] text-gray-500">Featured work not found.</p>
        </div>
      </div>
    );
  }

  const genre = video.genre?.split(",")[0]?.trim() || "Film";
  const year = video.releaseDate?.split("-")[0] || "2026";
  const youtubeId = video.videoUrl && isYouTubeUrl(video.videoUrl) ? getYouTubeVideoId(video.videoUrl) : null;
  const isDirectVideo = video.videoUrl && !isYouTubeUrl(video.videoUrl) && !video.videoUrl.includes("drive.google.com");

  const labelCls = `font-['Poppins'] text-[13px] font-bold uppercase tracking-[0.14em] ${isDark ? "text-gray-500" : "text-gray-500"}`;
  const valueCls = `font-['Poppins'] text-[14px] ${isDark ? "text-gray-200" : "text-gray-800"}`;
  const bodyText = `font-['Poppins'] text-[16px] leading-[1.82] ${isDark ? "text-gray-300" : "text-gray-600"} whitespace-pre-wrap`;
  const sectionNumCls = `font-['Poppins'] text-[13px] font-bold uppercase tracking-[0.18em] ${isDark ? "text-gray-500" : "text-gray-500"}`;
  const sectionHeadCls = `font-['Poppins'] font-bold text-[20px] ${isDark ? "text-white" : "text-gray-900"}`;
  const dividerCls = `border-t ${isDark ? "border-gray-800" : "border-gray-200"} mb-14`;

  return (
    <div className={`min-h-screen transition-colors ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#15202B]" : "bg-[#f7f6f3]"}`}>
      <Navbar />

      <main className="w-full max-w-[1200px] mx-auto px-8 pt-8 pb-28">
        <div className="mb-10">
          <BackButton />
        </div>

        {sections.filter((s: any) => s.visible).map((section: any) => {
          const d = section.data;
          switch (section.type) {
            case 'hero': return (
              <div key={section.id} className="mb-14">
                <div className="mb-8">
                  <p className={`${labelCls} mb-3`}>{d.tag}</p>
                  <h1 className="font-['Poppins'] font-extrabold leading-[1.1] mb-0" style={{ fontSize: "clamp(28px, 4vw, 44px)", color: primaryRed }}>
                    {video.title}
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className="md:col-span-7">
                    <div className={`relative w-full overflow-hidden rounded-lg shadow-lg group ${isDark ? "shadow-black/40" : "shadow-gray-300/50"}`} style={{ aspectRatio: "16 / 9" }}>
                      {!imgError ? (
                        <img src={d.banner || video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" onError={() => setImgError(true)} />
                      ) : (
                        <ThumbnailPlaceholder title={video.title} isDark={isDark} />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 w-[121px] align-top`}>Genre</td><td className={`${valueCls} py-[10px] align-top`}>{video.genre || 'Film'}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Director</td><td className={`${valueCls} py-[10px] align-top`}>{video.creator}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Cast</td><td className={`${valueCls} py-[10px] align-top`}>{video.author || video.creator}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Year</td><td className={`${valueCls} py-[10px] align-top`}>{year}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Duration</td><td className={`${valueCls} py-[10px] align-top`}>{video.duration || '0:00'}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Production</td><td className={`${valueCls} py-[10px] align-top`}>{d.production}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Theory</td><td className={`${valueCls} py-[10px] align-top`}>{d.theory || 'Folkloric Analysis'}</td></tr>
                        <tr className={`border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}><td className={`${labelCls} py-[10px] pr-4 align-top`}>Archive</td><td className={`${valueCls} py-[10px] align-top`}>
                          <div className="flex items-center gap-4 text-[12px] text-gray-500">
                            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" style={{ color: primaryRed }} /> {(video.likes || 0).toLocaleString()}</span>
                            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {(video.views || 0).toLocaleString()}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 border rounded text-[10px] font-bold ${isDark ? "border-gray-700 text-gray-500" : "border-[#D1D5DC] text-[#99A1AF]"}`}>18+</span>
                          </div>
                        </td></tr>
                      </tbody>
                    </table>
                    <div className="mt-6">
                      <p className={`${labelCls} mb-2`}>Curator's Note</p>
                      <p className={`font-['Poppins'] text-[13px] leading-[1.75] italic ${isDark ? "text-gray-400" : "text-gray-500"} whitespace-pre-wrap`}>{d.curatorNote}</p>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button onClick={() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="font-['Poppins'] text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-2.5 rounded text-white hover:brightness-[0.88] active:brightness-[0.75] transition-all" style={{ backgroundColor: primaryRed }}>View Film</button>
                      <button onClick={() => navigate(`/video/${video.id}`)} className={`font-['Poppins'] text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-2.5 rounded border transition-colors ${isDark ? "border-gray-700 text-gray-400 hover:text-white" : "border-gray-300 text-gray-500 hover:text-gray-800"}`}>Full Archive Entry</button>
                    </div>
                  </div>
                </div>
              </div>
            );
            case 'the-work': return (
              <div key={section.id} className="mb-14">
                <div className={dividerCls} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className="md:col-span-7">
                    <h2 className={`${sectionHeadCls} mb-5`}>{d.heading}</h2>
                    <p className={`${bodyText} text-justify`}>{d.body}</p>
                  </div>
                  <div className="md:col-span-5">
                    <div className={`rounded-[10px] border ${isDark ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`} style={{ padding: '25px 25px 1px 25px' }}>
                      <p className={`${labelCls} mb-4`}>Cast & Collaborators</p>
                      <div className="flex flex-col gap-3">
                        {(d.cast || '').split('\n').filter((l: string) => l.trim()).map((line: string, i: number, arr: string[]) => {
                          const parts = line.includes('|') ? line.split('|') : line.includes(' - ') ? line.split(' - ') : [line, ''];
                          const name = parts[0]?.trim();
                          const role = parts[1]?.trim();
                          return (
                            <div key={i} className={`pb-3 ${i < arr.length - 1 ? `border-b ${isDark ? 'border-gray-800' : 'border-[#F3F4F6]'}` : ''}`}>
                              <p className={`font-['Poppins'] text-[13.5px] font-medium leading-[20px] ${isDark ? 'text-gray-200' : 'text-[#1E2939]'}`}>{name}</p>
                              {role && <p className={`font-['Poppins'] text-[11.5px] leading-[17px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-[#6A7282]'}`}>{role}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            case 'behind-scenes': return (
              <div key={section.id} className="mb-14">
                <div className={dividerCls} />
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className={sectionHeadCls}>{d.heading}</h2>
                  <span className={`font-['Poppins'] text-[10px] uppercase tracking-widest ${isDark ? "text-gray-700" : "text-gray-300"}`}>APC-SoMA · 2026</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[1,2,3].map(i => (
                    <StillCard key={i} src={d[`img${i}`] || (i===1?STILL_1:i===2?STILL_2:STILL_3)} caption={d[`cap${i}`]} index={i-1} isDark={isDark} />
                  ))}
                </div>
              </div>
            );
            case 'creator': return (
              <div key={section.id} className="mb-14">
                <div className={dividerCls} />
                <p className={`${labelCls} tracking-[0.18em] mb-8`}>{d.heading}</p>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className="md:col-span-3">
                    <div className={`relative w-full overflow-hidden rounded-lg ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-[#e4e0d8]"}`} style={{ aspectRatio: "3 / 4" }}>
                      {!portraitErr ? (
                        <img src={d.portrait || CREATOR_PORTRAIT} alt={d.name} className="w-full h-full object-cover grayscale-[20%]" onError={() => setPortraitErr(true)} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><User className={`w-10 h-10 opacity-20 ${isDark ? "text-gray-300" : "text-gray-500"}`} /></div>
                      )}
                    </div>
                    <p className={`font-['Poppins'] text-[11px] font-bold uppercase tracking-[0.14em] mt-3 ${isDark ? "text-gray-300" : "text-[#1E2939]"}`}>{d.name}</p>
                    <p className={`font-['Poppins'] text-[11px] mt-0.5 ${isDark ? "text-gray-600" : "text-[#99A1AF]"}`}>{d.role}</p>
                  </div>
                  <div className="md:col-span-9">
                    <h2 className={`${sectionHeadCls} mb-4`}>{d.name}</h2>
                    <p className={`${bodyText} mb-8 max-w-[600px]`}>{d.profile}</p>
                    <div className={`relative border-l pl-5 ${isDark ? "border-gray-700" : "border-[#D1D5DC]"}`}>
                      <span className={`font-['Georgia'] text-[64px] leading-none opacity-55 absolute -top-2 left-5 select-none pointer-events-none`} style={{ color: primaryRed }}>{'\u201C'}</span>
                      <div className="pt-16">
                        <blockquote className={`font-['Poppins'] leading-[1.85] italic ${isDark ? "text-gray-300" : "text-[#364153]"} text-[17px] whitespace-pre-wrap`}>{d.quote}</blockquote>
                      </div>
                      <div className="flex justify-end mt-2">
                        <span className={`font-['Georgia'] text-[64px] leading-none opacity-55 select-none pointer-events-none`} style={{ color: primaryRed }}>{'\u201D'}</span>
                      </div>
                      <div className={`mt-2 font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? "text-gray-600" : "text-[#99A1AF]"}`}>— {d.footer}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
            case 'context': return (
              <div key={section.id} className="mb-14">
                <div className={dividerCls} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h2 className={`${sectionHeadCls} mb-5`}>{d.heading1}</h2>
                    <p className={`${bodyText} text-justify`}>{d.body1}</p>
                  </div>
                  <div>
                    <h2 className={`${sectionHeadCls} mb-5`}>{d.heading2}</h2>
                    <p className={`${bodyText} text-justify`}>{d.body2}</p>
                    <div className={`mt-5 pt-5 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                      <p className={`${labelCls} mb-1`}>Theoretical Framework</p>
                      <p className={`font-['Poppins'] text-[13px] leading-[20px] ${isDark ? "text-gray-300" : "text-[#4A5565]"}`}>{d.theory || 'Folkloric Analysis'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            case 'archive-frames': return (
              <div key={section.id} className="mb-14">
                <div className={dividerCls} />
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className={sectionHeadCls}>{d.heading}</h2>
                  <span className={`font-['Poppins'] text-[10px] uppercase tracking-widest ${isDark ? "text-gray-700" : "text-gray-300"}`}>{video.title} · 2026</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[1,2,3].map(i => (
                    <StillCard key={i} src={d[`img${i}`] || (i===1?FRAME_1:i===2?FRAME_2:FRAME_3)} caption={d[`cap${i}`]} index={i-1} isDark={isDark} />
                  ))}
                </div>
              </div>
            );
            case 'screening': return (
              <div key={section.id} className="mb-14" ref={playerRef}>
                <div className={dividerCls} />
                <div className="mb-10">
                  <p className={`${labelCls} mb-3`}>{d.heading}</p>
                  <div className="flex items-end gap-6 mb-3">
                    <h2 className="font-['Poppins'] font-extrabold leading-none text-[32px]" style={{ color: isDark ? "#fff" : "#111" }}>{d.title}</h2>
                    <span className={`font-['Poppins'] text-[14px] mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{d.meta}</span>
                  </div>
                  <p className={`font-['Poppins'] text-[16px] leading-[1.75] max-w-[600px] ${isDark ? "text-gray-400" : "text-gray-600"} whitespace-pre-wrap`}>{d.intro}</p>
                </div>
                <div className="w-full">
                  {!playerActive ? (
                    <div className={`relative w-full overflow-hidden rounded-xl cursor-pointer group shadow-xl ${isDark ? "shadow-black/50" : "shadow-gray-300/60"}`} style={{ aspectRatio: "16 / 9" }} onClick={() => setPlayerActive(true)}>
                      {!imgError ? (
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" onError={() => setImgError(true)} />
                      ) : (
                        <ThumbnailPlaceholder title={video.title} isDark={isDark} />
                      )}
                      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: primaryRed }}>
                          <Play className="w-7 h-7 text-white ml-1" fill="white" />
                        </div>
                        <p className="font-['Poppins'] text-white text-[14px] font-bold uppercase tracking-[0.14em] opacity-80">Play Film</p>
                      </div>
                      <div className="absolute bottom-4 left-5">
                        <span className="font-['Poppins'] text-white text-[13px] font-bold uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded">
                          {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                        </span>
                      </div>
                    </div>
                  ) : youtubeId ? (
                    <div className="relative w-full overflow-hidden rounded-xl shadow-xl" style={{ aspectRatio: "16 / 9" }}>
                      <iframe src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title={video.title} />
                    </div>
                  ) : isDirectVideo ? (
                    <div className="relative w-full overflow-hidden rounded-xl shadow-xl" style={{ aspectRatio: "16 / 9" }}>
                      <video src={video.videoUrl} className="w-full h-full object-cover" controls autoPlay />
                    </div>
                  ) : (
                    <div className={`relative w-full flex items-center justify-center rounded-xl ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-gray-100"}`} style={{ aspectRatio: "16 / 9" }}>
                      <p className={`font-['Poppins'] text-[16px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Playback not available for this format.</p>
                    </div>
                  )}
                  <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                    <p className={`font-['Poppins'] text-[14px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>{video.genre} · {year} · APC-SoMA Archive</p>
                    <button onClick={() => navigate(`/video/${video.id}`)} className={`font-['Poppins'] text-[14px] transition-colors ${isDark ? "text-gray-500 hover:text-[#ff4b4b]" : "text-gray-500 hover:text-[#8a181a]"}`}>Full archive record →</button>
                  </div>
                </div>
              </div>
            );
            default: return null;
          }
        })}

      </main>
      <SiteFooter />
    </div>
  );
}
