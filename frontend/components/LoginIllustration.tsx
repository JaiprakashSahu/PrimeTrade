import React from 'react';
import { FileText, CheckCircle, List } from 'lucide-react';

/**
 * LoginIllustration Component
 * 
 * A playful abstract illustration for the login/register pages featuring:
 * - Yellow circular head
 * - Wavy connecting lines
 * - Floating icons (document, checkmark, list)
 * - Brown/tan colors for hands and icons
 * - Responsive scaling for smaller screens
 * 
 * Requirements: 15.1, 15.2, 15.3
 */
const LoginIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main illustration container - scales down on smaller screens */}
      <div className="relative w-full max-w-md scale-75 sm:scale-90 lg:scale-100 transition-transform">
        
        {/* Yellow circular head */}
        <div className="relative mx-auto w-48 h-48 bg-[#F4D03F] rounded-full flex items-center justify-center">
          {/* Simple face features */}
          <div className="flex gap-8">
            <div className="w-3 h-3 bg-[#2C2C2C] rounded-full"></div>
            <div className="w-3 h-3 bg-[#2C2C2C] rounded-full"></div>
          </div>
          <div className="absolute bottom-12 w-12 h-6 border-b-2 border-[#2C2C2C] rounded-b-full"></div>
        </div>

        {/* Left hand/arm - brown/tan color */}
        <div className="absolute left-8 top-32">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
            {/* Wavy connecting line */}
            <path
              d="M 40 0 Q 20 30, 30 60 T 40 120"
              stroke="#D4A574"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx="40" cy="110" r="18" fill="#D4A574" />
          </svg>
        </div>

        {/* Right hand/arm - brown/tan color */}
        <div className="absolute right-8 top-32">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
            {/* Wavy connecting line */}
            <path
              d="M 40 0 Q 60 30, 50 60 T 40 120"
              stroke="#D4A574"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx="40" cy="110" r="18" fill="#D4A574" />
          </svg>
        </div>

        {/* Floating icon: Document (FileText) - top left */}
        <div className="absolute -left-4 top-8 animate-float">
          <div className="w-16 h-16 bg-[#E8C68A] rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
            <FileText size={32} className="text-[#2C2C2C]" />
          </div>
        </div>

        {/* Floating icon: Checkmark (CheckCircle) - top right */}
        <div className="absolute -right-4 top-16 animate-float-delayed">
          <div className="w-16 h-16 bg-[#D4A574] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
            <CheckCircle size={32} className="text-white" />
          </div>
        </div>

        {/* Floating icon: List - bottom center */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 animate-float-slow">
          <div className="w-16 h-16 bg-[#F0E5D8] rounded-2xl flex items-center justify-center shadow-lg transform rotate-6">
            <List size={32} className="text-[#6B6B6B]" />
          </div>
        </div>

        {/* Additional decorative wavy lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <path
            d="M 50 200 Q 100 180, 150 200"
            stroke="#F4D03F"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="M 250 200 Q 300 220, 350 200"
            stroke="#F4D03F"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* CSS animations for floating effect */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-20px) rotate(12deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-15px) rotate(-12deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) rotate(6deg);
          }
          50% {
            transform: translateX(-50%) translateY(-25px) rotate(6deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginIllustration;
