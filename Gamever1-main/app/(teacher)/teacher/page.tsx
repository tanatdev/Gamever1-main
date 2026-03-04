'use client';

import { useAuth } from '@/lib/hooks/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateRoomForm } from '@/components/room/CreateRoomForm';
import { useEffect, useState } from 'react';
import { Room } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherPage() {
    const { profile, loading } = useAuth();
    const [recentRooms, setRecentRooms] = useState<Room[]>([]);
    const supabase = createClient();
    const router = useRouter();

    // Frontend role guard — redirect non-teachers
    useEffect(() => {
        if (!loading && profile && profile.role !== 'teacher') {
            router.replace('/dashboard');
        }
    }, [loading, profile, router]);

    useEffect(() => {
        async function loadRecentRooms() {
            if (!profile) return;
            const { data } = await supabase
                .from('rooms')
                .select('*')
                .eq('teacher_id', profile.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) setRecentRooms(data);
        }
        if (!loading && profile) {
            loadRecentRooms();
        }
    }, [profile, loading, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl animate-float-slow mb-4">👨‍🏫</div>
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
                    <span className="absolute top-[20%] right-[8%] text-4xl animate-float opacity-30">📋</span>
                    <span className="absolute bottom-[15%] left-[5%] text-3xl animate-float-delay-1 opacity-20">🏆</span>
                </div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <h1 className="text-4xl font-[var(--font-display)] font-bold text-white mb-2">
                        👨‍🏫 Teacher Dashboard
                    </h1>
                    <p className="text-white/60 text-lg">Create rooms and manage your class competitions!</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Room */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🏟️ Create a New Class Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/50 mb-6">
                                Launch a live session for your students. We&apos;ll generate a unique code for them to join your leaderboard.
                            </p>
                            <CreateRoomForm />
                        </CardContent>
                    </Card>

                    {/* Recent Rooms */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📋 Your Recent Rooms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentRooms.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3 opacity-50">🏟️</div>
                                    <p className="text-white/40 italic">No rooms created yet. Start your first session!</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-white/5">
                                    {recentRooms.map((room) => (
                                        <li key={room.id} className="py-4 flex justify-between items-center group">
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Room:{' '}
                                                    <span className="font-mono bg-white/10 px-2 py-1 rounded-lg text-sky-light tracking-widest">
                                                        {room.room_code}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-white/40 mt-1 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${room.status === 'waiting' ? 'bg-yellow-400' :
                                                        room.status === 'playing' ? 'bg-green-400 animate-pulse' :
                                                            'bg-gray-400'
                                                        }`}></span>
                                                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/game/room/${room.room_code}`}
                                                className="text-sky hover:text-sky-light text-sm font-bold transition-colors flex items-center gap-1 group-hover:gap-2"
                                            >
                                                Manage
                                                <span className="transition-all">→</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
