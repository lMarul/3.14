import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Group from "../../generated/Group";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { supabase } from "../lib/supabase";
import { setAuthedStorage } from "../lib/authStorage";
import { ensureAppUser } from "../lib/appUser";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

  const handleSignUp = async () => {
    if (!agreeToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    if (!isValidAPCEmail(email)) {
      setEmailError("Please use your APC email address");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (fullName.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    const client = supabase;
    if (!client) {
      setIsLoading(false);
      toast.error("Supabase is not configured.");
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      try {
        await ensureAppUser(data.user);
      } catch {
        // Ignore app_users initialization failure here and let next sign-in retry.
      }
    }

    if (data.session && data.user) {
      setAuthedStorage(data.user);
      toast.success("Account created successfully.");
      navigate("/home");
    } else {
      toast.success("Account created. Please confirm your email before signing in.");
      navigate("/email-confirmation");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EE] via-[#ECE8E2] to-[#E6E1DA] flex items-center justify-center px-4 relative overflow-hidden font-['Poppins']">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden md:flex flex-col items-center justify-center order-2">
          <div
            className="w-[400px] h-[100px]"
          >
            <Group />
          </div>

          <div
            className="mt-8 h-[2px] w-[88px] rounded-full bg-[#7a736b] mx-auto"
          />

          <p
            className="text-[15px] text-[#3a332d] mt-8 text-center max-w-sm leading-relaxed"
          >
            Join the LIKHANI archive community. Submit your work, endorse projects, and explore the collection.
          </p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-10 shadow-xl max-w-md w-full mx-auto order-1"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Create Account</h2>
            <p className="text-sm text-gray-500">Join the Likhani Digital Archive</p>
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
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Email Address"
                type="email"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="rounded border-gray-300 text-[#8a181a] focus:ring-[#8a181a] cursor-pointer w-4 h-4 accent-[#8a181a]"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
                I agree to the <button onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="text-[#8a181a] font-bold hover:underline">Terms and Conditions</button>
              </label>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleSignUp} 
                className="w-full" 
                size="lg"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="text-[#8a181a] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

