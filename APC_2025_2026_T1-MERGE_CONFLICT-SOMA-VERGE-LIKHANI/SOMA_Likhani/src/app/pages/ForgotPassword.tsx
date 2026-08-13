import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { PrimaryButton, TertiaryButton } from "../components/common/StandardButtons";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const isValidAPCEmail = (email: string) => {
    const emailLower = email.toLowerCase();
    return emailLower.endsWith("@apc.edu.ph") || emailLower.endsWith("@student.apc.edu.ph");
  };

  const handleSubmit = () => {
    if (!isValidAPCEmail(email)) {
      toast.error("Please use your APC email address");
      return;
    }
    toast.success("Reset link sent to your email!");
    navigate("/email-confirmation");
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center font-['Poppins']"
      style={{
        background: "linear-gradient(135deg, #F5F2EE 0%, #ECE8E2 60%, #E6E1DA 100%), #FFFFFF"
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white flex flex-col relative"
        style={{
          width: "400px",
          height: "350px",
          boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.07), 0px 10px 30px -4px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
          padding: "40px"
        }}
      >
        <h1 
          className="m-0 p-0 text-[#1A1A1A] font-bold"
          style={{ fontSize: "22px", lineHeight: "30px" }}
        >
          Forgot password?
        </h1>
        
        <p 
          className="mt-2 mb-0 text-[#6A7282]"
          style={{ fontSize: "14px", lineHeight: "22px", fontWeight: 400 }}
        >
          Enter your APC email address and we'll send you a link to reset your password.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-7 outline-none transition-all focus:border-[#8A181A]"
          style={{
            height: "52px",
            padding: "0 14px",
            background: "#FFFFFF",
            border: "1.2px solid #E5E7EB",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
            borderRadius: "12px",
            fontSize: "14px",
            color: "#1A1A1A"
          }}
        />

        <PrimaryButton
          onClick={handleSubmit}
          disabled={!email}
          className="w-full mt-4 h-[52px] !rounded-[14px]"
        >
          Send Reset Link
        </PrimaryButton>

        <TertiaryButton
          onClick={() => navigate("/sign-in")}
          className="flex items-center justify-center gap-2 mt-auto mx-auto !text-[#6A7282] hover:!text-[#1A1A1A] font-medium text-[13px]"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to Sign In
        </TertiaryButton>
      </motion.div>
    </div>
  );
}

