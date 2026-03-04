'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScoreWithProfile } from '@/lib/types';

interface RoomLeaderboardProps {
    scores: ScoreWithProfile[];
}

export function RoomLeaderboard({ scores }: RoomLeaderboardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>🏆 Live Leaderboard</CardTitle>
                <span className="text-xs bg-green-500/20 text-green-300 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    REALTIME
                </span>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {scores.map((score, index) => (
                                <tr key={score.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-[var(--font-display)] font-bold text-white/30">
                                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">{score.profiles?.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-sky-light">{score.time}s</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-sunny">{score.score} pts</td>
                                </tr>
                            ))}
                            {scores.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="text-4xl mb-3 opacity-50 animate-float-slow">🏊</div>
                                        <p className="text-white/40 italic font-[var(--font-display)]">No one has finished yet. Waiting for players...</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
