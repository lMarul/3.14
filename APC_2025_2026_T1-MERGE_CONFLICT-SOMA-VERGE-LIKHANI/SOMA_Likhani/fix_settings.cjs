const fs = require('fs');
let c = fs.readFileSync('C:/Users/Maru/Desktop/Projects/SOMA Projects/SOMA Verge/APC_2025_2026_T1-MERGE_CONFLICT-SOMAVAULT/SOMA_Likhani/src/app/pages/Settings.tsx', 'utf8');

c = c.replace(/className="min-h-screen flex flex-col bg-\[#F7F6F3\]"/, 'className={`min-h-screen flex flex-col ${isLightsOut ? "bg-black" : isDim ? "bg-[#111111]" : "bg-[#F7F6F3]"}`}');

// Update the appearance card text colors to respond to dark mode
c = c.replace(/className="bg-white rounded-\[16px\]/, 'className={`rounded-[16px] ${isLightsOut ? "bg-black" : isDim ? "bg-[#121212]" : "bg-white"}');
c = c.replace(/border border-\[#E5E7EB\] p-\[25px\] w-\[768px\] flex flex-col gap-0 relative box-border"/, 'border ${isLightsOut ? "border-gray-900" : isDim ? "border-gray-800" : "border-[#E5E7EB]"} p-[25px] w-[768px] flex flex-col gap-0 relative box-border`}');

c = c.replace(/className="font-\['Poppins'\] font-extrabold text-\[18px\] leading-\[28px\] text-\[#1A1A1A\]/, 'className={`font-[\'Poppins\'] font-extrabold text-[18px] leading-[28px] ${isDark ? "text-white" : "text-[#1A1A1A]"}');
c = c.replace(/mb-\[8px\]"/, 'mb-[8px]`}');

fs.writeFileSync('C:/Users/Maru/Desktop/Projects/SOMA Projects/SOMA Verge/APC_2025_2026_T1-MERGE_CONFLICT-SOMAVAULT/SOMA_Likhani/src/app/pages/Settings.tsx', c);
