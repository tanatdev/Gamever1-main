'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface StageProps {
    onComplete: () => void;
    isActive: boolean;
}

export function Stage2_HTMLInput({ onComplete, isActive }: StageProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const checkOutput = useCallback(() => {
        // Basic checking for an input element with type email
        const hasInput = /<input\s+[^>]*>/.test(code);
        const hasTypeEmail = /type=["']email["']/.test(code);
        const hasPlaceholder = /placeholder=["'][^"']*["']/.test(code);
        const isClosed = code.includes('/>') || code.includes('>');

        if (hasInput && hasTypeEmail && hasPlaceholder && isClosed) {
            setError('');
            onComplete();
        } else {
            setError("Please ensure you have an <input> tag with type='email' and a placeholder attribute.");
        }
    }, [code, onComplete]);

    useEffect(() => {
        if (isActive && code.length > 5) {
            const timeoutId = setTimeout(checkOutput, 800);
            return () => clearTimeout(timeoutId);
        }
    }, [code, isActive, checkOutput]);

    return (
        <div className="space-y-6">
            <div className="bg-sky/10 p-5 rounded-xl border border-sky/20">
                <h3 className="font-[var(--font-display)] font-bold text-sky-light mb-2 flex items-center gap-2">
                    <span>📋</span> Instructions
                </h3>
                <p className="text-white/70">
                    Create an email input field. It must have <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">type=&quot;email&quot;</code> and a <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">placeholder</code> attribute.
                </p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/50 font-mono flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="ml-2">index.html</span>
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!isActive}
                    className="w-full h-36 p-4 font-mono text-sm bg-[#1a1a2e] text-green-400 rounded-xl border border-white/10 shadow-inner focus:ring-2 focus:ring-sky/50 focus:border-sky/50 focus:outline-none transition-all resize-none"
                    placeholder='<input ... />'
                    spellCheck="false"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <Button onClick={checkOutput} disabled={!isActive || code.length === 0}>
                ✅ Check Code
            </Button>
        </div>
    );
}
