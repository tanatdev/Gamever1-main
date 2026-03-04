'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface StageProps {
    onComplete: () => void;
    isActive: boolean;
}

export function Stage3_CSSStyling({ onComplete, isActive }: StageProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const checkOutput = useCallback(() => {
        // Check if body background color is pure red
        const isRed = code.includes('background-color: red;') || code.includes('background: red;');
        const isBody = code.includes('body {');

        if (isRed && isBody) {
            setError('');
            onComplete();
        } else {
            setError("Please select the 'body' element and apply 'background-color: red;'");
        }
    }, [code, onComplete]);

    useEffect(() => {
        if (isActive && code.length > 5) {
            const timeoutId = setTimeout(checkOutput, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [code, isActive, checkOutput]);

    return (
        <div className="space-y-6">
            <div className="bg-sunny/10 p-5 rounded-xl border border-sunny/20">
                <h3 className="font-[var(--font-display)] font-bold text-sunny mb-2 flex items-center gap-2">
                    <span>🎨</span> Instructions
                </h3>
                <p className="text-white/70">
                    Make the background of the <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">body</code> turn completely <code className="bg-white/10 px-2 py-0.5 rounded text-red-400 font-mono">red</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code Editor */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/50 font-mono flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="ml-2">style.css</span>
                    </label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!isActive}
                        className="w-full h-40 p-4 font-mono text-sm bg-[#1a1a2e] text-green-400 rounded-xl border border-white/10 shadow-inner focus:ring-2 focus:ring-sunny/50 focus:border-sunny/50 focus:outline-none transition-all resize-none"
                        placeholder={"body {\n  ...\n}"}
                        spellCheck="false"
                    />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/50 flex items-center gap-2">
                        <span>👁️</span> Live Preview
                    </label>
                    <div
                        className="w-full h-40 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center transition-all duration-500"
                        style={{
                            backgroundColor: error === '' && code.includes('red') && code.includes('body') ? 'red' : 'rgba(255,255,255,0.03)'
                        }}
                    >
                        <p className="text-sm font-[var(--font-display)] font-bold text-white/40 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur">
                            Preview Area
                        </p>
                    </div>
                </div>
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
