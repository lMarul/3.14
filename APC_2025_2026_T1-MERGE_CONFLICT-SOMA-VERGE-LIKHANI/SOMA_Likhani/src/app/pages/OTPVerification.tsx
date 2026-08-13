import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Group from "../../generated/Group";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import svgPaths from "../../generated/svg-cq2lewbljb";

export default function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-verify when OTP is complete
  useEffect(() => {
    const code = otp.join("");
    // Check if all 6 digits are filled
    if (code.length === 6) {
      // Automatically trigger verification logic
      const timer = setTimeout(() => {
        handleVerify(code);
      }, 300); // Slight delay for better UX ("breathing" moment)
      return () => clearTimeout(timer);
    }
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError("");

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on Backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = (codeOverride?: string) => {
    const code = codeOverride || otp.join("");
    
    if (code.length < 6) {
      setError("Please enter the complete verification code.");
      return;
    }
    
    setIsVerifying(true);

    // Demo-only behavior: Any 6-digit code is valid
    // No strict validation or backend simulation
    
    // Simulate a brief processing delay for "breathing" personality
    setTimeout(() => {
      // If the user was redirected here from an age-restricted entry, return them there
      const returnTo = localStorage.getItem("returnTo");
      if (returnTo) {
        localStorage.removeItem("returnTo");
        navigate(returnTo);
      } else {
        navigate("/home");
      }
    }, 800);
  };

  // Check if all fields are filled
  const isComplete = otp.every(digit => digit !== "");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 font-['Poppins'] relative overflow-hidden">
      {/* Animated Shapes Background with Dark Crimson */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1400 600"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          style={{ background: '#8A181A' }}
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
          <g opacity="0.21" transform="translate(0, 150)">
            <rect fill="#CD5D5D" height="69.7586" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" transform="rotate(30 30.7812 8.90192)" width="69.7586" x="30.7812" y="8.90192" style={{ animation: 'gentleFloat1 22s ease-in-out infinite' }} />
            <circle cx="76.9999" cy="238" fill="#CD5D5D" r="62" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 18s ease-in-out infinite' }} />
            <circle cx="1040" cy="72" fill="#CD5D5D" r="62" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 20s ease-in-out infinite' }} />
            <path d={svgPaths.p4f09b00} fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat4 24s ease-in-out infinite' }} />
            <rect height="123" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" transform="rotate(31.9574 279.658 134.556)" width="123" x="279.658" y="134.556" fill="none" style={{ animation: 'gentleFloat5 19s ease-in-out infinite' }} />
            <circle cx="448" cy="95" r="61.5" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat6 21s ease-in-out infinite' }} />
            <path d={svgPaths.p1dcfb980} stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat1 25s ease-in-out infinite' }} />
            <path d={svgPaths.p1c6b1700} fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 23s ease-in-out infinite' }} />
            <path d={svgPaths.p3d6a600} fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 26s ease-in-out infinite' }} />
            <path d={svgPaths.p347edc80} stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat4 20s ease-in-out infinite' }} />
            <path d={svgPaths.peeaf800} stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat5 22s ease-in-out infinite' }} />
            <path d={svgPaths.pd790400} stroke="#CD5D5D" strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat6 24s ease-in-out infinite' }} />
            <path d={svgPaths.pb073900} stroke="#CD5D5D" strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat1 27s ease-in-out infinite' }} />
            <circle cx="900" cy="420" r="62" fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat4 21s ease-in-out infinite' }} />
            <circle cx="1280" cy="180" r="62" fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat5 19s ease-in-out infinite' }} />
            <rect fill="#CD5D5D" height="69.7586" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" transform="rotate(45 950 250)" width="69.7586" x="950" y="250" style={{ animation: 'gentleFloat6 24s ease-in-out infinite' }} />
            <rect fill="#CD5D5D" height="69.7586" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" transform="rotate(15 1180 490)" width="69.7586" x="1180" y="490" style={{ animation: 'gentleFloat1 26s ease-in-out infinite' }} />
            <rect height="123" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" transform="rotate(25 820 140)" width="123" x="820" y="140" fill="none" style={{ animation: 'gentleFloat2 23s ease-in-out infinite' }} />
            <rect height="123" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" transform="rotate(50 560 360)" width="123" x="560" y="360" fill="none" style={{ animation: 'gentleFloat3 25s ease-in-out infinite' }} />
            <circle cx="630" cy="520" r="61.5" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat4 22s ease-in-out infinite' }} />
            <circle cx="1340" cy="380" r="61.5" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat5 20s ease-in-out infinite' }} />
            <path d="M1100 100 L1150 180 L1050 180 Z" fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat6 28s ease-in-out infinite' }} />
            <path d="M700 480 L750 560 L650 560 Z" fill="#CD5D5D" stroke="#CD5D5D" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat1 24s ease-in-out infinite' }} />
            <path d="M200 100 Q250 150 200 200" stroke="#CD5D5D" strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat2 29s ease-in-out infinite' }} />
            <path d="M1200 250 Q1250 300 1200 350" stroke="#CD5D5D" strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat3 27s ease-in-out infinite' }} />
            <path d="M850 550 Q900 600 850 650" stroke="#CD5D5D" strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat4 25s ease-in-out infinite' }} />
            <circle cx="380" cy="280" r="35" fill="#CD5D5D" stroke="#CD5D5D" strokeWidth="4" style={{ animation: 'gentleFloat5 18s ease-in-out infinite' }} />
            <circle cx="1050" cy="530" r="35" fill="#CD5D5D" stroke="#CD5D5D" strokeWidth="4" style={{ animation: 'gentleFloat6 20s ease-in-out infinite' }} />
            <circle cx="140" cy="450" r="30" stroke="#CD5D5D" strokeWidth="4" fill="none" style={{ animation: 'gentleFloat1 17s ease-in-out infinite' }} />
            <circle cx="1300" cy="520" r="30" stroke="#CD5D5D" strokeWidth="4" fill="none" style={{ animation: 'gentleFloat2 19s ease-in-out infinite' }} />
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-[300px] h-[70px]">
            <Group />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-xl">
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-500 hover:text-[#8a181a] transition-colors text-sm font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your account</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent a 6-digit verification code to your email ending in <span className="font-semibold text-gray-900">@apc.edu.ph</span>.
            </p>
          </div>

          <motion.div 
            className="flex justify-between gap-2 mb-8"
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className={`w-12 h-14 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a181a]/20 transition-all ${
                    error 
                      ? "border-red-500 text-red-600 focus:border-red-500 bg-red-50" 
                      : "border-gray-300 text-gray-900 focus:border-[#8a181a] bg-white"
                  }`}
                  placeholder="-"
                />
              </div>
            ))}
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-[#d4183d] text-sm font-medium mb-6 bg-red-50 p-3 rounded-lg border border-red-100"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={() => handleVerify()} 
            className="w-full text-base py-6"
            size="lg"
            disabled={!isComplete || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Account"}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button className="text-[#8a181a] font-bold hover:underline">
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
