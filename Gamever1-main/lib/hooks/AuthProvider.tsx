'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const supabase = createClient();

        async function fetchProfile(userId: string): Promise<Profile | null> {
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();
                return data as Profile | null;
            } catch {
                return null;
            }
        }

        async function init() {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error || !data.user) {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return;
                }
                setUser(data.user);
                const p = await fetchProfile(data.user.id);
                setProfile(p);
            } catch {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        }

        // Timeout safety — if init takes more than 5 seconds, force loading=false
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        init().then(() => clearTimeout(timeout));

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string, session: { user: User } | null) => {
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    const p = await fetchProfile(currentUser.id);
                    setProfile(p);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
