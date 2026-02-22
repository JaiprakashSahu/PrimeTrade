'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 lg:p-12">
        <div className="relative w-full max-w-md">
          {/* Playful illustration */}
          <div className="relative">
            {/* Main character */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-[#F4D03F] rounded-full flex items-center justify-center">
                <div className="text-6xl">😊</div>
              </div>
            </div>
            
            {/* Wavy lines */}
            <svg className="w-full h-96" viewBox="0 0 400 400">
              <path
                d="M 50 200 Q 100 150, 150 200 T 250 200"
                stroke="#2C2C2C"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 100 250 Q 150 220, 200 250 T 300 250"
                stroke="#2C2C2C"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            
            {/* Floating icons */}
            <div className="absolute top-20 right-20 w-12 h-12 bg-[#D4A574] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#E8C68A] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
            <div className="absolute bottom-32 right-32 w-12 h-12 bg-[#D4A574] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">☰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center lg:justify-end mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F4D03F] rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold">TF</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">TaskFlow</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1E8] rounded-lg outline-none focus:ring-2 focus:ring-[#F4D03F] transition-all"
                />
                {errors.name && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="Your email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1E8] rounded-lg outline-none focus:ring-2 focus:ring-[#F4D03F] transition-all"
                />
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  placeholder="Your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1E8] rounded-lg outline-none focus:ring-2 focus:ring-[#F4D03F] transition-all"
                />
                {errors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F4D03F] hover:bg-[#E8C12F] text-black font-medium px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#F4D03F] hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
