import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { toast } from "sonner";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { CustomDropdown } from "../components/common/CustomDropdown";

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pick up mediaId from route state or fallback query parameter
  const mediaId = location.state?.mediaId || new URLSearchParams(location.search).get("mediaId") || null;

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reported film details states
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCreator, setMediaCreator] = useState("");

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!mediaId || !supabase) return;
      try {
        const { data, error } = await supabase
          .from("media_items")
          .select("title, author_display_name, director_name")
          .eq("id", mediaId)
          .single();
          
        if (!error && data) {
          setMediaTitle(data.title);
          setMediaCreator(data.author_display_name || data.director_name || "");
        }
      } catch (err) {
        console.error("Error fetching reported media details:", err);
      }
    };
    fetchMediaDetails();
  }, [mediaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!supabase) {
        toast.error("Supabase is not configured.");
        setIsSubmitting(false);
        return;
      }

      // Check current user session
      const { data: userData } = await supabase.auth.getUser();
      const reporter_user_id = userData.user?.id || null;

      // Safe reason mapping: if "misinformation" is selected, map it to "other" to satisfy public.report_reason enum
      const dbReason = reason === "misinformation" ? "other" : reason;

      const { error } = await supabase
        .from("content_reports")
        .insert([
          {
            reporter_user_id,
            media_id: mediaId || null,
            reason: dbReason,
            description: description.trim(),
            status: "pending_review"
          }
        ]);

      if (error) throw error;

      toast.success("Request submitted successfully. Our team will review it shortly.");
      navigate(-1);
    } catch (err: any) {
      console.error("Error submitting report:", err);
      toast.error(err?.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] transition-colors duration-300">
      <Navbar />

      <main className="py-[77px] flex flex-col items-center px-4">
        <div className="w-full max-w-[624px]">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#99A1AF] hover:text-[#6A7282] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-[14px] h-[14px] transition-transform group-hover:-translate-x-1" />
            <span className="font-['Poppins'] font-[500] text-[13px] leading-[20px]">Back</span>
          </button>

          {/* Heading */}
          <div className="mb-10 text-left">
            <h1 className="font-['Inter'] font-[800] text-[30px] leading-[36px] text-[#101828] mb-4">
              Report / Request Removal
            </h1>
            <p className="font-['Inter'] font-[400] text-[16px] leading-[24px] text-[#4A5565]">
              Submit a request regarding content on LIKHANI.
            </p>
          </div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-[14px] p-[33px] space-y-6"
          >
            {mediaTitle && (
              <div className="bg-[#FEF2F2]/40 border border-[#FECACA]/60 rounded-xl p-4 flex flex-col gap-1 text-left font-['Inter'] mb-6">
                <span className="font-semibold text-[10px] uppercase tracking-[1px] text-[#DC2626]">Reported Film</span>
                <span className="font-extrabold text-[16px] text-[#101828] mt-0.5">{mediaTitle}</span>
                {mediaCreator && <span className="text-[#6A7282] text-xs font-medium">Directed by {mediaCreator}</span>}
              </div>
            )}

            {/* Reason Field */}
            <div className="space-y-2 text-left">
              <label className="font-['Inter'] font-[600] text-[14px] leading-[20px] text-[#101828]">
                Reason for Report
              </label>
              <CustomDropdown
                value={reason}
                onChange={setReason}
                options={[
                  { value: "copyright", label: "Copyright Infringement" },
                  { value: "privacy", label: "Privacy Violation" },
                  { value: "inappropriate", label: "Inappropriate Content" },
                  { value: "misinformation", label: "Misinformation" },
                  { value: "other", label: "Other" },
                ]}
                placeholder="Select a reason"
                isFullWidth
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2 text-left">
              <label className="font-['Inter'] font-[600] text-[14px] leading-[20px] text-[#101828]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about your request..."
                className="w-full h-[146px] bg-[#F3F2EF] border border-[#E5E7EB] rounded-[14px] p-4 font-['Inter'] text-[16px] text-[#101828] placeholder:text-[#99A1AF] focus:outline-none focus:ring-2 focus:ring-[#8A181A]/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[48px] bg-[#8A181A] hover:bg-[#6e1315] disabled:bg-[#8A181A]/50 text-white rounded-[10px] font-['Poppins'] font-[600] text-[14px] transition-all active:scale-[0.98] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
