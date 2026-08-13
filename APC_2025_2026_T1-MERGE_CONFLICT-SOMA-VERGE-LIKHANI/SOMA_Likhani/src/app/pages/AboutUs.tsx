import { useState, useEffect } from "react";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { Navbar } from "../components/layout/Navbar";
import { SiteFooter } from "../components/layout/SiteFooter";
import { motion, useScroll, useTransform } from "motion/react";
import svgPaths from "../../generated/svg-cq2lewbljb";
import { useSiteConfig } from "../hooks/useLikhaniData";

export default function AboutUs() {
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { config, loading } = useSiteConfig('about_page');

  const missionStatement = config.mission_statement || "To preserve, showcase, and celebrate the cinematic and multimedia works of APC students, fostering a legacy of creativity and innovation that inspires future generations.";
  const institutionName = config.institution_name || "LIKHANI";
  const institutionTagline = config.institution_tagline || "A digital archive for the creative excellence of Asia Pacific College - Multimedia Arts.";
  const logoUrl = config.logo_url;
  
  // Default fallback team if DB is empty
  const defaultTeam = [
    { name: "Jim Pangan", role: "Somavault Adviser", category: "Leadership" },
    { name: "Carl Dominique Bueno", role: "Merge Conflict Adviser", category: "Leadership" },
    { name: "Sofia Cassandra Borje", role: "Project Manager", category: "Faculty" },
    { name: "Marwin John Gonzales", role: "Project Manager", category: "Faculty" },
    { name: "Vince Nelmar Alobin", role: "Full Stack Developer", category: "Student Team" },
    { name: "Alliah Kassandra Pedro", role: "UI/UX Designer", category: "Student Team" },
    { name: "Jim Escander", role: "UI/UX Designer", category: "Student Team" },
    { name: "Shandy Alingasa", role: "UI/UX Designer", category: "Student Team" },
    { name: "Sean Amiel Magalong", role: "Documentation", category: "Student Team" },
    { name: "Jhey-Zee Anne Cruz", role: "Visual Experience Designer", category: "Student Team" },
    { name: "Kyla Mae Tan", role: "Visual Experience Designer", category: "Student Team" },
    { name: "Qelvin Nagales", role: "Quality Assurance for UI/UX", category: "Student Team" },
    { name: "Rick Francis Cruz", role: "Quality Assurance", category: "Student Team" }
  ];

  const teamMembers = config.team_members?.length > 0 ? config.team_members : defaultTeam;

  // Group members by category
  const groupedMembers = teamMembers.reduce((acc: Record<string, any[]>, member: any) => {
    const cat = member.category || 'Our Team';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(member);
    return acc;
  }, {});

  // Sort categories - Leadership first, then Faculty, then Student Team, then others
  const categoryOrder = ['Leadership', 'Faculty', 'Student Team', 'Collaborators', 'Our Team'];
  const sortedCategories = Object.keys(groupedMembers).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
        <div className="animate-pulse font-['Poppins'] font-bold text-xl">
          Loading Likhani...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-hidden ${isLightsOut ? 'bg-[#000000] text-white' : isDim ? 'bg-[#15202B] text-white' : 'bg-[#f5f5f5] text-gray-900'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className={`relative w-full h-[80vh] md:h-[596px] flex flex-col items-center justify-center overflow-hidden ${isLightsOut ? 'bg-[#000000]' : isDim ? 'bg-[#15202B]' : 'bg-[#F7F6F3]'}`}>
        <div className="absolute inset-0 pointer-events-none bg-[#15202B] opacity-10" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-[846px] mx-auto px-4 mt-[35px]">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-['Poppins'] font-extrabold text-[36px] sm:text-[48px] md:text-[56px] leading-[1.2] md:leading-[84px] tracking-[-1.4px]" 
            style={{ color: isDark ? '#E84040' : '#8A181A' }}
          >
            {institutionName}
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[6px] rounded-full mt-[16px] md:mt-[24px] mb-[24px] md:mb-[32px]" 
            style={{ backgroundColor: isDark ? '#E84040' : '#8A181A' }} 
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Poppins'] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[1.6] md:leading-[32px]"
            style={{ color: isDark ? '#D1D5DC' : '#364153' }}
          >
            {institutionTagline}
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`w-full py-12 md:h-[455px] flex items-center justify-center relative z-10 ${isLightsOut ? 'bg-[#000000]' : isDim ? 'bg-[#0F1923]' : 'bg-[#FFFFFF]'}`}>
        <div className="w-full max-w-[1000px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between mx-auto gap-8 md:gap-[66px]">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="flex flex-col gap-[24px] w-full md:w-[468px] text-center md:text-left"
          >
             <h2 className={`font-['Poppins'] font-bold text-[24px] md:text-[30px] leading-[36px] ${isDark ? "text-white" : "text-[#101828]"}`}>
               Our Mission
             </h2>
             <p className={`font-['Poppins'] font-normal text-[16px] md:text-[18px] leading-[29px] ${isDark ? "text-gray-400" : "text-[#4A5565]"}`}>
               {missionStatement}
             </p>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className={`w-full max-w-[468px] h-[200px] md:h-[263px] rounded-[16px] flex items-center justify-center overflow-hidden ${isDark ? "bg-white/5" : "bg-[#F3F4F6]"}`}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Institution Logo" className="max-w-full max-h-full object-contain p-4" />
            ) : (
              <span className="font-['Poppins'] font-normal text-[14px] leading-[20px] text-[#99A1AF]">
                [Institution Logo]
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Team Section with Categorized Grid */}
      <section className={`py-[64px] md:py-[96px] w-full relative z-10 transition-colors ${isLightsOut ? 'bg-[#000000]' : isDim ? 'bg-[#15202B]' : 'bg-[#F7F6F3]'}`}>
        <div className="w-full max-w-[1200px] px-4 mx-auto flex flex-col items-center">
          
          {/* If we have the new team_sections structure */}
          {config.team_sections && config.team_sections.length > 0 ? (
            <div className="flex flex-col gap-[80px] md:gap-[120px] w-full max-w-[1152px]">
              {config.team_sections.map((section: any, sIdx: number) => (
                <div key={section.id || sIdx} className="flex flex-col items-center">
                  <motion.div 
                    className="flex flex-col items-center justify-center gap-[8px] mb-[40px] md:mb-[64px] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="font-['Poppins'] font-extrabold text-[28px] md:text-[36px] leading-[40px] md:leading-[54px] tracking-[-0.9px]" style={{ color: isDark ? 'white' : '#101828' }}>{section.title}</h2>
                    {section.subtitle && (
                      <p className="font-['Poppins'] font-medium text-[16px] md:text-[18px] leading-[28px] text-[#6A7282]">{section.subtitle}</p>
                    )}
                  </motion.div>

                  <div className="flex flex-wrap justify-center gap-x-[16px] md:gap-x-[32px] gap-y-[32px] md:gap-y-[48px] mx-auto">
                    {(section.members || []).map((member: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="text-center group w-[140px] sm:w-[200px] md:w-[264px]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
                      >
                        <div className="relative mb-4 md:mb-6 mx-auto w-24 h-24 md:w-32 md:h-32">
                          <div className={`absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-gray-200 to-transparent'}`} />
                          <div className={`absolute inset-1 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold overflow-hidden ${isLightsOut ? 'bg-[#000000] text-white/20' : isDim ? 'bg-[#253341] text-white/20' : 'bg-white text-gray-300'}`}>
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              member.name.charAt(0)
                            )}
                          </div>
                        </div>
                        <h3 className="font-['Poppins'] font-bold text-[14px] md:text-[16px] mb-1 transition-colors group-hover:text-[#8a181a] break-words" style={{ color: isDark ? 'white' : 'inherit' }}>{member.name}</h3>
                        <p className={`font-['Poppins'] text-[12px] md:text-[13px] font-medium tracking-wide break-words ${isDark ? 'text-[#99A1AF]' : 'text-gray-500'}`}>{member.role}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback to legacy grouped categories logic */
            <>
              <motion.div 
                className="flex flex-col items-center justify-center gap-[8px] mb-[40px] md:mb-[64px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-['Poppins'] font-extrabold text-[28px] md:text-[36px] leading-[40px] md:leading-[54px] tracking-[-0.9px] text-center" style={{ color: isDark ? 'white' : '#101828' }}>The Creative Team</h2>
                <p className="font-['Poppins'] font-medium text-[16px] md:text-[18px] leading-[28px] text-[#6A7282] text-center">Design & User Experience</p>
              </motion.div>

              <div className="flex flex-col gap-[60px] md:gap-[80px] w-full max-w-[1152px]">
                {sortedCategories.map((category) => (
                  <div key={category} className="flex flex-col gap-[30px] md:gap-[40px]">
                    <div className="flex items-center gap-4">
                      <h3 className={`font-['Poppins'] font-bold text-[20px] md:text-[22px] tracking-tight ${isDark ? 'text-white' : 'text-[#101828]'}`}>
                        {category}
                      </h3>
                      <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-[16px] md:gap-x-[32px] gap-y-[32px] md:gap-y-[48px] mx-auto">
                      {groupedMembers[category].map((member: any, index: number) => (
                        <motion.div 
                          key={index} 
                          className="text-center group w-[140px] sm:w-[200px] md:w-[264px]"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
                        >
                          <div className="relative mb-4 md:mb-6 mx-auto w-24 h-24 md:w-32 md:h-32">
                            <div className={`absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-gray-200 to-transparent'}`} />
                            <div className={`absolute inset-1 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold overflow-hidden ${isLightsOut ? 'bg-[#000000] text-white/20' : isDim ? 'bg-[#253341] text-white/20' : 'bg-white text-gray-300'}`}>
                              {member.image_url ? (
                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name.charAt(0)
                              )}
                            </div>
                          </div>
                          <h3 className="font-['Poppins'] font-bold text-[14px] md:text-[16px] mb-1 transition-colors group-hover:text-[#8a181a] break-words" style={{ color: isDark ? 'white' : 'inherit' }}>{member.name}</h3>
                          <p className={`font-['Poppins'] text-[12px] md:text-[13px] font-medium tracking-wide break-words ${isDark ? 'text-[#99A1AF]' : 'text-gray-500'}`}>{member.role}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
