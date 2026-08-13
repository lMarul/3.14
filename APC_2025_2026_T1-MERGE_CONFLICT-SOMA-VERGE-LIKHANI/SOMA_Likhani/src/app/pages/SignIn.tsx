import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import logoSvgPaths from "../../generated/svg-visrh8vm2b";
import { supabase } from "../lib/supabase";
import { setAuthedStorage, setGuestStorage } from "../lib/authStorage";
import { ensureAppUser } from "../lib/appUser";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Enforce explicit light mode for this page independently of user preference
  useEffect(() => {
    const root = window.document.documentElement;
    const originalClasses = Array.from(root.classList);
    root.classList.remove('dark', 'dim', 'lights-out');
    root.classList.add('light');

    return () => {
      // Restore original theme classes when navigating away
      root.classList.remove('light');
      if (originalClasses.length > 0) {
        root.classList.add(...originalClasses);
      }
    };
  }, []);

  const isValidAPCEmail = (email: string) => {
    const emailLower = email.toLowerCase();
    return emailLower.endsWith("@apc.edu.ph") || emailLower.endsWith("@student.apc.edu.ph");
  };

  const handleSignIn = async () => {
    if (!isValidAPCEmail(email)) {
      setEmailError("Please use your APC email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);
      const client = supabase;
      if (!client) {
        setIsLoading(false);
        toast.error("Supabase is not configured.");
        return;
      }

      const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setIsLoading(false);
      toast.error(error?.message || "Sign in failed.");
      return;
    }

    try {
      await ensureAppUser(data.user);
      setAuthedStorage(data.user);
      toast.success("Signed in successfully.");
      navigate("/home");
    } catch (upsertError) {
      const message = upsertError instanceof Error ? upsertError.message : "Failed to initialize your account.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    setGuestStorage();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EE] via-[#ECE8E2] to-[#E6E1DA] flex items-center justify-center px-4 relative overflow-hidden font-['Poppins']">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden md:flex flex-col items-center justify-center">
          <div
          >
            {/* White Likhani Logo with Drop Shadow */}
            <svg 
              className="block" 
              width="544" 
              height="122" 
              viewBox="0 0 562 135" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="dropShadow1" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
                  <feOffset dx="2" dy="2" result="offsetblur1" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dropShadow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
                  <feOffset dx="-2" dy="3" result="offsetblur2" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.12" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="redGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(182.28 61.22) scale(43.72)">
                  <stop stopColor="#DF2129" />
                  <stop offset="1" stopColor="#660000" />
                </radialGradient>
              </defs>
              
              <g filter="url(#dropShadow1)">
                <g filter="url(#dropShadow2)">
                  {/* Red "i" with gradient */}
                  <path d={logoSvgPaths.p144be480} fill="url(#redGradient)" />
                  
                  {/* Black letters */}
                  <path d={logoSvgPaths.p18239100} fill="#1a1a1a" />
                  <path d={logoSvgPaths.p3e2b4000} fill="#DF2129" />
                  <path d={logoSvgPaths.p3671600} fill="#1a1a1a" />
                  <path d={logoSvgPaths.p897ed00} fill="#1a1a1a" />
                  <path d={logoSvgPaths.p25366580} fill="#1a1a1a" />
                  <path d={logoSvgPaths.p4f5c500} fill="#1a1a1a" />
                  <path d={logoSvgPaths.p19613980} fill="#1a1a1a" />
                </g>
              </g>
            </svg>
          </div>

          <div
            className="mt-8 h-1 bg-[#8f8a83] rounded-[30504000px] w-[80px]"
          />

          <p
            className="text-[15px] text-[#3a332d] mt-8 text-center max-w-sm leading-[24.375px] font-['Poppins']"
          >
            A Digital Archive for the Moving Images Created by Asia Pacific College - Multimedia Arts
          </p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-10 shadow-xl max-w-md w-full mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Sign In</h2>
          </div>

          <div className="bg-[#fef9f3] border border-[#f5e6d3] rounded-lg px-4 py-3 mb-8 flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[#8a181a] shrink-0" />
             <p className="text-[12px] text-gray-700 leading-relaxed font-medium">
               Access limited to APC campus network
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                name="email_nofill"
                autoComplete="nope"
                placeholder="Enter your APC email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={emailError ? "border-red-300 focus:border-red-500 focus:placeholder:text-gray-400" : "focus:placeholder:text-gray-400"}
              />
              {emailError && (
                <p className="text-[11px] text-red-600 mt-2 font-medium ml-1">{emailError}</p>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                name="password_nofill"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-gray-500 hover:text-[#8a181a] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <Button 
                onClick={handleSignIn} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGuestAccess} 
                className="w-full !bg-white !border-[#D1D5DC] border-[1.2px] border-solid !text-[#4A5565] shadow-sm hover:!bg-gray-50 hover:!text-[#8a181a] hover:!border-[#8a181a]/30 active:!bg-gray-100" 
                size="lg"
              >
                Continue as Guest
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-[#8a181a] font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
