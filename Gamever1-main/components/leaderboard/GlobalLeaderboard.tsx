'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MedalBadge } from '@/components/game/MedalBadge';
import { ScoreWithProfile } from '@/lib/types';

export function GlobalLeaderboard() {
    const [scores, setScores] = useState<ScoreWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchScores() {
            const { data } = await supabase
                .from('global_scores')
                .select(`
          id,
          time,
          medal,
          stage_id,
          profiles(username)
        `)
                .order('time', { ascending: true })
                .limit(20);

            if (data) setScores(data as unknown as ScoreWithProfile[]);
            setLoading(false);
        }
        fetchScores();
    }, [supabase]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl animate-float-slow mb-4">🏅</div>
                <p className="text-white/50 font-[var(--font-display)]">Loading rankings...</p>
            </div>
        );
    }

    // Get top 3 for podium
    const top3 = scores.slice(0, 3);
    const rest = scores.slice(3);

    return (
        <div className="space-y-8">
            {/* Podium */}
            {top3.length > 0 && (
                <div className="flex justify-center items-end gap-4 mb-8 pt-4">
                    {/* 2nd Place */}
                    {top3[1] && (
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl mb-2">🥈</div>
                            <div className="glass-card rounded-2xl px-6 py-4 min-w-[140px]">
                                <p className="font-[var(--font-display)] font-bold text-white text-sm">{top3[1].profiles?.username}</p>
                                <p className="text-white/40 text-xs font-mono mt-1">{top3[1].time}s</p>
                            </div>
                            <div className="podium-2 h-20 rounded-t-xl mt-2 flex items-center justify-center">
                                <span className="font-[var(--font-display)] font-bold text-white/80 text-2xl">2</span>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {top3[0] && (
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl mb-2 animate-float-slow">🥇</div>
                            <div className="glass-card rounded-2xl px-8 py-5 min-w-[160px] border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                                <p className="font-[var(--font-display)] font-bold text-sunny text-base">{top3[0].profiles?.username}</p>
                                <p className="text-white/50 text-sm font-mono mt-1">{top3[0].time}s</p>
                            </div>
                            <div className="podium-1 h-28 rounded-t-xl mt-2 flex items-center justify-center">
                                <span className="font-[var(--font-display)] font-bold text-white text-3xl">1</span>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="text-4xl mb-2">🥉</div>
                            <div className="glass-card rounded-2xl px-6 py-4 min-w-[140px]">
                                <p className="font-[var(--font-display)] font-bold text-white text-sm">{top3[2].profiles?.username}</p>
                                <p className="text-white/40 text-xs font-mono mt-1">{top3[2].time}s</p>
                            </div>
                            <div className="podium-3 h-14 rounded-t-xl mt-2 flex items-center justify-center">
                                <span className="font-[var(--font-display)] font-bold text-white/80 text-2xl">3</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Rankings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>🏅 All Rankings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Player</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Stage</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Badge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {scores.map((score, index) => (
                                    <tr
                                        key={score.id}
                                        className={`transition-colors hover:bg-white/5 ${index < 3 ? 'bg-white/[0.02]' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap font-[var(--font-display)] font-bold text-white/30">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">
                                            {index < 3 && <span className="mr-2">{['🥇', '🥈', '🥉'][index]}</span>}
                                            {score.profiles?.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">Stage {score.stage_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-sky-light">{score.time}s</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {score.medal && <MedalBadge medal={score.medal} size="sm" />}
                                        </td>
                                    </tr>
                                ))}
                                {scores.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="text-4xl mb-3 opacity-50">🏅</div>
                                            <p className="text-white/40 italic font-[var(--font-display)]">No scores yet. Be the first champion!</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
