'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/AuthProvider';
import Link from 'next/link';

export default function Home() {
  const { user, profile, loading } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="hero-gradient relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Floating Sport Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-[10%] left-[5%] text-6xl animate-float opacity-60">🏊</span>
          <span className="absolute top-[20%] right-[8%] text-5xl animate-float-delay-1 opacity-50">🚴</span>
          <span className="absolute bottom-[25%] left-[12%] text-5xl animate-float-delay-2 opacity-50">🏃</span>
          <span className="absolute top-[60%] right-[15%] text-4xl animate-float-slow opacity-40">🎯</span>
          <span className="absolute top-[15%] left-[40%] text-4xl animate-float-delay-3 opacity-40">🏅</span>
          <span className="absolute bottom-[10%] right-[30%] text-5xl animate-float opacity-50">🏆</span>
          <span className="absolute bottom-[40%] left-[30%] text-3xl animate-float-delay-1 opacity-30">⭐</span>
          <span className="absolute top-[45%] right-[40%] text-3xl animate-float-delay-2 opacity-30">🌊</span>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-aqua/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 text-center max-w-4xl animate-slide-up">
          {/* Trophy icon */}
          <div className="text-8xl mb-6 animate-float-slow">🏆</div>

          <h1 className="text-6xl sm:text-7xl font-[var(--font-display)] font-bold mb-6 leading-tight">
            <span className="gradient-text">Code Triathlon</span>
            <br />
            <span className="text-white text-4xl sm:text-5xl">Game</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Swim through HTML, Cycle up CSS mountains, and Sprint with JavaScript!
            <br />
            <span className="text-sunny/80">Compete. Learn. Win medals! 🏅</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {/* Public Competition — always visible */}
            <Link
              href={user ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-gradient-to-r from-sky to-aqua text-white shadow-lg shadow-sky/30 hover:shadow-sky/50 hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-xl px-10 py-5 cursor-pointer"
            >
              🏊 Public Competition
            </Link>

            {/* Join Room — always visible */}
            <Link
              href={user ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-lg shadow-black/10 hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-xl px-10 py-5 cursor-pointer"
            >
              🎮 Join Room
            </Link>

            {/* Create Room — only for teachers */}
            {(profile?.role === 'teacher') && (
              <Link
                href="/teacher"
                className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-lg shadow-black/10 hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-xl px-10 py-5 cursor-pointer"
              >
                👨‍🏫 Create Room
              </Link>
            )}

            {/* Create Room — not logged in */}
            {!user && !loading && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-lg shadow-black/10 hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-xl px-10 py-5 cursor-pointer"
              >
                👨‍🏫 Create Room
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stage Preview Section */}
      <div className="relative bg-[#0a1628] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-[var(--font-display)] font-bold text-center mb-4 text-white">
            6 Epic Stages
          </h2>
          <p className="text-center text-white/50 mb-14 text-lg">Master web development through sports challenges</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Swimming - HTML */}
            <div className="game-card glass-card rounded-2xl p-8 text-center group cursor-pointer">
              <div className="text-6xl mb-4 group-hover:animate-wave transition-transform">🏊</div>
              <h3 className="text-2xl font-[var(--font-display)] font-bold text-sky-light mb-2">Swimming</h3>
              <p className="text-white/60 mb-4">HTML Structure & Elements</p>
              <div className="flex justify-center gap-2">
                <span className="bg-sky/20 text-sky-light text-xs font-bold px-3 py-1 rounded-full">Stage 1</span>
                <span className="bg-sky/20 text-sky-light text-xs font-bold px-3 py-1 rounded-full">Stage 2</span>
              </div>
            </div>

            {/* Cycling - CSS */}
            <div className="game-card glass-card rounded-2xl p-8 text-center group cursor-pointer">
              <div className="text-6xl mb-4 group-hover:animate-wave transition-transform">🚴</div>
              <h3 className="text-2xl font-[var(--font-display)] font-bold text-sunny mb-2">Cycling</h3>
              <p className="text-white/60 mb-4">CSS Styling & Flexbox</p>
              <div className="flex justify-center gap-2">
                <span className="bg-sunny/20 text-sunny text-xs font-bold px-3 py-1 rounded-full">Stage 3</span>
                <span className="bg-sunny/20 text-sunny text-xs font-bold px-3 py-1 rounded-full">Stage 4</span>
              </div>
            </div>

            {/* Running - JS */}
            <div className="game-card glass-card rounded-2xl p-8 text-center group cursor-pointer">
              <div className="text-6xl mb-4 group-hover:animate-wave transition-transform">🏃</div>
              <h3 className="text-2xl font-[var(--font-display)] font-bold text-coral mb-2">Running</h3>
              <p className="text-white/60 mb-4">JavaScript Logic & Functions</p>
              <div className="flex justify-center gap-2">
                <span className="bg-coral/20 text-coral text-xs font-bold px-3 py-1 rounded-full">Stage 5</span>
                <span className="bg-coral/20 text-coral text-xs font-bold px-3 py-1 rounded-full">Stage 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-gradient-to-b from-[#0a1628] to-ocean py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-[var(--font-display)] font-bold text-white mb-4">
            🏅 Compete for Gold!
          </h2>
          <p className="text-white/50 mb-8 text-lg">Earn medals based on your speed. Can you beat them all?</p>
          <div className="flex justify-center gap-8">
            <div className="text-center animate-float-slow">
              <div className="text-5xl mb-2">🥇</div>
              <p className="text-sunny font-bold text-sm">Gold</p>
            </div>
            <div className="text-center animate-float-delay-1">
              <div className="text-5xl mb-2">🥈</div>
              <p className="text-gray-300 font-bold text-sm">Silver</p>
            </div>
            <div className="text-center animate-float-delay-2">
              <div className="text-5xl mb-2">🥉</div>
              <p className="text-orange-400 font-bold text-sm">Bronze</p>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/leaderboard" className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-lg shadow-black/10 hover:scale-105 hover:-translate-y-0.5 active:scale-95 px-8 py-4 text-lg tracking-wide cursor-pointer">
              🏆 View Global Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
