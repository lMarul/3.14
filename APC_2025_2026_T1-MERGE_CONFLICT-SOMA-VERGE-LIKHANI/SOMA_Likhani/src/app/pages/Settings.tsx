import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { BackButton } from "../components/navigation/BackButton";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useCustomTheme();
  const isDim = theme === 'dim';
  const isLightsOut = theme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <div className={`min-h-screen flex flex-col ${isLightsOut ? "bg-black" : isDim ? "bg-[#15202B]" : "bg-[#F7F6F3]"}`}>
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 relative w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto pt-[48px] pb-24 px-4 lg:px-8">
        
        <div className="absolute left-8 top-[48px] z-10 w-[52px]">
          <BackButton />
        </div>
        
        {/* Settings Container */}
        <div className="w-[768px] mx-auto mt-[51.5px] flex flex-col gap-[48px]">
          
          <h1 className={`font-['Poppins'] font-extrabold text-[36px] leading-[40px] ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
            Settings
          </h1>

          <div className="flex flex-col gap-[24px] w-full">
            
            {/* Appearance Section */}
            <section className={`rounded-[16px] ${isLightsOut ? "bg-black" : isDim ? "bg-[#253341]" : "bg-white"} border ${isLightsOut ? "border-gray-900" : isDim ? "border-[#38444D]" : "border-[#E5E7EB]"} p-[25px] w-[768px] flex flex-col gap-0 relative box-border`}>
              <h2 className={`font-['Poppins'] font-extrabold text-[18px] leading-[28px] ${isDark ? "text-white" : "text-[#1A1A1A]"} mb-[8px]`}>
                Appearance
              </h2>
              <p className="font-['Poppins'] font-bold text-[13px] leading-[20px] text-[#6B7280] mb-[24px]">
                Choose how Likhani looks to you. This setting applies everywhere.
              </p>

              {/* Theme Cards Container */}
              <div className="flex flex-row justify-center gap-[12px] mb-[26.5px] w-full">
                
                {/* Default Theme Card */}
                <button
                  onClick={() => setTheme('light')}
                  className={`box-border flex flex-col items-center p-4 gap-3 w-[231.28px] h-[210.35px] rounded-[16px] transition-all relative ${
                    theme === 'light'
                      ? 'bg-[rgba(138,24,26,0.08)] border-[1.07px] border-[#8A181A]'
                      : 'bg-transparent border-[1.07px] border-[#E5E7EB]'
                  }`}
                >
                  {/* Preview Container inner border */}
                  <div className="box-border flex flex-col items-start p-[1px] w-[197.15px] h-[123.22px] border-[1.07px] border-[#E5E7EB] rounded-[14px]">
                    <div className="flex flex-col w-[195px] h-[121px] bg-[#F7F6F3] rounded-[12px] overflow-hidden">
                      {/* Browser Top Bar */}
                      <div className="w-full h-[23px] box-border bg-white border-b-[1.07px] border-[#E5E7EB] relative">
                        <div className="absolute w-[12px] h-[6px] left-[12px] top-[8px] bg-[#8A181A] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[143px] top-[9px] bg-[#D1D5DB] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[167px] top-[9px] bg-[#D1D5DB] rounded-[6px]" />
                      </div>
                      {/* Browser Content */}
                      <div className="flex flex-row p-[12px] gap-[8px] w-full flex-1">
                        <div className="relative box-border w-[81.5px] h-[74px] bg-white border-[1.07px] border-[#E5E7EB] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#E5E7EB] rounded-[4px]" />
                          <div className="absolute w-[47.5px] h-[4px] left-[9px] top-[19px] bg-[#F3F4F6] rounded-[4px]" />
                          <div className="absolute w-[63.37px] h-[32px] left-[9px] top-[31px] bg-[#F0EFEC] rounded-[4px]" />
                        </div>
                        <div className="relative box-border w-[81.5px] h-[74px] bg-white border-[1.07px] border-[#E5E7EB] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#E5E7EB] rounded-[4px]" />
                          <div className="absolute w-[31.6px] h-[4px] left-[9px] top-[19px] bg-[#F3F4F6] rounded-[4px]" />
                          <div className="absolute w-[63.38px] h-[32px] left-[9px] top-[31px] bg-[#F0EFEC] rounded-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Label & Indicator Row */}
                  <div className="flex flex-row justify-between items-center w-[197.15px] h-[41px] px-[4px]">
                    <div className="flex flex-col items-start gap-[2px]">
                      <p className={`font-['Poppins'] font-extrabold text-[14px] leading-[21px] ${theme === 'light' ? 'text-[#8A181A]' : isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Default</p>
                      <p className="font-['Poppins'] font-bold text-[12px] leading-[18px] text-[#6B7280]">Warm white theme</p>
                    </div>
                    {theme === 'light' && (
                      <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#8A181A] rounded-full">
                        <svg className="w-[12px] h-[12px] text-white stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {/* Dim Theme Card */}
                <button
                  onClick={() => setTheme('dim')}
                  className={`box-border flex flex-col items-center p-4 gap-3 w-[231.28px] h-[210.35px] rounded-[16px] transition-all relative ${
                    theme === 'dim'
                      ? 'bg-[rgba(138,24,26,0.08)] border-[1.07px] border-[#8A181A]'
                      : 'bg-transparent border-[1.07px] border-[#E5E7EB]'
                  }`}
                >
                  <div className="box-border flex flex-col items-start p-[1px] w-[197.15px] h-[123.22px] border-[1.07px] border-[#E5E7EB] rounded-[14px]">
                    <div className="flex flex-col w-[195px] h-[121px] bg-[#15202B] rounded-[12px] overflow-hidden">
                      {/* Browser Top Bar */}
                      <div className="w-full h-[23px] box-border bg-[#0F1923] border-b-[1.07px] border-[#38444D] relative">
                        <div className="absolute w-[12px] h-[6px] left-[12px] top-[8px] bg-[#E84040] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[143px] top-[9px] bg-[#38444D] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[167px] top-[9px] bg-[#38444D] rounded-[6px]" />
                      </div>
                      {/* Browser Content */}
                      <div className="flex flex-row p-[12px] gap-[8px] w-full flex-1">
                        <div className="relative box-border w-[81.5px] h-[74px] bg-[#1E2A36] border-[1.07px] border-[#38444D] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#38444D] rounded-[4px]" />
                          <div className="absolute w-[47.5px] h-[4px] left-[9px] top-[19px] bg-[#2F3C47] rounded-[4px]" />
                          <div className="absolute w-[63.37px] h-[32px] left-[9px] top-[31px] bg-[#1A2634] rounded-[4px]" />
                        </div>
                        <div className="relative box-border w-[81.5px] h-[74px] bg-[#1E2A36] border-[1.07px] border-[#38444D] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#38444D] rounded-[4px]" />
                          <div className="absolute w-[31.6px] h-[4px] left-[9px] top-[19px] bg-[#2F3C47] rounded-[4px]" />
                          <div className="absolute w-[63.38px] h-[32px] left-[9px] top-[31px] bg-[#1A2634] rounded-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row justify-between items-center w-[197.15px] h-[41px] px-[4px]">
                    <div className="flex flex-col items-start gap-[2px]">
                      <p className={`font-['Poppins'] font-extrabold text-[14px] leading-[21px] ${theme === 'dim' ? 'text-[#8A181A]' : isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Dim</p>
                      <p className="font-['Poppins'] font-bold text-[12px] leading-[18px] text-[#6B7280]">Easy on the eyes</p>
                    </div>
                    {theme === 'dim' && (
                      <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#8A181A] rounded-full">
                        <svg className="w-[12px] h-[12px] text-white stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {/* Lights Out Theme Card */}
                <button
                  onClick={() => setTheme('lights-out')}
                  className={`box-border flex flex-col items-center p-4 gap-3 w-[231.28px] h-[210.35px] rounded-[16px] transition-all relative ${
                    theme === 'lights-out'
                      ? 'bg-[rgba(138,24,26,0.08)] border-[1.07px] border-[#8A181A]'
                      : 'bg-transparent border-[1.07px] border-[#E5E7EB]'
                  }`}
                >
                  <div className="box-border flex flex-col items-start p-[1px] w-[197.15px] h-[123.22px] border-[1.07px] border-[#E5E7EB] rounded-[14px]">
                    <div className="flex flex-col w-[195px] h-[121px] bg-[#000000] rounded-[12px] overflow-hidden">
                      {/* Browser Top Bar */}
                      <div className="w-full h-[23px] box-border bg-[#000000] border-b-[1.07px] border-[#2F3336] relative">
                        <div className="absolute w-[12px] h-[6px] left-[12px] top-[8px] bg-[#E84040] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[143px] top-[9px] bg-[#2F3336] rounded-[6px]" />
                        <div className="absolute w-[16px] h-[4px] left-[167px] top-[9px] bg-[#2F3336] rounded-[6px]" />
                      </div>
                      {/* Browser Content */}
                      <div className="flex flex-row p-[12px] gap-[8px] w-full flex-1">
                        <div className="relative box-border w-[81.5px] h-[74px] bg-[#0F0F0F] border-[1.07px] border-[#2F3336] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#2F3336] rounded-[4px]" />
                          <div className="absolute w-[47.5px] h-[4px] left-[9px] top-[19px] bg-[#1A1A1A] rounded-[4px]" />
                          <div className="absolute w-[63.37px] h-[32px] left-[9px] top-[31px] bg-[#111111] rounded-[4px]" />
                        </div>
                        <div className="relative box-border w-[81.5px] h-[74px] bg-[#0F0F0F] border-[1.07px] border-[#2F3336] rounded-[10px]">
                          <div className="absolute w-[63px] h-[6px] left-[9px] top-[9px] bg-[#2F3336] rounded-[4px]" />
                          <div className="absolute w-[31.6px] h-[4px] left-[9px] top-[19px] bg-[#1A1A1A] rounded-[4px]" />
                          <div className="absolute w-[63.38px] h-[32px] left-[9px] top-[31px] bg-[#111111] rounded-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row justify-between items-center w-[197.15px] h-[41px] px-[4px]">
                    <div className="flex flex-col items-start gap-[2px]">
                      <p className={`font-['Poppins'] font-extrabold text-[14px] leading-[21px] ${theme === 'system' ? 'text-[#8A181A]' : isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Lights Out</p>
                      <p className="font-['Poppins'] font-bold text-[12px] leading-[18px] text-[#6B7280]">True black for OLED</p>
                    </div>
                    {theme === 'system' && (
                      <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#8A181A] rounded-full">
                        <svg className="w-[12px] h-[12px] text-white stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Status Note */}
              <div className={`box-border flex flex-row items-center p-[10px] px-[16px] gap-[8px] w-[717.87px] h-[40px] rounded-[14px] border-[1.07px] ${isLightsOut ? "bg-black border-gray-900" : isDim ? "bg-[#1E2A36] border-[#38444D]" : "bg-[#F3F2EF] border-[#F0EFEC]"}`}>
                <div className="w-[8px] h-[8px] bg-[#8A181A] rounded-full" />
                <p className="font-['Poppins'] font-extrabold text-[12px] leading-[18px] text-[#6B7280]">
                  {theme === 'light' 
                    ? "Default mode — clean, bright surfaces optimised for daytime viewing."
                    : theme === 'dim' 
                    ? "Dim mode — reduced brightness for comfortable evening reading."
                    : "Lights out — true black backgrounds, perfect for OLED screens."
                  }
                </p>
              </div>
            </section>

            {/* About Section */}
            <section className={`rounded-[16px] border p-[25px] w-[768px] flex flex-col gap-[16px] box-border ${isLightsOut ? "bg-black border-gray-900" : isDim ? "bg-[#253341] border-[#38444D]" : "bg-white border-[#E5E7EB]"}`}>
              <h2 className={`font-['Poppins'] font-extrabold text-[18px] leading-[28px] ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                About
              </h2>
              
              <div className="flex flex-col gap-[12px] w-[717.87px]">
                <div className="w-full h-[44px] relative">
                  <p className="absolute font-['Poppins'] font-extrabold text-[14px] leading-[20px] text-[#6B7280]">Version</p>
                  <p className={`absolute top-[20px] font-['Poppins'] font-extrabold text-[16px] leading-[24px] ${isDark ? "text-[#E5E7EB]" : "text-[#1A1A1A]"}`}>1.0.0</p>
                </div>

                <div className="w-full h-[44px] relative">
                  <p className="absolute font-['Poppins'] font-extrabold text-[14px] leading-[20px] text-[#6B7280]">Platform</p>
                  <p className={`absolute top-[20px] font-['Poppins'] font-extrabold text-[16px] leading-[24px] ${isDark ? "text-[#E5E7EB]" : "text-[#1A1A1A]"}`}>Likhani Archive</p>
                </div>

                <div className="w-full h-[44px] relative">
                  <p className="absolute font-['Poppins'] font-extrabold text-[14px] leading-[20px] text-[#6B7280]">Institution</p>
                  <p className={`absolute top-[20px] font-['Poppins'] font-extrabold text-[16px] leading-[24px] ${isDark ? "text-[#E5E7EB]" : "text-[#1A1A1A]"}`}>Asia Pacific College</p>
                </div>
              </div>
            </section>

            {/* Legal Section */}
            <section className={`rounded-[16px] border p-[25px] w-[768px] flex flex-col gap-[16px] box-border ${isLightsOut ? "bg-black border-gray-900" : isDim ? "bg-[#253341] border-[#38444D]" : "bg-white border-[#E5E7EB]"}`}>
              <h2 className={`font-['Poppins'] font-extrabold text-[18px] leading-[28px] ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                Legal
              </h2>
              
              <div className="flex flex-col gap-[4px] w-[717.87px]">
                <button
                  onClick={() => navigate("/terms")}
                  className={`w-full h-[64px] rounded-[14px] transition-colors relative text-left box-border ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  <p className={`absolute left-[12px] top-[11px] font-['Poppins'] font-extrabold text-[14px] leading-[20px] ${isDark ? "text-[#E5E7EB]" : "text-[#1A1A1A]"}`}>Terms of Use</p>
                  <p className="absolute left-[12px] top-[31px] font-['Poppins'] font-bold text-[14px] leading-[20px] text-[#6B7280]">Review our terms and conditions</p>
                </button>

                <button
                  onClick={() => navigate("/guidelines")}
                  className={`w-full h-[64px] rounded-[14px] transition-colors relative text-left box-border ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  <p className={`absolute left-[12px] top-[11px] font-['Poppins'] font-extrabold text-[14px] leading-[20px] ${isDark ? "text-[#E5E7EB]" : "text-[#1A1A1A]"}`}>Submission Guidelines</p>
                  <p className="absolute left-[12px] top-[31px] font-['Poppins'] font-bold text-[14px] leading-[20px] text-[#6B7280]">Learn how to submit your work</p>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

