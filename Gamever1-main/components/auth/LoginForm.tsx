'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // If user provided a display name, update their profile
        if (data.user && displayName.trim()) {
            await supabase
                .from('profiles')
                .update({ username: displayName.trim() })
                .eq('id', data.user.id);
        }

        // Force full page reload to trigger middleware redirect based on role
        window.location.href = '/';
        return;  // Don't set loading false since we're navigating away
    };

    return (
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky focus:ring-2 focus:ring-sky/30 focus:outline-none px-4 py-3 transition-all"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky focus:ring-2 focus:ring-sky/30 focus:outline-none px-4 py-3 transition-all"
                    placeholder="Enter your password"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">
                    ชื่อที่แสดง (Display Name)
                    <span className="text-white/30 font-normal ml-1">— ไม่จำเป็น, ใส่เพื่อเปลี่ยนชื่อ</span>
                </label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky focus:ring-2 focus:ring-sky/30 focus:outline-none px-4 py-3 transition-all"
                    placeholder="เช่น BillyG, สมชาย"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <Button type="submit" fullWidth disabled={loading} className="mt-2">
                {loading ? '⏳ Logging in...' : '🚀 Log in'}
            </Button>
        </form>
    );
}
