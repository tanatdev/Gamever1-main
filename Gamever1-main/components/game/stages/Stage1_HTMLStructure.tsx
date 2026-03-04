'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface StageProps {
    onComplete: () => void;
    isActive: boolean;
}

interface Bubble {
    id: number;
    tag: string;
    y: number;
    x: number;
}

export function Stage1_HTMLStructure({ onComplete, isActive }: StageProps) {
    const [yPos, setYPos] = useState(50);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [isStunned, setIsStunned] = useState(false);
    const targetTag = "<h1>";

    // --- 1. ระบบควบคุม (ป้องกัน Scroll + W,S,Arrow) ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActive || isQuizMode || isStunned) return;
            const key = e.key.toLowerCase();
            if (key === 'arrowup' || key === 'w') {
                e.preventDefault();
                setYPos(prev => Math.max(10, prev - 15));
            }
            if (key === 'arrowdown' || key === 's') {
                e.preventDefault();
                setYPos(prev => Math.min(85, prev + 15));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, isQuizMode, isStunned]);

    // --- 2. ระบบสุ่มฟองสบู่ (Random Spawner) ---
    useEffect(() => {
        if (!isActive || isQuizMode || isStunned) return;

        // สุ่มสร้างฟองสบู่ทุกๆ 1.5 วินาที
        const interval = setInterval(() => {
            // เช็คว่าถ้าพับจออยู่ (document.hidden) ไม่ต้องสร้างฟองสบู่เพิ่ม
            if (document.hidden) return;

            const newBubble: Bubble = {
                id: Date.now() + Math.random(),
                tag: Math.random() > 0.4 ? "<h1>" : "<p>", // สุ่ม Tag
                y: Math.floor(Math.random() * 70) + 15,
                x: 100
            };
            setBubbles(prev => [...prev, newBubble]);
        }, 1500);

        // เคลื่อนที่ฟองสบู่
        const moveInterval = setInterval(() => {
            setBubbles(prev => 
                prev.map(b => ({ ...b, x: b.x - 0.6 })) // ปรับความเร็วตรงนี้ (0.6)
                    .filter(b => b.x > -10)
            );
        }, 20);

        return () => {
            clearInterval(interval);
            clearInterval(moveInterval);
        };
    }, [isActive, isQuizMode, isStunned]);

    // --- 3. ระบบตรวจจับการชน ---
    useEffect(() => {
        if (!isActive || isQuizMode || isStunned) return;

        const playerX = 15;
        const collisionBubble = bubbles.find(b => 
            b.x > playerX - 5 && 
            b.x < playerX + 5 && 
            Math.abs(b.y - yPos) < 10
        );

        if (collisionBubble) {
            if (collisionBubble.tag === targetTag) {
                setIsQuizMode(true);
                setBubbles([]); 
            } else {
                triggerPenalty();
            }
        }
    }, [bubbles, yPos, isActive, isQuizMode, isStunned]);

    const triggerPenalty = () => {
        setIsStunned(true);
        setBubbles([]); 
        setTimeout(() => setIsStunned(false), 3000);
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setIsQuizMode(false);
            onComplete();
        } else {
            setIsQuizMode(false);
            triggerPenalty();
        }
    };

    return (
        <div className="space-y-6 overflow-hidden select-none">
            <div className="bg-sky/10 p-4 rounded-xl border border-sky/20 flex justify-between items-center backdrop-blur-sm">
                <div>
                    <h3 className="font-bold text-sky-light flex items-center gap-2"><span>🏊‍♂️</span> Mission</h3>
                    <p className="text-white/70 text-sm">ชนฟองสบู่ <code className="text-sunny font-mono font-bold">&lt;h1&gt;</code> เพื่อสร้างหัวข้อ "Hello World"</p>
                </div>
                <div className="bg-white p-2 rounded shadow-lg text-black text-[10px] w-32 border-t-8 border-gray-200">
                    <h1 className="font-bold text-sm">Hello World</h1>
                    <div className="h-1 w-full bg-gray-200 mt-1"></div>
                </div>
            </div>

            <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-600 to-blue-900 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                {/* Lanes */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '100% 25%' }}></div>

                {/* You Player */}
                <div 
                    className={`absolute left-[15%] transition-all duration-200 z-10 ${isStunned ? 'animate-pulse opacity-50 grayscale' : ''}`}
                    style={{ top: `${yPos}%`, transform: 'translateY(-50%)' }}
                >
                    <div className="relative">
                        <span className="text-6xl drop-shadow-md">🏊‍♂️</span>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sunny text-blue-900 text-[10px] font-black px-2 rounded-full">YOU</div>
                    </div>
                </div>

                {/* Random Bubbles */}
                {bubbles.map(b => (
                    <div 
                        key={b.id}
                        className={`absolute w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-white border-2 backdrop-blur-sm shadow-inner transition-transform animate-bounce
                            ${b.tag === '<h1>' ? 'bg-sky/30 border-sky-light' : 'bg-white/20 border-white/40'}`}
                        style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translateY(-50%)' }}
                    >
                        {b.tag}
                    </div>
                ))}

                {/* Penalty/Stun Overlay */}
                {isStunned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-600/40 backdrop-blur-sm z-20">
                        <div className="text-center">
                            <div className="text-6xl mb-2">🚫</div>
                            <div className="text-2xl font-black text-white italic">STUNNED! (3s)</div>
                        </div>
                    </div>
                )}

                {/* Quiz Overlay (Kahoot Style) */}
                {isQuizMode && (
                    <div className="absolute inset-0 bg-[#f3f3f3] z-[100] flex flex-col items-center">
                         <div className="w-full bg-white p-8 text-center shadow-md">
                            <h1 className="text-6xl font-black text-black mb-2">Hello</h1>
                            <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Answer...</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4 w-full h-full p-6">
                            <button onClick={() => handleQuizAnswer(true)} className="bg-[#1338be] hover:opacity-90 transition-all rounded-lg shadow-xl active:translate-y-1">git init</button>
                            <button onClick={() => handleQuizAnswer(false)} className="bg-[#d01937] hover:opacity-90 transition-all rounded-lg shadow-xl active:translate-y-1"></button>
                            <button onClick={() => handleQuizAnswer(false)} className="bg-[#2ebfa5] hover:opacity-90 transition-all rounded-lg shadow-xl active:translate-y-1"></button>
                            <button onClick={() => handleQuizAnswer(false)} className="bg-[#f2d913] hover:opacity-90 transition-all rounded-lg shadow-xl active:translate-y-1"></button>
                         </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-white/40 italic">
                <p>กด ↑ ↓ หรือ W S เพื่อบังคับทิศทาง</p>
                <div className="flex items-center gap-2">
                    <span>💡 Hint: สุ่มดวงและสุ่มความรู้ไปพร้อมๆ กัน!</span>
                </div>
            </div>
        </div>
    );
}