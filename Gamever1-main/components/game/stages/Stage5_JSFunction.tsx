'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface StageProps {
    onComplete: () => void;
    isActive: boolean;
}

export function Stage5_JSFunction({ onComplete, isActive }: StageProps) {
    const [code, setCode] = useState('function add(a, b) {\n  \n}');
    const [error, setError] = useState('');

    const checkOutput = () => {
        try {
            // Very simple validation - normally you'd run this safely (e.g. iframe or isolated env)
            // Here we just test string format and simple eval

            const testFunc = new Function('a', 'b', `
        ${code}
        return add(a, b);
      `);

            if (testFunc(2, 3) === 5 && testFunc(-1, 1) === 0) {
                setError('');
                onComplete();
            } else {
                setError("The function does not return the correct sum.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Syntax error in your JavaScript.';
            setError(message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-coral/10 p-5 rounded-xl border border-coral/20">
                <h3 className="font-[var(--font-display)] font-bold text-coral mb-2 flex items-center gap-2">
                    <span>⚡</span> Instructions
                </h3>
                <p className="text-white/70">
                    Complete the <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">add</code> function so that it returns the sum of <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">a</code> and <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">b</code>.
                </p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/50 font-mono flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="ml-2">script.js</span>
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!isActive}
                    className="w-full h-44 p-4 font-mono text-sm bg-[#1a1a2e] text-green-400 rounded-xl border border-white/10 shadow-inner focus:ring-2 focus:ring-coral/50 focus:border-coral/50 focus:outline-none transition-all resize-none"
                    spellCheck="false"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <Button onClick={checkOutput} disabled={!isActive}>
                ▶️ Run Code
            </Button>
        </div>
    );
}
