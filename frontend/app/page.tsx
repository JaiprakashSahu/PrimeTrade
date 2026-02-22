'use client';

import Link from 'next/link';
import { CheckCircle, List, Calendar, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4D03F] rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-[#2C2C2C]">TF</span>
            </div>
            <span className="text-xl font-bold text-[#2C2C2C]">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#2C2C2C] font-medium hover:text-[#6B6B6B] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-[#F4D03F] hover:bg-[#E8C12F] text-[#2C2C2C] font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-6">
              Organize your work and life, finally.
            </h1>
            <p className="text-lg sm:text-xl text-[#6B6B6B] mb-8 max-w-2xl">
              TaskFlow helps you manage tasks, track progress, and collaborate with your team. 
              Simple, powerful, and designed to keep you in flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="bg-[#F4D03F] hover:bg-[#E8C12F] text-[#2C2C2C] font-medium px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Get started for free
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-gray-50 text-[#2C2C2C] font-medium px-8 py-3 rounded-lg border border-[#E0E0E0] transition-colors text-lg"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="space-y-4">
                {/* Sample task items */}
                <div className="flex items-center gap-3 p-4 bg-[#F5F1E8] rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 border-[#F4D03F] flex items-center justify-center">
                    <CheckCircle size={16} className="text-[#F4D03F]" />
                  </div>
                  <span className="text-[#2C2C2C] font-medium">Complete project proposal</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#F5F1E8] rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  <span className="text-[#2C2C2C] font-medium">Review team feedback</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#F5F1E8] rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                  <span className="text-[#2C2C2C] font-medium">Schedule client meeting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 sm:mt-24 lg:mt-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] text-center mb-12">
            Everything you need to stay organized
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-[#F4D03F] rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-[#2C2C2C]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Task Management</h3>
              <p className="text-[#6B6B6B] text-sm">
                Create, organize, and track tasks with ease. Set priorities and due dates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-[#F4D03F] rounded-lg flex items-center justify-center mx-auto mb-4">
                <List size={24} className="text-[#2C2C2C]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Smart Filters</h3>
              <p className="text-[#6B6B6B] text-sm">
                Search and filter tasks by status, priority, or keywords to find what you need.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-[#F4D03F] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-[#2C2C2C]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Dashboard</h3>
              <p className="text-[#6B6B6B] text-sm">
                Get a clear overview of your tasks and progress with real-time statistics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-[#F4D03F] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-[#2C2C2C]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Secure & Private</h3>
              <p className="text-[#6B6B6B] text-sm">
                Your data is protected with industry-standard security and authentication.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 sm:mt-24 lg:mt-32 text-center">
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-4">
              Ready to get organized?
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
              Join TaskFlow today and experience a better way to manage your tasks and projects.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#F4D03F] hover:bg-[#E8C12F] text-[#2C2C2C] font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Start for free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0E0E0] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F4D03F] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-[#2C2C2C]">TF</span>
              </div>
              <span className="text-[#6B6B6B]">© 2024 TaskFlow. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
