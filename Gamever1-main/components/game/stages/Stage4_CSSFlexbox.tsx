'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface StageProps {
    onComplete: () => void;
    isActive: boolean;
}

export function Stage4_CSSFlexbox({ onComplete, isActive }: StageProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const checkOutput = useCallback(() => {
        // Basic checking for flexbox centering
        const hasDisplayFlex = code.includes('display: flex;');
        const hasJustifyCenter = code.includes('justify-content: center;');
        const hasAlignItemsCenter = code.includes('align-items: center;');

        if (hasDisplayFlex && hasJustifyCenter && hasAlignItemsCenter) {
            setError('');
            onComplete();
        } else {
            setError("Not quite right. Make sure to use 'display', 'justify-content', and 'align-items'.");
        }
    }, [code, onComplete]);

    useEffect(() => {
        if (isActive && code.length > 20) {
            const timeoutId = setTimeout(checkOutput, 1500);
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
                    Center the box perfectly inside its container using Flexbox. Apply the correct CSS properties to the <code className="bg-white/10 px-2 py-0.5 rounded text-sunny font-mono">.container</code> class.
                </p>
            </div>

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
                    className="w-full h-44 p-4 font-mono text-sm bg-[#1a1a2e] text-green-400 rounded-xl border border-white/10 shadow-inner focus:ring-2 focus:ring-sunny/50 focus:border-sunny/50 focus:outline-none transition-all resize-none"
                    placeholder={".container {\n  height: 100vh;\n  /* your code here */\n}"}
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
