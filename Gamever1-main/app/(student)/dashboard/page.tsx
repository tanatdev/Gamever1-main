'use client';

import { useAuth } from '@/lib/hooks/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const STAGES = [
    { id: 1, title: 'HTML Structure', sport: '🏊', sportName: 'Swimming', color: 'sky', difficulty: 'Easy' },
    { id: 2, title: 'HTML Input', sport: '🏊', sportName: 'Swimming', color: 'sky', difficulty: 'Easy' },
    { id: 3, title: 'CSS Styling', sport: '🚴', sportName: 'Cycling', color: 'sunny', difficulty: 'Medium' },
    { id: 4, title: 'CSS Flexbox', sport: '🚴', sportName: 'Cycling', color: 'sunny', difficulty: 'Medium' },
    { id: 5, title: 'JS Function', sport: '🏃', sportName: 'Running', color: 'coral', difficulty: 'Hard' },
    { id: 6, title: 'JS Logic', sport: '🏃', sportName: 'Running', color: 'coral', difficulty: 'Hard' },
];

export default function DashboardPage() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl animate-float-slow mb-4">🏊</div>
                    <p className="text-white/50 font-[var(--font-display)] text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Header */}
            <div className="hero-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-[20%] right-[5%] text-4xl animate-float opacity-30">🏅</span>
                    <span className="absolute bottom-[10%] left-[8%] text-3xl animate-float-delay-1 opacity-20">⭐</span>
                </div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <h1 className="text-4xl font-[var(--font-display)] font-bold text-white mb-2">
                        Welcome back, <span className="gradient-text">{profile?.username}</span>! 👋
                    </h1>
                    <p className="text-white/60 text-lg">Choose your challenge and start racing!</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white/60 font-semibold text-sm">Stage Progress</span>
                        <span className="text-sunny font-bold text-sm">0 / 6 completed</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-sky via-sunny to-coral rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                        {STAGES.map(s => (
                            <div key={s.id} className="text-center">
                                <span className="text-lg">{s.sport}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stage Cards Grid */}
                <h2 className="text-2xl font-[var(--font-display)] font-bold text-white mb-6">🎯 Select a Stage</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {STAGES.map((stage, index) => (
                        <Link key={stage.id} href={`/game/${stage.id}`}>
                            <div
                                className="game-card glass-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Sport icon */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-5xl group-hover:animate-wave">{stage.sport}</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${stage.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                        stage.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-red-500/20 text-red-300'
                                        }`}>
                                        {stage.difficulty}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${stage.color === 'sky' ? 'bg-sky/30 text-sky-light' :
                                        stage.color === 'sunny' ? 'bg-sunny/30 text-sunny' :
                                            'bg-coral/30 text-coral'
                                        }`}>
                                        {stage.id}
                                    </div>
                                    <h3 className="text-lg font-[var(--font-display)] font-bold text-white">{stage.title}</h3>
                                </div>

                                <p className="text-white/40 text-sm mb-3">{stage.sportName} challenge</p>

                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer rounded-2xl pointer-events-none"></div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Room Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🎮 Join a Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/50 mb-6">
                                Got a room code from your teacher? Enter it below to join their live session!
                            </p>
                            <form
                                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const code = formData.get('roomCode') as string;
                                    if (code) {
                                        window.location.href = `/game/room/${code.toUpperCase()}`;
                                    }
                                }}
                                className="flex gap-3"
                            >
                                <input
                                    name="roomCode"
                                    placeholder="Enter 6-digit code"
                                    className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky focus:ring-2 focus:ring-sky/30 focus:outline-none px-4 py-3 uppercase font-mono tracking-widest text-center text-lg"
                                    required
                                    maxLength={6}
                                />
                                <Button type="submit">🚀 Join</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>🏆 Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/game/1" className="block w-full text-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-gradient-to-r from-sky to-aqua text-white shadow-lg shadow-sky/30 hover:shadow-sky/50 hover:scale-105 active:scale-95 px-6 py-3 cursor-pointer">
                                    🏊 Start Stage 1
                                </Link>
                                <Link href="/leaderboard" className="block w-full text-center rounded-xl font-[var(--font-display)] font-bold transition-all duration-300 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-lg hover:scale-105 active:scale-95 px-6 py-3 cursor-pointer">
                                    🏅 Global Leaderboard
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
