'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#F4D03F] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl font-bold">TF</span>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
