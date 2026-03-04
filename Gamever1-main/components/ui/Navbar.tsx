'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const handleSignOut = () => {
        // 1. Clear ALL cookies (not just sb-*)
        document.cookie.split(';').forEach((c) => {
            const name = c.trim().split('=')[0];
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
        // 2. Clear localStorage (Supabase stores tokens here)
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token')) {
                localStorage.removeItem(key);
            }
        });
        // 3. Clear sessionStorage too
        sessionStorage.clear();
        // 4. Reload — no more session
        window.location.href = '/';
    };

    // Compute display name
    const getDisplayName = () => {
        const badNames = ['student', 'teacher', 'player'];
        const rawName = profile?.username || '';
        const isBad = badNames.includes(rawName.toLowerCase()) || rawName.startsWith('user_') || rawName === '';
        return isBad ? (user?.email?.split('@')[0] || 'Player') : rawName;
    };

    return (
        <nav className="bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-[72px]">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="text-3xl group-hover:animate-wave">🏆</span>
                            <span className="text-xl font-[var(--font-display)] font-bold gradient-text tracking-wide">
                                Code Triathlon
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link
                            href="/leaderboard"
                            className="text-white/70 hover:text-sunny transition-colors px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 flex items-center gap-2"
                        >
                            <span>🏅</span>
                            Leaderboard
                        </Link>

                        {/* ถ้า loading อยู่ ให้แสดงปุ่ม Login/Signup ไว้ก่อน (ไม่ต้องรอ) */}
                        {user ? (
                            <>
                                <Link
                                    href={profile?.role === 'teacher' ? '/teacher' : '/dashboard'}
                                    className="text-white/70 hover:text-sky-light transition-colors px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 flex items-center gap-2"
                                >
                                    <span>{profile?.role === 'teacher' ? '👨‍🏫' : '🎮'}</span>
                                    {profile?.role === 'teacher' ? 'Teacher Panel' : 'Dashboard'}
                                </Link>
                                <div className="flex items-center space-x-3 ml-2 pl-3 border-l border-white/10">
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky to-aqua flex items-center justify-center text-white font-bold text-xs">
                                            {getDisplayName().charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-[var(--font-display)] font-bold text-white leading-tight">
                                                {getDisplayName()}
                                            </span>
                                            <span className="text-[10px] text-white/40 leading-tight">
                                                {profile?.role === 'teacher' ? '👨‍🏫 Teacher' : '🎮 Student'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* ไม่ได้ login หรือกำลัง loading — แสดงปุ่ม Login/Signup เสมอ */
                            !loading || !user ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                        Log in
                                    </Link>
                                    <Link href="/register" className="inline-flex items-center justify-center rounded-xl font-[var(--font-display)] font-bold px-4 py-2 text-sm bg-gradient-to-r from-sky to-aqua text-white shadow-lg shadow-sky/30 hover:shadow-sky/50 hover:scale-105 transition-all cursor-pointer">
                                        Sign up
                                    </Link>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
