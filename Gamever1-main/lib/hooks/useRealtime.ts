import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ScoreWithProfile, PlayerWithProfile } from '@/lib/types';

export function useRoomPlayers(roomId: string | null) {
    const [players, setPlayers] = useState<PlayerWithProfile[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!roomId) return;

        // Load initial players
        async function fetchPlayers() {
            const { data } = await supabase
                .from('room_players')
                .select(`
          id,
          room_id,
          student_id,
          profiles(username)
        `)
                .eq('room_id', roomId);

            if (data) setPlayers(data as unknown as PlayerWithProfile[]);
        }

        fetchPlayers();

        const channel = supabase
            .channel(`room_players_${roomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
                async (payload: { new: Record<string, string> }) => {
                    const { data } = await supabase.from('profiles').select('username').eq('id', payload.new.student_id).single();
                    setPlayers((prev) => [...prev, { ...payload.new, profiles: data } as unknown as PlayerWithProfile]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, supabase]);

    return { players };
}

export function useRoomScores(roomId: string | null) {
    const [scores, setScores] = useState<ScoreWithProfile[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!roomId) return;

        async function fetchScores() {
            const { data } = await supabase
                .from('room_scores')
                .select(`
          id,
          score,
          time,
          stage_id,
          student_id,
          profiles(username)
        `)
                .eq('room_id', roomId)
                .order('score', { ascending: false })
                .order('time', { ascending: true });

            if (data) setScores(data as unknown as ScoreWithProfile[]);
        }

        fetchScores();

        const channel = supabase
            .channel(`room_scores_${roomId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'room_scores', filter: `room_id=eq.${roomId}` },
                () => {
                    fetchScores();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, supabase]);

    return { scores };
}
