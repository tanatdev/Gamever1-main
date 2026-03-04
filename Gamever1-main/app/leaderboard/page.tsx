import { GlobalLeaderboard } from '@/components/leaderboard/GlobalLeaderboard';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Header */}
            <div className="hero-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-[15%] left-[5%] text-5xl animate-float opacity-30">🥇</span>
                    <span className="absolute top-[30%] right-[8%] text-4xl animate-float-delay-1 opacity-30">🥈</span>
                    <span className="absolute bottom-[20%] left-[15%] text-4xl animate-float-delay-2 opacity-20">🥉</span>
                </div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="text-6xl mb-4 animate-float-slow">🏆</div>
                    <h1 className="text-5xl font-[var(--font-display)] font-bold text-white mb-3">
                        Global Leaderboard
                    </h1>
                    <p className="text-lg text-white/60">The fastest web developers from around the world 🌍</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 -mt-4">
                <GlobalLeaderboard />
            </div>
        </div>
    );
}
