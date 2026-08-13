import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Upload, FileText } from "lucide-react";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { motion } from "motion/react";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";
import { BackButton } from "../components/navigation/BackButton";
import { PageContainer } from "../components/layout/PageContainer";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    document.title = "My Submissions | Likhani";
    setMounted(true);
    const guestMode = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestMode);
    
    // Redirect guests to home
    if (guestMode) {
      navigate("/home");
    }
  }, [navigate]);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  // Mock submission data
  const submission = {
    id: "SUB-2026-001234",
    title: "Resilience in the Modern Age: A Documentary on Filipino Youth",
    status: "pending_endorsement",
    uploadedDate: "February 15, 2026",
    lastUpdated: "February 17, 2026",
    professor1: {
      name: "Prof. Maria Santos",
      status: "approved",
      approvedDate: "February 16, 2026",
    },
    professor2: {
      name: "Prof. Juan Dela Cruz",
      status: "pending",
      approvedDate: null,
    },
  };

  const submissionSteps = [
    { label: "Submission Received", status: "completed" },
    { label: "Faculty Endorsement (2 Required)", status: "in_progress" },
    { label: "Admin Review", status: "pending" },
    { label: "Published", status: "pending" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f7f6f3] text-gray-900"}`}>
      <Navbar />

      {/* Main Content */}
      <PageContainer className="py-12">
        <div className="mb-8">
          <BackButton className="mb-8" />
          <h1 className="font-['Poppins'] font-extrabold text-[42px] mb-2">My Submissions</h1>
          <p className="font-['Poppins'] text-[14px] text-gray-500">
            Track your submissions and endorsement status
          </p>
        </div>

        {/* Submission Tracker Card */}
        <div className={`rounded-2xl p-8 shadow-sm mb-8 border transition-colors ${isLightsOut ? "bg-[#000000] border-gray-700" : isDim ? "bg-[#253341] border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-['Poppins'] font-bold text-2xl line-clamp-1">
                  {submission.title}
                </h2>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <p className="font-['Poppins'] text-[12px] text-gray-500">
                  ID: <span className={`font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{submission.id}</span>
                </p>
                <span className="text-gray-300">•</span>
                <p className="font-['Poppins'] text-[12px] text-gray-500">
                  Uploaded: {submission.uploadedDate}
                </p>
                <span className="text-gray-300">•</span>
                <p className="font-['Poppins'] text-[12px] text-gray-500">
                  Last Updated: {submission.lastUpdated}
                </p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
               <Button 
                variant="secondary"
                size="sm"
                onClick={() => navigate("/guidelines")}
                className="font-['Poppins'] font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Guidelines
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <h3 className={`font-['Poppins'] font-bold text-lg mb-6 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Submission Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {submissionSteps.map((step, index) => (
                <div key={index} className="relative z-10">
                  <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all h-full ${
                    step.status === "completed" 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                      : step.status === "in_progress"
                      ? "border-[#8a181a] bg-[#8a181a]/5 dark:bg-[#8a181a]/10"
                      : isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "completed"
                        ? "bg-green-500 text-white"
                        : step.status === "in_progress"
                        ? "bg-[#8a181a] text-white"
                        : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-300 text-gray-600"
                    }`}>
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : step.status === "in_progress" ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <p className={`font-['Poppins'] text-[11px] font-bold leading-tight ${
                      step.status === "completed"
                        ? "text-green-700 dark:text-green-400"
                        : step.status === "in_progress"
                        ? "text-[#8a181a] dark:text-[#ff4b4b]"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < submissionSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-6 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Endorsement Section */}
          <div className={`border-t pt-8 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <h3 className={`font-['Poppins'] font-bold text-lg mb-6 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Faculty Endorsement Status</h3>
            <div className="flex flex-col gap-6"> 
              {/* Using Flex Column with gap to ensure even spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Professor 1 */}
                <motion.div 
                  className={`p-6 rounded-xl border-2 flex flex-col justify-between h-full ${
                    submission.professor1.status === "approved"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                        Endorser 1
                      </p>
                      <p className="font-['Poppins'] font-bold text-[16px]">
                        {submission.professor1.name}
                      </p>
                    </div>
                    {submission.professor1.status === "approved" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  {submission.professor1.status === "approved" ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-800 rounded-lg w-fit">
                      <span className="font-['Poppins'] text-[12px] font-bold text-green-700 dark:text-green-400">
                        Approved on {submission.professor1.approvedDate}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-lg w-fit">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                      <span className="font-['Poppins'] text-[12px] font-bold text-amber-700 dark:text-amber-500">
                        Pending Review
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Professor 2 */}
                <motion.div 
                  className={`p-6 rounded-xl border-2 flex flex-col justify-between h-full ${
                    submission.professor2.status === "approved"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-['Poppins'] text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                        Endorser 2
                      </p>
                      <p className="font-['Poppins'] font-bold text-[16px]">
                        {submission.professor2.name}
                      </p>
                    </div>
                    {submission.professor2.status === "approved" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </div>
                  {submission.professor2.status === "approved" ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-800 rounded-lg w-fit">
                      <span className="font-['Poppins'] text-[12px] font-bold text-green-700 dark:text-green-400">
                        Approved on {submission.professor2.approvedDate}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-lg w-fit">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                      <span className="font-['Poppins'] text-[12px] font-bold text-amber-700 dark:text-amber-500">
                        Pending Review
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Final Status Badge */}
              {submission.professor1.status === "approved" && submission.professor2.status === "approved" ? (
                <motion.div 
                  className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-bold text-lg text-green-800 dark:text-green-400 mb-1">
                        Final Approved Version – Ready for Admin Review
                      </p>
                      <p className="font-['Poppins'] text-sm text-green-700 dark:text-green-300">
                        Both faculty endorsements completed. Your submission will be reviewed by administration shortly.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-bold text-blue-800 dark:text-blue-400 mb-1">
                        Awaiting Faculty Endorsement
                      </p>
                      <p className="font-['Poppins'] text-sm text-blue-700 dark:text-blue-300">
                        {submission.professor1.status === "approved" 
                          ? "One endorsement received. Waiting for second faculty review."
                          : "Your submission is under review by assigned faculty members."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
