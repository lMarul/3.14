import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, Mail, Shield, Bookmark, X, Lock, Camera, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { BackButton } from "../components/navigation/BackButton";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { VideoCard } from "../components/media/VideoCard";
import { SiteFooter } from "../components/layout/SiteFooter";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type ProfileUserData = {
  name: string;
  email: string;
  studentId?: string | null;
  role: string;
  program?: string | null;
  yearLevel?: string | null;
  joinedDate?: string | null;
};

export default function Profile() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userData, setUserData] = useState<ProfileUserData | null>(null);

  // Edit form state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentIdError, setStudentIdError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const guestMode = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestMode);
    if (guestMode) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      if (!mounted) return;

      if (!isSupabaseConfigured || !supabase) {
        setIsLoadingProfile(false);
        setUserData({
          name: localStorage.getItem("userName") || "Guest",
          email: localStorage.getItem("userEmail") || "",
          role: "Guest",
          studentId: null,
          program: null,
          yearLevel: null,
          joinedDate: null,
        });
        return;
      }

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        const user = authData.user;
        if (!user) {
          toast.error("Please sign in first.");
          navigate("/");
          return;
        }

        const { data: appUser, error: appUserError } = await supabase
          .from("app_users")
          .select("id, email, full_name, role, created_at")
          .eq("id", user.id)
          .maybeSingle();

        if (appUserError) throw appUserError;

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("nickname, student_id, program, year_level, joined_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const fullNameFromMeta =
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : typeof user.user_metadata?.name === "string"
              ? user.user_metadata.name
              : "";

        const displayName =
          appUser?.full_name ||
          fullNameFromMeta ||
          user.email?.split("@")[0] ||
          "APC User";

        setUserData({
          name: displayName,
          email: appUser?.email || user.email || "",
          studentId: profile?.student_id ?? null,
          role: appUser?.role ? String(appUser.role).charAt(0).toUpperCase() + String(appUser.role).slice(1) : "Student",
          program: profile?.program ?? null,
          yearLevel: (profile?.year_level as string | null) ?? null,
          joinedDate: profile?.joined_at
            ? new Date(profile.joined_at as any).toLocaleString("en-US", { month: "long", year: "numeric" })
            : appUser?.created_at
              ? new Date(appUser.created_at as any).toLocaleString("en-US", { month: "long", year: "numeric" })
              : null,
        });

        setNickname(profile?.nickname || displayName.split(" ")[0] || "");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    load();
  }, [mounted, navigate]);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  const handleNotificationClick = () => { toast.info("No new notifications"); };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleOpenModal = () => {
    setNickname((prev) => prev || userData?.name?.split(" ")[0] || "");
    setStudentId(userData?.studentId || "");
    setStudentIdError("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMismatch(false);
    setSaveSuccess(false);
    setShowEditModal(true);
  };

  const STUDENT_ID_REGEX = /^[0-9]{4}-[0-9]{6}$/;

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    // Validate student ID format if provided
    if (studentId.trim() && !STUDENT_ID_REGEX.test(studentId.trim())) {
      setStudentIdError("Invalid format. Use XXXX-XXXXXX (e.g. 2022-123456).");
      return;
    }
    setStudentIdError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated."); return; }

      // Upsert user_profiles with nickname and student_id
      const profileUpdates: Record<string, string> = { user_id: user.id };
      if (nickname.trim()) profileUpdates.nickname = nickname.trim();
      if (studentId.trim()) profileUpdates.student_id = studentId.trim();

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileUpdates, { onConflict: 'user_id' });

      if (profileError) {
        toast.error(profileError.message || "Failed to update profile.");
        return;
      }

      // Update password if provided
      if (newPassword) {
        const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
        if (pwError) {
          toast.error(pwError.message || "Failed to update password.");
          return;
        }
      }

      // Refresh local state
      if (studentId.trim() && userData) {
        setUserData({ ...userData, studentId: studentId.trim() });
      }

      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setShowEditModal(false);
      }, 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const inputBase = `w-full px-4 py-3 rounded-xl outline-none border-2 font-['Poppins'] text-[14px] transition-all duration-200`;
  const inputLight = `bg-[#f7f6f3] border-gray-200 focus:border-[#8a181a] text-gray-900 placeholder:text-gray-400`;
  const inputDark = `bg-[#2a2a2a] border-gray-700 focus:border-[#ff4b4b] text-white placeholder:text-gray-600`;

  // User's created and tagged works with placeholder videos
  const userWorksCreated = [
    {
      id: "anim-1",
      title: "Love at First Kill",
      author: "ketzel|Melaiza Ballesteros",
      thumbnail: "https://res.cloudinary.com/dv0rckb29/image/upload/v1771391284/Screenshot_2026-02-18_130736_kldbur.png",
      duration: "2:47",
      videoUrl: "https://www.youtube.com/watch?v=Tz38yiSsTg4",
      category: "ANIMATION",
      year: "2013",
      description: "zombie apocalypse lesbians, that's it, that's the story."
    },
    {
      id: "anim-2",
      title: "Deadly Pursuit",
      author: "QW4TRO STUDIOS",
      thumbnail: "https://res.cloudinary.com/dv0rckb29/image/upload/v1770873089/Screenshot_2026-01-12_234035_gq4fkc.png",
      duration: "2:44",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      category: "ACTION",
      year: "2024",
      description: "A high-stakes chase through a futuristic cityscape where every second counts in a race against time."
    },
    {
      id: "anim-3",
      title: "Me Time",
      author: "Kwentong Barbero",
      thumbnail: "https://res.cloudinary.com/dv0rckb29/image/upload/v1770961787/Screenshot_2026-02-13_134924_j8x8tu.png",
      duration: "2:27",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      category: "HORROR",
      year: "2014",
      description: "A suspenseful short following a quiet moment that turns into an unexpected encounter."
    },
    {
      id: "anim-4",
      title: "Stargirl's Magical Delay",
      author: "Stargirl Productions",
      thumbnail: "https://res.cloudinary.com/dv0rckb29/image/upload/v1771395020/Stargirl_avyufb.png",
      duration: "3:29",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      category: "LGBTQ1+",
      year: "2014",
      description: "A short about two characters in a fantasy world."
    }
  ];

  const userTaggedWorks = [...userWorksCreated]; // Same works for now

  return (
    <motion.div
      className={`min-h-screen transition-colors duration-300 ${isLightsOut ? 'bg-[#000000] text-white' : isDim ? 'bg-[#15202B] text-white' : 'bg-[#f5f5f5] text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      {/* Main Content */}
      <PageContainer className="py-12">
        <BackButton className="mb-8" />
        <div className="mb-12">
          <h1 className="font-['Poppins'] font-extrabold text-[42px] mb-2">Profile</h1>
          <p className="font-['Poppins'] text-[14px] text-gray-500">Your account information and preferences</p>
        </div>

        {isLoadingProfile || !userData ? (
          <div className={`rounded-2xl p-8 shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
            <div className={`animate-pulse font-['Poppins'] font-bold text-xl ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Loading profile…
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className={`rounded-2xl p-8 shadow-sm lg:col-span-2 ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-8 border-b border-gray-200/20">
              {/* Avatar */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: primaryRed }}>
                    {userData.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                  <div>
                    <h2 className="font-['Poppins'] font-bold text-2xl mb-2">{userData.name}</h2>
                    <p className={`font-['Poppins'] text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {userData.role}{userData.yearLevel ? ` · ${userData.yearLevel}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className={`px-6 py-2.5 rounded-xl font-['Poppins'] font-semibold text-sm transition-all border hover:-translate-y-0.5 active:scale-95 ${isDark ? "border-white/20 hover:bg-white hover:text-black text-white" : "border-gray-200 hover:bg-black hover:text-white text-gray-900"}`}
                  >
                    Edit Profile Details
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-3 py-1 bg-green-100 border border-green-300 rounded-full">
                    <span className="font-['Poppins'] text-[11px] font-bold text-green-700">Active Member</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Email Address</label>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><p className="font-['Poppins'] text-[15px] font-medium">{userData.email}</p></div>
              </div>
              <div>
                <label className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Student ID</label>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <p className="font-['Poppins'] text-[15px] font-medium">{userData.studentId || "—"}</p>
                </div>
              </div>
              <div>
                <label className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Program</label>
                <p className="font-['Poppins'] text-[15px] font-medium pl-8">{userData.program || "—"}</p>
              </div>
              <div>
                <label className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Member Since</label>
                <p className="font-['Poppins'] text-[15px] font-medium pl-8">{userData.joinedDate || "—"}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
              <h3 className="font-['Poppins'] font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button onClick={() => navigate("/watch-later")} className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Bookmark className="w-5 h-5" style={{ color: primaryRed }} />
                  <div className="text-left"><p className="font-['Poppins'] font-semibold text-sm">Watch Later</p><p className={`font-['Poppins'] text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>5 saved items</p></div>
                </motion.button>
                <motion.button onClick={() => navigate("/my-submissions")} className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <User className="w-5 h-5" style={{ color: primaryRed }} />
                  <div className="text-left"><p className="font-['Poppins'] font-semibold text-sm">My Submissions</p><p className={`font-['Poppins'] text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Track progress</p></div>
                </motion.button>
                <motion.button onClick={() => navigate("/settings")} className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Settings className="w-5 h-5" style={{ color: primaryRed }} />
                  <div className="text-left"><p className="font-['Poppins'] font-semibold text-sm">Settings</p><p className={`font-['Poppins'] text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Preferences</p></div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ─── Works Created Section ─────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Poppins'] font-extrabold text-[28px]">Works Created</h2>
            <button className={`font-['Poppins'] font-semibold text-sm transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userWorksCreated.map((work) => (
              <VideoCard
                key={work.id}
                id={work.id}
                title={work.title}
                author={work.author}
                thumbnail={work.thumbnail}
                duration={work.duration}
                videoUrl={work.videoUrl}
                category={work.category}
                year={work.year}
                description={work.description}
                stills={(work as any).stills}
              />
            ))}
          </div>
        </div>

        {/* ─── Tagged Works Section ─────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Poppins'] font-extrabold text-[28px]">Tagged Works</h2>
            <button className={`font-['Poppins'] font-semibold text-sm transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTaggedWorks.map((work) => (
              <VideoCard
                key={work.id}
                id={work.id}
                title={work.title}
                author={work.author}
                thumbnail={work.thumbnail}
                duration={work.duration}
                videoUrl={work.videoUrl}
                category={work.category}
                year={work.year}
                description={work.description}
                stills={(work as any).stills}
              />
            ))}
          </div>
        </div>
      </PageContainer>

      {/* ─── Edit Profile Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`relative w-full max-w-[480px] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
            >
              {/* ── Modal Header ── */}
              <div className={`flex items-center justify-between px-8 py-7 border-b flex-shrink-0 ${isDark ? "border-white/[0.07]" : "border-gray-100"}`}>
                <div>
                  <h3 className="font-['Poppins'] font-bold text-[18px]">Edit Profile Details</h3>
                  <p className={`font-['Poppins'] text-[12px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Update your public-facing profile information</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div className="overflow-y-auto flex-1 px-8 py-7 space-y-6">

                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "#f0efed" }}>
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {/* Avatar circle */}
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile preview" className="w-[88px] h-[88px] rounded-full object-cover ring-4 ring-offset-2" style={{ ringColor: primaryRed, outlineColor: primaryRed }} />
                    ) : (
                      <div
                        className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-white text-[28px] font-bold ring-4 ring-offset-2"
                        style={{ backgroundColor: primaryRed, "--tw-ring-color": primaryRed } as React.CSSProperties}
                      >
                        {userData.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    {/* Camera overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <div className="text-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="font-['Poppins'] text-[13px] font-semibold transition-colors"
                      style={{ color: primaryRed }}
                    >
                      Change Photo
                    </button>
                    <p className={`font-['Poppins'] text-[11px] mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      JPG, PNG or GIF · Max 5 MB
                    </p>
                  </div>
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <label className={`block font-['Poppins'] text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="Enter a display nickname"
                    className={`${inputBase} ${isDark ? inputDark : inputLight}`}
                  />
                  <p className={`font-['Poppins'] text-[11px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                    This name appears on your public profile and submissions.
                  </p>
                </div>

                {/* Student ID Number */}
                <div className="space-y-2">
                  <label className={`block font-['Poppins'] text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => { setStudentId(e.target.value); if (studentIdError) setStudentIdError(""); }}
                    placeholder="e.g. 2022-123456"
                    maxLength={11}
                    className={`${inputBase} ${isDark ? inputDark : inputLight} ${studentIdError ? (isDark ? "border-red-500 focus:border-red-500" : "border-red-400 focus:border-red-400") : ""}`}
                  />
                  {studentIdError ? (
                    <p className="font-['Poppins'] text-[11px] text-red-500">{studentIdError}</p>
                  ) : (
                    <p className={`font-['Poppins'] text-[11px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      Format: XXXX-XXXXXX · Your APC student ID number
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className={`block font-['Poppins'] text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setPasswordMismatch(false); }}
                      placeholder="Enter new password"
                      className={`${inputBase} ${isDark ? inputDark : inputLight} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(v => !v)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className={`block font-['Poppins'] text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setPasswordMismatch(false); }}
                      placeholder="Re-enter new password"
                      className={`${inputBase} ${isDark ? `${inputDark} ${passwordMismatch ? "border-red-500 focus:border-red-500" : ""}` : `${inputLight} ${passwordMismatch ? "border-red-400 focus:border-red-400" : ""}`} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <p className="font-['Poppins'] text-[11px] text-red-500">Passwords do not match. Please try again.</p>
                    </motion.div>
                  )}
                  {!passwordMismatch && (
                    <p className={`font-['Poppins'] text-[11px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      Leave both fields blank to keep your current password.
                    </p>
                  )}
                </div>

                {/* APC Email — Locked */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`font-['Poppins'] text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      APC Email Address
                    </label>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 border border-green-300">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span className="font-['Poppins'] text-[10px] font-bold text-green-700 uppercase tracking-wide">Verified</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${isLightsOut ? "bg-[#000000]/60 border-white/[0.06] text-gray-500" : isDim ? "bg-[#253341]/60 border-white/[0.06] text-gray-500" : "bg-[#f0efed] border-gray-200 text-gray-500"}`}>
                    <Lock className="w-4 h-4 flex-shrink-0 opacity-60" />
                    <span className="font-['Poppins'] text-[14px] font-medium flex-1">{userData.email}</span>
                  </div>
                  <p className={`font-['Poppins'] text-[11px] leading-relaxed ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                    Your APC institutional email is tied to your student record and cannot be changed. Contact the registrar for account issues.
                  </p>
                </div>
              </div>

              {/* ── Modal Footer ── */}
              <div className={`flex items-center justify-between px-8 py-7 border-t flex-shrink-0 gap-3 ${isDark ? "border-white/[0.07]" : "border-gray-100"}`}>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`px-5 py-2.5 rounded-xl font-['Poppins'] font-semibold text-sm transition-all active:scale-95 ${isDark ? "hover:bg-white/8 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"}`}
                >
                  Cancel
                </button>

                <motion.button
                  onClick={handleSave}
                  animate={saveSuccess ? { scale: [1, 0.97, 1] } : {}}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-['Poppins'] font-bold text-sm text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all ${saveSuccess ? "bg-green-600" : ""}`}
                  style={!saveSuccess ? { backgroundColor: primaryRed } : {}}
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <SiteFooter />
    </motion.div>
  );
}
