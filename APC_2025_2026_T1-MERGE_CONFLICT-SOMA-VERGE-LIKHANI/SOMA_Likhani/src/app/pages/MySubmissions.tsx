import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { SiteFooter } from "../components/layout/SiteFooter";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { ChevronLeft, Search, Plus, FileText, Video, ChevronDown, Check, X, Image } from "lucide-react";
import { useMySubmissionTickets, useTicketMediaUpload } from "../hooks/useTicketUploads";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function MySubmissions() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  // Theme tokens from Figma & Admin Workspace
  const pageBg = isLightsOut ? 'bg-[#000000]' : isDim ? 'bg-[#15202B]' : 'bg-[#F7F6F3]';
  const headingColor = isDark ? 'text-white' : 'text-[#101828]';
  const subText = isDark ? 'text-[#F5F5F5]' : 'text-[#6A7282]';
  const backColor = isDark ? 'text-[#99A1AF]' : 'text-[#4A5565]';
  const cardBg = isDark ? 'bg-[#1E2A36]' : 'bg-white';
  const cardBorder = isDark ? 'border-[#38444D]' : 'border-[#E6E1DA]';
  const detailsValue = isDark ? 'text-white' : 'text-[#101828]';
  const detailsLabel = 'text-[#6A7282]';
  const synopsisText = isDark ? 'text-[#E5E7EB]' : 'text-[#364153]';
  const inputBg = isDark ? 'bg-[#101828]' : 'bg-white';
  const inputBorder = 'border-[#D1D5DC] dark:border-[#38444D]';
  const inputPlaceholder = isDark ? 'placeholder:text-[#F5F5F5]/50' : 'placeholder:text-[#0A0A0A]/50';
  const inputText = isDark ? 'text-white' : 'text-[#0A0A0A]';
  const selectText = isDark ? 'text-[#F5F5F5]/50' : 'text-[#0A0A0A]/50';
  const guidelinesBtnBg = isDark ? 'bg-[#0F1923]' : 'bg-[#F3F3F5]';
  const guidelinesBtnText = isDark ? 'text-white' : 'text-[#030213]';
  const guidelinesBtnBorder = isDark ? 'border-[#38444D]' : 'border-transparent';
  const newSubmitBg = isDark ? 'bg-[#E84040] hover:bg-[#D32F2F]' : 'bg-[#991B1B] hover:bg-[#7F1717]';
  const assetCardBg = isDark ? 'bg-[#1E2A36]' : 'bg-white';
  const assetCardBorder = isDark ? 'border-[#38444D]' : 'border-[#E6E1DA]';
  const assetFileName = isDark ? 'text-white' : 'text-[#101828]';
  const dateText = isDark ? 'text-[#99A1AF]' : 'text-[#6A7282]';

  const { tickets, mediaByTicketId, loading, error, mediaError, refresh } = useMySubmissionTickets();
  const { uploadForTicket, uploading, error: uploadError } = useTicketMediaUpload();

  const [filesByTicketId, setFilesByTicketId] = useState<Record<string, { video?: File | null; poster?: File | null; stills?: File[] }>>({});
  
  // Workspace Selection State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Active user details state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filter and sorting states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Under Review" },
    { value: "accepted", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest - Oldest" },
    { value: "oldest", label: "Oldest - Latest" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (supabase && isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  const truncateUrl = (url: string) => {
    if (!url) return "";
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      if (fileName.length > 25) {
        return "..." + fileName.slice(-22);
      }
      return fileName;
    } catch {
      return url.length > 30 ? url.slice(0, 27) + "..." : url;
    }
  };

  const setTicketFile = (ticketId: string, kind: "video" | "poster", file: File | null) => {
    setFilesByTicketId((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [kind]: file,
      },
    }));
  };

  const setTicketStills = (ticketId: string, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    setFilesByTicketId((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        stills: arr,
      },
    }));
  };

  const formatDate = useCallbackDateFormatter();

  // Dynamic filter logic
  const visibleTickets = useMemo(() => {
    let filtered = [...tickets];

    // 1. Search Query filter (matches project_title or ticket_code / ID)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.project_title.toLowerCase().includes(query) ||
          (t.ticket_code && t.ticket_code.toLowerCase().includes(query)) ||
          t.id.toLowerCase().includes(query)
      );
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // 3. Sorting (latest - oldest)
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return filtered;
  }, [tickets, searchQuery, statusFilter, sortBy]);

  // Selected ticket calculation
  const selectedTicket = useMemo(() => {
    if (selectedTicketId) {
      const found = visibleTickets.find((t) => t.id === selectedTicketId);
      if (found) return found;
    }
    return visibleTickets[0] || null;
  }, [visibleTickets, selectedTicketId]);

  // Auto-selection of the first visible ticket when list changes
  useEffect(() => {
    if (visibleTickets.length > 0) {
      if (!selectedTicketId || !visibleTickets.some(t => t.id === selectedTicketId)) {
        setSelectedTicketId(visibleTickets[0].id);
      }
    } else {
      setSelectedTicketId(null);
    }
  }, [visibleTickets, selectedTicketId]);

  // Dynamic metrics card calculation
  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      underReview: tickets.filter(t => t.status === 'pending').length,
      approved: tickets.filter(t => t.status === 'accepted' && !(mediaByTicketId.get(t.id)?.length)).length,
      published: tickets.filter(t => t.status === 'accepted' && (mediaByTicketId.get(t.id)?.length ?? 0) > 0).length,
    };
  }, [tickets, mediaByTicketId]);

  const getStatusBadgeStyle = (status: string, isPublished?: boolean) => {
    if (isPublished) {
      return isDark 
        ? 'bg-purple-950/40 border-purple-900/50 text-[#C084FC]' 
        : 'bg-[#FAF5FF] border-[#E9D5FF] text-[#8200DB]';
    }
    switch (status) {
      case 'accepted':
        return isDark 
          ? 'bg-green-950/40 border-green-900/50 text-[#39E57A]' 
          : 'bg-[#F0FDF4] border-[#DCEFDC] text-[#008236]';
      case 'rejected':
        return isDark 
          ? 'bg-red-950/40 border-red-900/50 text-[#FF5B64]' 
          : 'bg-[#FFF5F5] border-[#FADCDD] text-[#E7000B]';
      case 'pending':
        return isDark 
          ? 'bg-blue-950/40 border-blue-900/50 text-[#5890FF]' 
          : 'bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]';
      case 'draft':
      default:
        return isDark 
          ? 'bg-gray-800/40 border-gray-700/50 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getStatusLabel = (status: string, isPublished?: boolean) => {
    if (isPublished) {
      return 'Published';
    }
    switch (status) {
      case 'accepted':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Under Review';
      case 'draft':
        return 'Draft';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const draftFiles = selectedTicket ? (filesByTicketId[selectedTicket.id] ?? {}) : {};

  // Extract submitter and primary media previews
  const submitterName = currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || "Student Submitter";
  const directorName = submitterName;

  const mediaPreviews = selectedTicket ? (mediaByTicketId.get(selectedTicket.id) ?? []) : [];

  const mainMedia = useMemo(() => {
    if (!selectedTicket) return null;
    const previews = mediaByTicketId.get(selectedTicket.id) ?? [];
    const video = previews.find(m => m.mediaType === 'video' || m.mimeType?.startsWith('video/'));
    if (video) return video;
    const poster = previews.find(m => m.mediaType === 'poster' || m.mediaType === 'image' || m.mimeType?.startsWith('image/'));
    return poster || null;
  }, [selectedTicket, mediaByTicketId]);

  return (
    <div className={`min-h-screen flex flex-col font-['Poppins'] ${pageBg} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />

      <div className="flex-1 w-full max-w-[min(1400px,calc(100vw-48px))] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Back Link */}
        <button 
          onClick={() => navigate("/")}
          className={`flex items-center ${backColor} hover:opacity-80 transition-colors mb-6 text-sm font-medium`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {/* Page Title & Guidelines */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`${headingColor} text-[28px] lg:text-[36px] xl:text-[42px] font-extrabold mb-1`}>
              My Submissions
            </h1>
            <p className={`${subText} text-xs`}>
              Track your submission requests, revision comments, and publication progress in your workspace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`${guidelinesBtnBg} border ${guidelinesBtnBorder} ${guidelinesBtnText} px-4 py-2.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-colors flex items-center gap-2 shadow-sm`}
            >
              <FileText className="w-4 h-4" />
              Guidelines
            </button>
            <button
              onClick={() => navigate("/submit-work")}
              className={`flex items-center ${newSubmitBg} text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm`}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Submission
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Submissions */}
          <div className={`${cardBg} p-5 rounded-lg border ${cardBorder} shadow-sm transition-all hover:shadow`}>
            <p className="text-xs font-semibold text-[#6A7282] dark:text-[#99A1AF] mb-2 uppercase tracking-wider">Total Submissions</p>
            <p className={`text-2xl font-bold ${headingColor}`}>{metrics.total}</p>
          </div>

          {/* Under Review */}
          <div className={`${cardBg} p-5 rounded-lg border ${cardBorder} shadow-sm transition-all hover:shadow`}>
            <p className="text-xs font-semibold text-[#6A7282] dark:text-[#99A1AF] mb-2 uppercase tracking-wider">Under Review</p>
            <p className="text-2xl font-bold text-[#155DFC] dark:text-[#5890FF]">{metrics.underReview}</p>
          </div>

          {/* Approved (Pending Uploads) */}
          <div className={`${cardBg} p-5 rounded-lg border ${cardBorder} shadow-sm transition-all hover:shadow`}>
            <p className="text-xs font-semibold text-[#6A7282] dark:text-[#99A1AF] mb-2 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-[#008236] dark:text-[#39E57A]">{metrics.approved}</p>
          </div>

          {/* Published */}
          <div className={`${cardBg} p-5 rounded-lg border ${cardBorder} shadow-sm transition-all hover:shadow`}>
            <p className="text-xs font-semibold text-[#6A7282] dark:text-[#99A1AF] mb-2 uppercase tracking-wider">Published</p>
            <p className="text-2xl font-bold text-[#8200DB] dark:text-[#C084FC]">{metrics.published}</p>
          </div>
        </div>

        {loading ? (
          <div className={`${cardBg} border ${cardBorder} rounded-lg p-8 shadow-sm ${subText} text-sm text-center`}>
            Loading your submissions...
          </div>
        ) : error ? (
          <div className={`${cardBg} border ${cardBorder} rounded-lg p-8 shadow-sm text-sm text-red-600 text-center`}>
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className={`${cardBg} border ${cardBorder} rounded-lg p-12 shadow-sm ${subText} text-sm text-center flex flex-col items-center justify-center gap-4`}>
            <p className="italic">You haven't made any submissions yet.</p>
            <button
              onClick={() => navigate("/submit-work")}
              className={`flex items-center ${newSubmitBg} text-white font-semibold text-xs px-6 py-3 rounded-lg transition-colors shadow-sm`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Submission
            </button>
          </div>
        ) : (
          /* Three Column Layout Grid */
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Left Column - Submissions List Sidebar */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              <div className={`${cardBg} rounded-lg border ${cardBorder} shadow-sm overflow-hidden flex flex-col h-full`}>
                {/* Search and Filters */}
                <div className="border-b border-[#E6E1DA] dark:border-gray-800 p-4 space-y-3">
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99A1AF]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg ${inputText} pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#8A181A] ${inputPlaceholder}`}
                    />
                  </div>

                  {/* Status & Sort Dropdowns Side-by-Side */}
                  <div className="flex gap-2">
                    <CustomDropdown
                      value={statusFilter}
                      onChange={setStatusFilter}
                      options={statusOptions}
                      inputBg={inputBg}
                      inputBorder={inputBorder}
                      selectText={selectText}
                      isDark={isDark}
                      className="flex-1"
                    />
                    <CustomDropdown
                      value={sortBy}
                      onChange={setSortBy}
                      options={sortOptions}
                      inputBg={inputBg}
                      inputBorder={inputBorder}
                      selectText={selectText}
                      isDark={isDark}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Scrollable Submissions List */}
                <div className="p-3 space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar">
                  {visibleTickets.length === 0 ? (
                    <div className={`p-4 text-center text-xs ${subText} italic`}>
                      No matching submissions.
                    </div>
                  ) : (
                    visibleTickets.map((ticket) => {
                      const isSelected = ticket.id === selectedTicketId;
                      return (
                        <button
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className={`w-full p-4 rounded-lg border text-left transition-all flex flex-col ${
                            isSelected
                              ? isDark 
                                ? 'bg-[#1F2F3D] border-2 border-[#E84040] shadow-md'
                                : 'bg-white border-2 border-[#991B1B] shadow-md'
                              : `${cardBg} border ${cardBorder} hover:border-[#991B1B]/40`
                          }`}
                        >
                          <h4 className={`font-bold text-xs ${headingColor} mb-1 truncate w-full`}>
                            {ticket.project_title}
                          </h4>
                          <div className={`flex items-center gap-1.5 text-[10px] ${subText} mb-3 w-full`}>
                            <span className="truncate flex-1">ID: {ticket.ticket_code ?? ticket.id}</span>
                          </div>
                          <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-gray-50 dark:border-gray-800/40">
                            <span className={`text-[10px] ${dateText}`}>
                              {formatDate(ticket.submitted_at ?? ticket.created_at)}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(
                                ticket.status,
                                (mediaByTicketId.get(ticket.id)?.length ?? 0) > 0
                              )}`}
                            >
                              {getStatusLabel(ticket.status, (mediaByTicketId.get(ticket.id)?.length ?? 0) > 0)}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Submission Details Workspace */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              {selectedTicket ? (
                <div className={`${cardBg} rounded-lg border ${cardBorder} p-8 shadow-sm flex flex-col gap-8`}>
                  
                  {/* 1. Media Preview Container (Matches Admin Aspect-Video) */}
                  {mainMedia ? (
                    mainMedia.mediaType === 'video' ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-black border border-[#E6E1DA] dark:border-gray-800">
                        <video
                          src={mainMedia.publicUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-gray-50 dark:bg-black border border-[#E6E1DA] dark:border-gray-800">
                        <img
                          src={mainMedia.publicUrl}
                          alt="Submission cover poster"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  ) : (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#F9FAFB] dark:bg-[#0F1923] border border-dashed border-[#E6E1DA] dark:border-gray-800 flex flex-col items-center justify-center gap-3 min-h-[250px]">
                      <Video size={48} className="text-[#6A7282] stroke-[1.5]" />
                      <span className="font-poppins text-sm font-semibold text-[#364153] dark:text-white">No Media Uploaded Yet</span>
                      <span className="font-poppins text-xs text-[#6A7282] text-center px-4">This request does not contain any video or image assets.</span>
                    </div>
                  )}

                  {/* 2. Title & ID & Status Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <h2 className="text-[#101828] dark:text-white text-[30px] font-bold tracking-[-0.75px] leading-tight font-poppins break-words">
                        {selectedTicket.project_title || 'Untitled'}
                      </h2>
                      <p className="text-[#6A7282] text-[14px] font-medium font-poppins tracking-wide truncate">
                        Submission ID: {selectedTicket.ticket_code ?? selectedTicket.id}
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <span className={`text-[11px] h-[26px] px-3 py-1 uppercase tracking-wider rounded-md font-semibold border inline-flex items-center justify-center ${getStatusBadgeStyle(selectedTicket.status, mediaPreviews.length > 0)}`}>
                        {getStatusLabel(selectedTicket.status, mediaPreviews.length > 0)}
                      </span>
                    </div>
                  </div>

                  {/* 3. Progress Stepper (A solid line connecting circles matching the Admin layout) */}
                  <div className="w-full max-w-[800px] border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="relative flex justify-between">
                      {/* Background Line */}
                      <div className="absolute top-[20px] left-[10%] right-[10%] h-[1px] bg-[#E6E1DA] dark:bg-gray-700 z-0" />
                      
                      {/* Progress Line */}
                      <div 
                        className="absolute top-[20px] left-[10%] h-[1px] bg-[#991B1B] transition-all duration-700 z-0"
                        style={{ 
                          width: `${
                            ((['published'].includes(selectedTicket.status?.toLowerCase()) || mediaPreviews.length > 0) ? 80 : 
                             (['approved', 'accepted'].includes(selectedTicket.status?.toLowerCase()) ? 53.3 : 
                             (['review', 'reviewed', 'pending', 'under_review'].includes(selectedTicket.status?.toLowerCase()) ? 26.6 : 0)))}%` 
                        }}
                      />

                      {['Submitted', 'Reviewed', 'Approved', 'Published'].map((label, idx) => {
                        const status = selectedTicket.status?.toLowerCase();
                        const isUploaded = mediaPreviews.length > 0;
                        const currentIdx = (status === 'published' || isUploaded) ? 3 : 
                                         (status === 'approved' || status === 'accepted') ? 2 : 
                                         (status === 'reviewed' || status === 'pending') ? 1 : 0;
                        
                        const isCompleted = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        
                        return (
                          <div key={label} className="flex flex-col items-center gap-4 relative z-10 w-24">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-800 transition-colors duration-500 ${
                                isCompleted ? 'bg-[#991B1B]' : 
                                isCurrent ? 'bg-[#16A34A]' : 
                                'bg-[#E6E1DA] dark:bg-gray-700'
                              }`}
                            >
                              {(isCompleted || isCurrent) && <Check size={20} className="text-white" />}
                            </div>
                            <span className={`font-poppins text-[14px] font-medium ${isCurrent ? 'text-[#101828] dark:text-white' : 'text-[#6A7282]'}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Director Section */}
                  <div className="border-t border-gray-100 dark:border-gray-850 pt-6">
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-3">
                      Director
                    </p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-['Inter'] font-[700] text-[16px] flex-shrink-0"
                        style={{ backgroundColor: '#991B1B' }}
                      >
                        {directorName.charAt(0)}
                      </div>
                      <p className="font-['Poppins'] font-[700] text-[15px] text-[#101828] dark:text-white break-words min-w-0 flex-1">
                        {directorName}
                      </p>
                    </div>
                  </div>

                  {/* 5. Cast & Crew Section */}
                  <div className="border-t border-gray-100 dark:border-gray-850 pt-6">
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-3">
                      Cast & Crew
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E7EB] dark:bg-gray-700 text-[#364153] dark:text-white font-['Inter'] font-[700] text-[12px] flex-shrink-0">
                          {directorName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-['Poppins'] font-[600] text-[14px] text-[#101828] dark:text-white leading-tight">
                            {directorName}
                          </p>
                          <p className="font-['Poppins'] font-[500] text-[12px] text-[#6A7282]">
                            Director
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Synopsis Section */}
                  <div className="border-t border-[#E5E7EB] dark:border-gray-850 pt-6">
                    <h3 className="font-poppins font-bold text-[18px] text-[#101828] dark:text-white mb-4">Synopsis</h3>
                    <p className={`font-poppins font-[500] text-[15px] leading-[24px] ${synopsisText} whitespace-pre-wrap break-words [overflow-wrap:anywhere]`}>
                      {selectedTicket.synopsis || 'No synopsis provided.'}
                    </p>
                  </div>

                  {/* 7. Activity Timeline Section */}
                  <div className="border-t border-[#E5E7EB] dark:border-gray-850 pt-6 flex flex-col gap-6">
                    <h3 className="text-[#101828] dark:text-white text-[18px] font-bold font-poppins tracking-tight">Activity Timeline</h3>
                    <div className="flex flex-col gap-6 relative ml-1">
                      <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-[#E6E1DA] dark:bg-gray-750 -z-10" />
                      
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#991B1B] shrink-0" />
                        <div className="flex flex-col gap-1">
                          <span className="text-[#101828] dark:text-white text-[14px] font-semibold font-poppins leading-none">Submission received</span>
                          <span className="text-[#6A7282] text-[12px] font-medium font-poppins">
                            {submitterName} • {new Date(selectedTicket.submitted_at || selectedTicket.created_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`${cardBg} rounded-lg border ${cardBorder} p-12 text-center text-xs ${subText} italic`}>
                  Select a submission from the sidebar to inspect details
                </div>
              )}
            </div>

            {/* Right Column - Revision Feedback, Film Metadata, Uploaded Assets, and Upload Form */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 self-start">
              
              {/* Admin Revisions and Comments */}
              <div className={`${cardBg} rounded-lg border ${cardBorder} p-6 shadow-sm flex flex-col gap-4`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${headingColor} flex items-center gap-2 border-b border-gray-100 dark:border-gray-855 pb-2`}>
                  <FileText className="w-4 h-4 text-[#991B1B]" />
                  Admin Notes & Revisions
                </h3>
                {selectedTicket?.admin_notes && !(selectedTicket.admin_notes.includes('upload_token') && selectedTicket.admin_notes.startsWith('{') && mediaPreviews.length > 0) ? (
                  <div className={`p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-[#E7000B]/5 border-[#E7000B]/20 text-[#FF858D]' 
                      : 'bg-[#FFF5F5] border-[#FADCDD] text-[#B91C1C]'
                  }`}>
                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                      {(() => {
                        if (selectedTicket.admin_notes.includes('upload_token') && selectedTicket.admin_notes.startsWith('{')) {
                          try {
                            const parsed = JSON.parse(selectedTicket.admin_notes);
                            const token = parsed.upload_token;
                            const isExpired = parsed.expires_at ? new Date(parsed.expires_at).getTime() < Date.now() : false;
                            return (
                              <div className="flex flex-col gap-3">
                                <p className="font-semibold text-green-700 dark:text-green-400">
                                  Approved! Secure upload is ready.
                                </p>
                                {!isExpired ? (
                                  <button
                                    onClick={() => navigate(`/secure-upload/${token}`)}
                                    className="mt-2 w-full py-2.5 bg-[#991B1B] hover:bg-[#7F1717] dark:bg-[#E84040] dark:hover:bg-[#D32F2F] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    Upload Final Materials
                                  </button>
                                ) : (
                                  <p className="text-xs text-red-500 font-semibold italic mt-1">
                                    The secure upload link has expired. Please contact an administrator.
                                  </p>
                                )}
                              </div>
                            );
                          } catch (e) {
                            return 'Approved. Please check your email for the secure upload link to submit your final materials.';
                          }
                        }
                        return selectedTicket.admin_notes;
                      })()}
                    </div>
                  </div>
                ) : (
                  <p className={`${subText} text-xs italic`}>
                    No comments or revision requests from the admin yet.
                  </p>
                )}
              </div>

              {/* Film Metadata Panel (Exact Mirror of Admin Review Workspace metadata panel) */}
              {selectedTicket && (
                <div className="bg-[#F9FAFB] dark:bg-[#0F1923] border border-[#E6E1DA] dark:border-[#38444D] rounded-lg p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]/50 dark:border-gray-850">
                    <span className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282]">
                      Metadata
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Ticket Type */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Ticket Type
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white">
                        Media Upload Review
                      </p>
                    </div>

                    {/* Submitted By */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Submitted By
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white break-words">
                        {submitterName}
                      </p>
                      <p className="font-['Poppins'] text-[12px] text-[#6A7282] break-all">
                        {currentUser?.email || '—'}
                      </p>
                      {currentUser?.user_metadata?.student_id && (
                        <p className="font-['Poppins'] text-[12px] text-[#6A7282] mt-0.5">
                          ID: {currentUser?.user_metadata?.student_id}
                        </p>
                      )}
                    </div>

                    {/* Program & Year */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Program
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white break-words">
                        {selectedTicket.program || 'BS Multimedia Arts'}
                      </p>
                    </div>

                    {/* Course & Section */}
                    {selectedTicket.course_subject && (
                      <div>
                        <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                          Course & Section
                        </p>
                        <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white break-words">
                          {selectedTicket.course_subject} {selectedTicket.section ? `• ${selectedTicket.section}` : ''}
                        </p>
                      </div>
                    )}

                    {/* School Year */}
                    {selectedTicket.school_year && (
                      <div>
                        <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                          School Year
                        </p>
                        <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white">
                          {selectedTicket.school_year}
                        </p>
                      </div>
                    )}

                    {/* Faculty Advisor */}
                    {selectedTicket.faculty_advisor_name && (
                      <div>
                        <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                          Faculty Advisor
                        </p>
                        <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white">
                          {selectedTicket.faculty_advisor_name}
                        </p>
                      </div>
                    )}

                    {/* Rights & Visibility */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Rights & Visibility
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828] dark:text-white capitalize">
                        {selectedTicket.rights_license || 'All Rights Reserved (Public)'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Materials Sidebar Container */}
              <div className={`${cardBg} rounded-lg border ${cardBorder} p-6 shadow-sm flex flex-col gap-4`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${headingColor} flex items-center gap-2 border-b border-gray-100 dark:border-gray-855 pb-2`}>
                  <Image className="w-4 h-4 text-[#991B1B]" />
                  Uploaded Materials
                </h3>
                {mediaError && <div className="text-xs text-red-500 mb-2">{mediaError}</div>}
                {mediaPreviews.length === 0 ? (
                  <p className={`${subText} text-xs italic`}>No materials uploaded yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {mediaPreviews.map((m, idx) => {
                      const key = `${selectedTicket.id}-${m.mediaType}-${m.objectPath ?? m.publicUrl ?? idx}`;
                      const url = m.publicUrl;
                      if (!url) return null;
                      const isImage = m.mimeType?.startsWith('image/') || m.publicUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={`${assetCardBg} border ${assetCardBorder} rounded-lg p-3 flex items-center gap-3 hover:opacity-90 transition shadow-sm w-full`}
                        >
                          <div className={`${isImage ? 'bg-transparent' : 'bg-[#DBEAFE]/30 dark:bg-[#DBEAFE]/10'} w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800`}>
                            {isImage ? (
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Video className="w-4 h-4 text-[#155DFC]" />
                            )}
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <p className={`${assetFileName} font-bold text-[10px] truncate uppercase tracking-wider`}>{m.mediaType}</p>
                            <p className="text-[#6A7282] dark:text-[#99A1AF] text-[9px] truncate">{truncateUrl(url)}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>


            </div>

          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function useCallbackDateFormatter() {
  return useMemo(() => {
    return (value: string | null | undefined) => {
      if (!value) return "—";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    };
  }, []);
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  inputBg: string;
  inputBorder: string;
  selectText: string;
  isDark: boolean;
  className?: string;
}

function CustomDropdown({ value, onChange, options, inputBg, inputBorder, selectText, isDark, className }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`relative ${className || "w-full sm:w-[189px]"}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between w-full ${inputBg} border ${inputBorder} ${selectText} rounded-lg px-3 py-2 focus:outline-none focus:border-[#8A181A] text-left text-xs font-semibold transition-all cursor-pointer`}
      >
        <span>{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-[#99A1AF] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full mt-2 w-full rounded-lg border shadow-xl z-50 overflow-hidden ${
            isDark ? "bg-[#1E2A36] border-[#38444D]" : "bg-white border-gray-200"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                opt.value === value
                  ? isDark
                    ? "text-[#E84040] bg-[#E84040]/10 font-semibold"
                    : "text-[#8A181A] bg-[#8A181A]/5 font-semibold"
                  : isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
