import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { SiteFooter } from "../components/layout/SiteFooter";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { Info, UserPlus, FileText, ChevronLeft, Plus, Users, Library, ShieldCheck, Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import svgPaths from "../../generated/svg-cq2lewbljb";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { useCategories } from "../hooks/useLikhaniData";
import { CustomDropdown } from "../components/common/CustomDropdown";

export default function StudentRequestForm() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "",
    program: "",
    yearLevel: "",
    course: "",
    section: "",
    schoolYear: "",
    advisor: "",
    studentId: "",
    visibility: "",
    notes: "",
    agreeToPolicy: false,
  });

  const [studentIdError, setStudentIdError] = useState("");

  const [credits, setCredits] = useState([{ role: "", name: "" }]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();

  // Pre-fill studentId from user profile on mount
  React.useEffect(() => {
    const prefillStudentId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('student_id')
          .eq('user_id', user.id)
          .maybeSingle();
        if (profile?.student_id) {
          setForm((prev) => ({ ...prev, studentId: profile.student_id ?? '' }));
        }
      } catch {
        // Non-critical — student can still type it in
      }
    };
    prefillStudentId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDropdownChange = (name: string, val: string) => {
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleAddCredit = () => {
    setCredits([...credits, { role: "", name: "" }]);
  };

  const handleRemoveCredit = (index: number) => {
    setCredits(credits.filter((_, i) => i !== index));
  };

  const handleCreditChange = (index: number, field: "role" | "name", value: string) => {
    const newCredits = [...credits];
    newCredits[index][field] = value;
    setCredits(newCredits);
  };

  const STUDENT_ID_REGEX = /^[0-9]{4}-[0-9]{6}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted) return;

    if (!form.agreeToPolicy || !form.title) {
        toast.error("Please fill in required fields and agree to the policy");
        return;
    }
    if (form.description.trim().length < 50) {
        toast.error("Description must be at least 50 characters.");
        return;
    }
    if (!form.studentId.trim()) {
        setStudentIdError("Student ID number is required.");
        toast.error("Please enter your Student ID number.");
        return;
    }
    if (!STUDENT_ID_REGEX.test(form.studentId.trim())) {
        setStudentIdError("Invalid format. Use XXXX-XXXXXX (e.g. 2022-123456).");
        toast.error("Invalid Student ID format.");
        return;
    }
    setStudentIdError("");
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("You must be logged in to submit a request.");
        setIsSubmitting(false);
        return;
      }

      // Map visibility to lowercase to match DB enum ('public', 'institution', 'unlisted')
      let dbVisibility = 'institution';
      if (form.visibility === 'Public') dbVisibility = 'public';
      
      const cleanCredits = credits.filter(c => c.name.trim() !== "");

      // Send to Likhani Admin "Ticket Requests" by creating a submission ticket
      const { error } = await supabase
        .from('submission_tickets')
        .insert({
          student_user_id: user.id,
          status: 'pending', // Awaiting admin approval
          project_title: form.title,
          synopsis: form.description,
          category_label: form.category || null,
          tags_text: form.tags || null,
          rights_license: form.license || null,
          program: form.program || null,
          year_level: form.yearLevel || null,
          course_subject: form.course || null,
          section: form.section || null,
          school_year: form.schoolYear || null,
          faculty_advisor_name: form.advisor || null,
          visibility: dbVisibility,
          student_id_snapshot: form.studentId.trim(),
          request_note: form.notes || null,
          agree_to_policy: form.agreeToPolicy,
          credit_entries: cleanCredits,
          submitted_at: new Date().toISOString()
        });

      // Keep user_profiles.student_id in sync with what they just submitted
      if (!error) {
        await supabase
          .from('user_profiles')
          .upsert(
            { user_id: user.id, student_id: form.studentId.trim() },
            { onConflict: 'user_id' }
          );
      }

      if (error) {
        console.error("Submission error:", error);
        toast.error(error.message || "Failed to submit request.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Submission successfully submitted for review!");
      // Simulate navigation to dashboard/submissions after delay
      setTimeout(() => {
          navigate("/my-submissions");
      }, 1500);
      
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(
    form.title.trim() !== "" &&
    form.description.trim().length >= 50 &&
    form.agreeToPolicy &&
    STUDENT_ID_REGEX.test(form.studentId.trim()) &&
    form.category !== "" &&
    form.license !== "" &&
    form.program !== "" &&
    form.yearLevel !== "" &&
    form.schoolYear !== "" &&
    form.visibility !== "" &&
    credits.some(c => c.name.trim() !== "" && c.role !== "")
  );

  // Theme colors
  const pageBg = isLightsOut ? 'bg-[#000000]' : isDim ? 'bg-[#15202B]' : 'bg-[#F7F6F3]';
  const bannerBg = isLightsOut ? '#0D0F14' : isDim ? '#131622' : '#8A181A';
  const shapeFill = isDark ? '#1E2D3F' : '#CD5D5D';
  const shapeOpacity = isDark ? 0.12 : 0.28;
  const formBg = isDark ? 'bg-[#1E2A36]' : 'bg-[#FFFFFF]';
  const formBorder = isDark ? 'border-[#38444D]' : 'border-[#E5E7EB]';
  const inputBg = isDark ? 'bg-[#1A2634]' : 'bg-white';
  const inputBorder = isDark ? 'border-[#38444D]' : 'border-[#D1D5DC]';
  const inputText = isDark ? 'text-white' : 'text-[#0A0A0A]';
  const inputPlaceholder = isDark ? 'placeholder:text-[#99A1AF]/50' : 'placeholder:text-[#0A0A0A]/50';
  const selectBg = isDark ? 'bg-[#18222B]' : 'bg-white';
  const labelColor = isDark ? 'text-white' : 'text-[#101828]';
  const headingColor = isDark ? 'text-white' : 'text-[#101828]';
  const subTextColor = isDark ? 'text-[#99A1AF]' : 'text-[#4A5565]';
  const sectionDescColor = isDark ? 'text-[#99A1AF]' : 'text-[#6A7282]';
  const iconBoxBg = isDark ? 'bg-[#18222B]' : 'bg-[#FEF2F2]';
  const iconColor = 'text-[#991B1B]';
  const checkboxText = isDark ? 'text-[#99A1AF]' : 'text-[#364153]';
  const submitBg = isSubmitted
    ? 'bg-[#00C950] text-white'
    : isSubmitting
    ? (isDark ? 'bg-[#E84040]/70 text-white' : 'bg-[#991B1B]/70 text-white')
    : (isDark ? 'bg-[#E84040] text-white' : 'bg-[#991B1B] text-white');
  const submitHover = isSubmitted || isSubmitting
    ? ''
    : (isDark ? 'hover:bg-[#D32F2F]' : 'hover:bg-[#7F1717]');
  const removeBtnBg = isDark ? 'bg-[#101828]/50' : 'bg-white';
  const removeBtnText = isDark ? 'text-white' : 'text-[#0A0A0A]';
  const errorColor = isDark ? 'text-[#E84040]' : 'text-[#E7000B]';
  const helperColor = isDark ? 'text-[#99A1AF]' : 'text-[#6A7282]';
  const addCreditColor = 'text-[#991B1B]';
  const borderBottomBanner = isDark ? 'border-[#15202B]' : 'border-[#1E2939]';

  return (
    <div className={`min-h-screen flex flex-col font-['Poppins'] ${pageBg} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />

      {/* Banner with animated SVG shapes */}
      <motion.section
        className={`relative py-12 md:py-[72px] border-b overflow-hidden px-4 sm:px-5 md:px-6 lg:px-8 ${borderBottomBanner}`}
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ background: bannerBg }}
      >
          <style>
            {`
              @keyframes gentleFloat1 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(8px, -12px) rotate(3deg) scale(1.02); }
              }
              @keyframes gentleFloat2 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-6px, 10px) rotate(-4deg) scale(0.98); }
              }
              @keyframes gentleFloat3 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(10px, 8px) rotate(2deg) scale(1.03); }
              }
              @keyframes gentleFloat4 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-8px, -10px) rotate(-3deg) scale(0.97); }
              }
              @keyframes gentleFloat5 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(7px, 12px) rotate(4deg) scale(1.01); }
              }
              @keyframes gentleFloat6 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-10px, 6px) rotate(-2deg) scale(0.99); }
              }
            `}
          </style>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: 'none', background: bannerBg }}>
          <g opacity={shapeOpacity} transform="translate(0, 75)" fill={shapeFill} stroke={shapeFill}>
            <rect height="69.7586" strokeLinejoin="round" strokeWidth="6" transform="rotate(30 30.7812 8.90192)" width="69.7586" x="30.7812" y="8.90192" style={{ animation: 'gentleFloat1 22s ease-in-out infinite' }} />
            <circle cx="76.9999" cy="238" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 18s ease-in-out infinite' }} />
            <circle cx="1040" cy="72" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 20s ease-in-out infinite' }} />
            <path d={svgPaths.p4f09b00} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat4 24s ease-in-out infinite' }} />
            <rect height="123" strokeLinejoin="round" strokeWidth="5" transform="rotate(31.9574 279.658 134.556)" width="123" x="279.658" y="134.556" fill="none" style={{ animation: 'gentleFloat5 19s ease-in-out infinite' }} />
            <circle cx="448" cy="95" r="61.5" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat6 21s ease-in-out infinite' }} />
            <path d={svgPaths.p1dcfb980} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat1 25s ease-in-out infinite' }} />
            <path d={svgPaths.p1c6b1700} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 23s ease-in-out infinite' }} />
            <path d={svgPaths.p3d6a600} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 26s ease-in-out infinite' }} />
            <path d={svgPaths.p347edc80} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat4 20s ease-in-out infinite' }} />
            <path d={svgPaths.peeaf800} strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat5 22s ease-in-out infinite' }} />
            <path d={svgPaths.pd790400} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat6 24s ease-in-out infinite' }} />
            <path d={svgPaths.pb073900} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat1 27s ease-in-out infinite' }} />
          </g>
        </svg>
        <div className="w-full max-w-[1070px] mx-auto relative z-10 px-4 text-left">
          <h1 className="text-[#F5F5F5] text-[48px] font-extrabold mb-[2px] font-['Poppins'] leading-[72px]">Submit Your Work</h1>
          <p className="text-[#F5F5F5] text-[18px] leading-[27px] font-['Poppins']">Send a Submission Request so our team can</p>
          <p className="text-[#F5F5F5] text-[18px] leading-[27px] font-['Poppins']">review and publish your project on <span className="font-extrabold">LIKHANI</span></p>
        </div>
      </motion.section>

      <div className="flex-1 w-full max-w-[1070px] mx-auto px-4 py-8">
        <button 
          onClick={() => navigate("/submit-work")}
          className={`flex items-center ${subTextColor} hover:opacity-80 transition-colors mb-6 text-sm font-medium`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <form onSubmit={handleSubmit} className={`${formBg} border ${formBorder} rounded-[16px] p-8 shadow-sm`}>
          <h2 className={`${headingColor} text-2xl font-bold mb-1`}>Student Request Form</h2>
          <p className={`${subTextColor} text-sm mb-8`}>Fill in complete project details. Admin approval is required before posting media.</p>

          {/* Section: About Your Work */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`${iconBoxBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <FileText className={`w-7 h-7 ${iconColor}`} />
              </div>
              <div>
                <h3 className={`${headingColor} text-lg font-bold`}>ABOUT YOUR WORK</h3>
                <p className={`${sectionDescColor} text-sm`}>Tell us about your project.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter the title of the work"
                className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A] transition-colors`}
                required
              />
            </div>
          </div>

          {/* Section: Credits */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`${iconBoxBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <Users className={`w-7 h-7 ${iconColor}`} />
              </div>
              <div>
                <h3 className={`${headingColor} text-lg font-bold`}>CREDITS</h3>
                <p className={`${sectionDescColor} text-sm`}>Who are the key people behind this work?</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Credits *</label>
              <p className={`${subTextColor} text-xs pb-1`}>Choose a role, then enter the name. Add more rows for additional contributors.</p>
              
              {credits.map((credit, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                  <CustomDropdown
                    value={credit.role}
                    onChange={(val) => handleCreditChange(index, "role", val)}
                    options={[
                      { value: "Director", label: "Director" },
                      { value: "Producer", label: "Producer" },
                      { value: "Writer", label: "Writer" },
                    ]}
                    placeholder="Select Role"
                    className="sm:w-[160px]"
                  />
                  <input
                    type="text"
                    value={credit.name}
                    onChange={(e) => handleCreditChange(index, "name", e.target.value)}
                    placeholder="Enter name"
                    className={`flex-1 w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A]`}
                  />
                  {credits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCredit(index)}
                      className={`${removeBtnBg} border ${inputBorder} ${removeBtnText} rounded-[10px] px-4 py-3 opacity-50 hover:opacity-80 transition-all w-full sm:w-auto mt-2 sm:mt-0`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCredit}
                className={`${addCreditColor} hover:opacity-80 text-sm font-medium flex items-center mt-2`}
              >
                + Add Credit
              </button>
            </div>
            
            <div className="space-y-2 mt-4">
              <label className={`${labelColor} text-sm font-semibold block`}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a concise synopsis (minimum 50 characters)"
                className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A] min-h-[145px] resize-y`}
                required
              />
            </div>
          </div>

          {/* Section: Categorization */}
          <div className="space-y-6 mb-10">
             <div className="mb-4">
                <h3 className={`${headingColor} text-base font-bold`}>Categorization</h3>
                <p className={`${subTextColor} text-xs`}>Add tags and categories to help organize this work.</p>
            </div>
            
            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Category *</label>
              <CustomDropdown
                value={form.category}
                onChange={(val) => handleDropdownChange("category", val)}
                options={
                  loadingCategories || categoriesError || categories.length === 0
                    ? []
                    : categories.map((cat) => ({
                        value: cat.displayLabel ?? cat.name,
                        label: cat.displayLabel ?? cat.name,
                      }))
                }
                placeholder={
                  loadingCategories
                    ? "Loading categories..."
                    : categoriesError
                    ? "Failed to load categories"
                    : categories.length === 0
                    ? "No categories available"
                    : "Select Category"
                }
                isFullWidth
              />
            </div>
            
            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. Filipino, Aviation, Documentary"
                className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A]`}
              />
            </div>
            
            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Copyright / License *</label>
              <CustomDropdown
                value={form.license}
                onChange={(val) => handleDropdownChange("license", val)}
                options={[
                  { value: "All Rights Reserved", label: "All Rights Reserved" },
                  { value: "Creative Commons", label: "Creative Commons" },
                ]}
                placeholder="Select License"
                isFullWidth
              />
            </div>
          </div>

          {/* Section: Academic Information */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`${iconBoxBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <Library className={`w-7 h-7 ${iconColor}`} />
              </div>
              <div>
                <h3 className={`${headingColor} text-lg font-bold uppercase`}>Academic Information</h3>
                <p className={`${sectionDescColor} text-sm`}>Help us connect your work to your academic journey.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Student ID Number — required, full width */}
                <div className="space-y-2 md:col-span-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>
                    Student ID Number *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={(e) => {
                      handleChange(e);
                      if (studentIdError) setStudentIdError("");
                    }}
                    placeholder="e.g. 2022-123456"
                    maxLength={11}
                    className={`w-full ${inputBg} border ${
                      studentIdError ? 'border-[#E7000B]' : inputBorder
                    } ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A] transition-colors`}
                    required
                  />
                  {studentIdError ? (
                    <p className={`text-xs font-medium ${errorColor}`}>{studentIdError}</p>
                  ) : (
                    <p className={`text-xs ${helperColor}`}>Format: XXXX-XXXXXX · APC student number</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>Program *</label>
                  <CustomDropdown
                    value={form.program}
                    onChange={(val) => handleDropdownChange("program", val)}
                    options={[
                      { value: "BS Multimedia Arts", label: "BS Multimedia Arts" },
                    ]}
                    placeholder="Select Program"
                    isFullWidth
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>Year Level *</label>
                  <CustomDropdown
                    value={form.yearLevel}
                    onChange={(val) => handleDropdownChange("yearLevel", val)}
                    options={[
                      { value: "1st Year", label: "1st Year" },
                      { value: "2nd Year", label: "2nd Year" },
                    ]}
                    placeholder="Select Year Level"
                    isFullWidth
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>Course/Subject</label>
                  <input
                    type="text"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g. Film Production"
                    className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A]`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>Section</label>
                  <input
                    type="text"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    placeholder="e.g. MMA301"
                    className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A]`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>School Year *</label>
                   <CustomDropdown
                    value={form.schoolYear}
                    onChange={(val) => handleDropdownChange("schoolYear", val)}
                    options={[
                      { value: "2023-2024", label: "2023-2024" },
                      { value: "2024-2025", label: "2024-2025" },
                    ]}
                    placeholder="Select School Year"
                    isFullWidth
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`${labelColor} text-sm font-semibold block`}>Faculty Advisor</label>
                  <input
                    type="text"
                    name="advisor"
                    value={form.advisor}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A]`}
                  />
                </div>
            </div>

            <div className="bg-[#EFF6FF] border border-[#BEDBFF] p-4 rounded-[10px] mt-4 flex items-center text-[#193CB8] text-sm">
                <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                Academic information helps organize works by program and enables analytics by department and year level.
            </div>
          </div>

          {/* Section: Visibility & Notes */}
           <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`${iconBoxBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <ShieldCheck className={`w-7 h-7 ${iconColor}`} />
              </div>
              <div>
                <h3 className={`${headingColor} text-lg font-bold uppercase`}>Visibility & Notes</h3>
                <p className={`${sectionDescColor} text-sm`}>Control how your work appears and add a note for our team.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Visibility *</label>
              <CustomDropdown
                value={form.visibility}
                onChange={(val) => handleDropdownChange("visibility", val)}
                options={[
                  { value: "Public", label: "Public (Anyone can view)" },
                  { value: "Institution", label: "Institution Only" },
                ]}
                placeholder="Select"
                className="sm:w-[344px]"
              />
            </div>

             <div className="space-y-2">
              <label className={`${labelColor} text-sm font-semibold block`}>Request Note for Review team (Optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add context about deadlines or screening notes"
                className={`w-full ${inputBg} border ${inputBorder} ${inputText} rounded-[10px] px-4 py-3 ${inputPlaceholder} focus:outline-none focus:border-[#8A181A] min-h-[120px]`}
              />
            </div>
          </div>

          <div className={`space-y-4 pt-6 border-t ${formBorder}`}>
             <label className="flex items-start gap-4 cursor-pointer pt-2">
                <input 
                    type="checkbox" 
                    checked={form.agreeToPolicy}
                    onChange={(e) => setForm({...form, agreeToPolicy: e.target.checked})}
                    className="w-[24px] h-[24px] rounded-[4px] flex-shrink-0 border-2 border-[#D1D5DC] mt-0.5 accent-[#8A181A] outline-none" 
                />
                <span className={`${checkboxText} text-[14px] leading-[20px] font-medium`}>
                    I confirm that this project is mine or properly credited, and I understand that <span className="text-[#8A181A] font-bold">LIKHANI</span> review submissions before publication.
                </span>
             </label>

             <div className="flex flex-col items-center pt-8 justify-center pb-4 text-center">
                <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted || !isFormValid}
                    className={`w-full sm:w-auto ${submitBg} ${submitHover} font-semibold text-base py-4 px-12 rounded-xl transition-all flex items-center justify-center gap-2 ${(!isFormValid && !isSubmitting && !isSubmitted) ? 'opacity-50 cursor-not-allowed' : ''} ${(isSubmitting || isSubmitted) ? 'cursor-not-allowed' : ''}`}
                 >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5"/>
                        <span>Submit for Review</span>
                      </>
                    )}
                </button>
                <p className={`mt-4 ${helperColor} text-sm flex items-center justify-center content-center w-full`}>We'll take it from here!</p>
                {!isFormValid && (
                    <p className={`mt-4 ${errorColor} text-xs font-medium`}>Missing required fields: Title, Credits, Description, Category, Copyright...</p>
                )}
             </div>
          </div>

        </form>
      </div>

      <SiteFooter />
    </div>
  );
}
