'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { Room } from '@/lib/types';
import { useRoomPlayers, useRoomScores } from '@/lib/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoomLeaderboard } from '@/components/leaderboard/RoomLeaderboard';
import { Stage1_HTMLStructure } from '@/components/game/stages/Stage1_HTMLStructure';
import { useTimer } from '@/lib/hooks/useTimer';
import { GameTimer } from '@/components/game/GameTimer';

export default function GameRoomPage() {
    const params = useParams();
    const roomCode = params.roomCode as string;
    const { user, profile } = useAuth();
    const supabase = createClient();

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [roomError, setRoomError] = useState('');
    const { players } = useRoomPlayers(room?.id || null);
    const { scores } = useRoomScores(room?.id || null);
    const timer = useTimer();

    useEffect(() => {
        async function loadRoom() {
            if (!roomCode || !user || !profile) return;

            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('room_code', roomCode)
                .single();

            if (error || !data) {
                setRoomError('Room not found. Please check the room code.');
                setLoading(false);
                return;
            }

            setRoom(data);

            // If student, join the room (upsert prevents duplicates)
            if (profile?.role === 'student') {
                const { error: joinError } = await supabase.from('room_players').upsert({
                    room_id: data.id,
                    student_id: user.id
                }, { onConflict: 'room_id,student_id' });

                if (joinError) {
                    console.error('Join error:', joinError);
                }
            }

            setLoading(false);
        }

        if (user && profile && roomCode) {
            loadRoom();
        }
    }, [roomCode, user, profile, supabase]);

    // Real-time room status subscription (so students see when teacher starts the game)
    useEffect(() => {
        if (!room) return;

        const channel = supabase
            .channel(`room_status_${room.id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
                (payload: { new: Record<string, unknown> }) => {
                    setRoom((prev) => prev ? { ...prev, ...(payload.new as unknown as Room) } : null);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [room?.id, supabase]);

    const handleStartGame = async () => {
        if (!room) return;
        await supabase
            .from('rooms')
            .update({ status: 'playing' })
            .eq('id', room.id);
    };

    const handleComplete = async () => {
        if (!room || !user) return;
        timer.stop();
        await supabase.from('room_scores').insert({
            room_id: room.id,
            student_id: user.id,
            stage_id: 1,
            score: 100,
            time: timer.seconds
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl animate-float-slow mb-4">🏟️</div>
                    <p className="text-white/50 font-[var(--font-display)] text-xl">Loading Room...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 font-[var(--font-display)] text-xl mb-2">
                        {roomError || 'Room not found.'}
                    </p>
                    <p className="text-white/40 text-sm mb-6">
                        Make sure you entered the correct 6-character room code.
                    </p>
                    <Button variant="secondary" onClick={() => window.location.href = '/dashboard'}>
                        🏠 Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const isTeacher = profile?.role === 'teacher' && room.teacher_id === user?.id;

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Header */}
            <div className="hero-gradient py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-[20%] right-[5%] text-4xl animate-float opacity-30">🏟️</span>
                </div>
                <div className="max-w-6xl mx-auto relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-[var(--font-display)] font-bold text-white mb-1">
                            Room:{' '}
                            <span className="font-mono bg-white/10 px-4 py-1.5 rounded-xl text-sunny tracking-[0.3em] text-4xl border border-white/20">
                                {roomCode}
                            </span>
                        </h1>
                        <p className="text-white/50 mt-2 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${room.status === 'waiting' ? 'bg-yellow-400 animate-pulse' :
                                room.status === 'playing' ? 'bg-green-400 animate-pulse' :
                                    'bg-gray-400'
                                }`}></span>
                            Status: <span className="text-white font-semibold capitalize">{room.status}</span>
                        </p>
                    </div>
                    {room.status === 'playing' && profile?.role === 'student' && <GameTimer timer={timer} />}
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Players List */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>👥 Players ({players.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {players.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="text-3xl mb-2 opacity-50">👤</div>
                                        <p className="text-white/30 text-sm italic">Waiting for players to join...</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {players.map((p) => (
                                            <li key={p.id} className="py-2.5 px-3 flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                                                <span className="text-white font-medium">{p.profiles?.username}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>

                        {isTeacher && room.status === 'waiting' && (
                            <Button onClick={handleStartGame} fullWidth size="lg" className="text-xl py-5">
                                🚀 Start Game!
                            </Button>
                        )}
                    </div>

                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {room.status === 'waiting' ? (
                            <Card>
                                <CardContent className="py-20 text-center">
                                    <div className="text-6xl mb-6 animate-float-slow">⏳</div>
                                    <h2 className="text-3xl font-[var(--font-display)] font-bold text-white/50">
                                        Waiting for teacher to start...
                                    </h2>
                                    <p className="text-white/30 mt-3">Get ready! The game will begin shortly.</p>
                                </CardContent>
                            </Card>
                        ) : room.status === 'playing' ? (
                            profile?.role === 'student' ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>🏊 Stage 1: HTML Structure</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Stage1_HTMLStructure onComplete={handleComplete} isActive={true} />
                                    </CardContent>
                                </Card>
                            ) : (
                                <RoomLeaderboard scores={scores} />
                            )
                        ) : (
                            <RoomLeaderboard scores={scores} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
