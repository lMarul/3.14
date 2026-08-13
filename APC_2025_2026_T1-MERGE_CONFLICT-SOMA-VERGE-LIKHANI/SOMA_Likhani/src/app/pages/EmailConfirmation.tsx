import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { PrimaryButton, TertiaryButton } from "../components/common/StandardButtons";

export default function EmailConfirmation() {
  const navigate = useNavigate();

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
        className="bg-white flex flex-col relative items-center"
        style={{
          width: "400px",
          height: "431.29px",
          boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.07), 0px 10px 30px -4px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
          padding: "40px"
        }}
      >
        {/* Icon Container */}
        <div 
          className="flex justify-center items-center"
          style={{
            width: "67.99px",
            height: "67.99px",
            background: "#FEF9F3",
            border: "1.2px solid #F5E6D3",
            borderRadius: "33.99px",
            marginBottom: "20px"
          }}
        >
          <Mail 
            style={{ width: "30px", height: "30px", color: "#8A181A" }} 
            strokeWidth={2.5} 
          />
        </div>

        {/* Heading */}
        <h1 
          className="m-0 p-0 text-center"
          style={{ 
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: "22px", 
            lineHeight: "30px",
            color: "#1A1A1A",
            width: "320px",
            marginBottom: "10px"
          }}
        >
          Check your email
        </h1>
        
        {/* Description */}
        <p 
          className="m-0 text-center"
          style={{ 
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: "14px", 
            lineHeight: "22px", 
            color: "#6A7282",
            width: "320px",
            marginBottom: "12px"
          }}
        >
          We've sent a password reset link to your email address.
        </p>

        {/* Email Address Pill */}
        <div
          className="flex items-center justify-center p-0 m-0"
          style={{
            width: "133.26px",
            height: "33.88px",
            background: "#F5F2EE",
            border: "1.2px solid #E6E1DA",
            borderRadius: "8px",
            marginBottom: "28px"
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "20px",
              textAlign: "center",
              color: "#4A4A4A"
            }}
          >
            a*@apc.edu.ph
          </span>
        </div>

        <PrimaryButton
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center h-[52px] !rounded-[14px] mb-4"
        >
          Back to Sign In
        </PrimaryButton>

        {/* Resend Footer */}
        <div 
          className="flex flex-row items-center justify-center m-0 p-0"
          style={{
            width: "320px",
            height: "20px"
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "20px",
              color: "#6A7282",
              marginRight: "4px"
            }}
          >
            Didn't receive the email?
          </span>
          <TertiaryButton
            className="hover:underline transition-all !text-[#8A181A] hover:!opacity-100 font-bold text-[13px]"
          >
            Resend email
          </TertiaryButton>
        </div>

      </motion.div>
    </div>
  );
}

