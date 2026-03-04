'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/AuthProvider';
import { useTimer } from '@/lib/hooks/useTimer';
import { createClient } from '@/lib/supabase/client';
import { calculateMedal } from '@/lib/utils/medal';
import { GameTimer } from '@/components/game/GameTimer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Stage1_HTMLStructure } from '@/components/game/stages/Stage1_HTMLStructure';
import { Stage2_HTMLInput } from '@/components/game/stages/Stage2_HTMLInput';
import { Stage3_CSSStyling } from '@/components/game/stages/Stage3_CSSStyling';
import { Stage4_CSSFlexbox } from '@/components/game/stages/Stage4_CSSFlexbox';
import { Stage5_JSFunction } from '@/components/game/stages/Stage5_JSFunction';
import { Stage6_JSLogic } from '@/components/game/stages/Stage6_JSLogic';

const STAGES = [
    { id: 1, title: 'HTML Structure', sport: '🏊', sportName: 'Swimming', component: Stage1_HTMLStructure },
    { id: 2, title: 'HTML Input', sport: '🏊', sportName: 'Swimming', component: Stage2_HTMLInput },
    { id: 3, title: 'CSS Styling', sport: '🚴', sportName: 'Cycling', component: Stage3_CSSStyling },
    { id: 4, title: 'CSS Flexbox', sport: '🚴', sportName: 'Cycling', component: Stage4_CSSFlexbox },
    { id: 5, title: 'JavaScript Function', sport: '🏃', sportName: 'Running', component: Stage5_JSFunction },
    { id: 6, title: 'JavaScript Logic', sport: '🏃', sportName: 'Running', component: Stage6_JSLogic },
];

export default function GameStagePage() {
    const { stageId } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const timer = useTimer();
    const supabase = createClient();

    const [isFinished, setIsFinished] = useState(false);
    const [showCoach, setShowCoach] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());

    const currentStageId = parseInt(stageId as string);
    const stage = STAGES.find(s => s.id === currentStageId);

    useEffect(() => {
        if (stage && !isFinished) {
            timer.start();
        }
    }, [stage, isFinished, timer]);

    // Coach bubble after 15s inactivity
    useEffect(() => {
        if (isFinished) return;
        const interval = setInterval(() => {
            if (Date.now() - lastActivity > 15000) {
                setShowCoach(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastActivity, isFinished]);

    // Track activity
    useEffect(() => {
        const handleActivity = () => {
            setLastActivity(Date.now());
            setShowCoach(false);
        };
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);
        return () => {
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, []);

    const handleComplete = useCallback(async () => {
        if (!stage) return;
        timer.stop();
        setIsFinished(true);

        if (user) {
            const medal = calculateMedal(currentStageId, timer.seconds);

            await supabase.from('global_scores').insert({
                user_id: user.id,
                stage_id: currentStageId,
                time: timer.seconds,
                medal: medal
            });
        }
    }, [currentStageId, stage, supabase, timer, user]);

    if (!stage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 font-[var(--font-display)] text-xl">Stage not found.</p>
                </div>
            </div>
        );
    }

    const StageComponent = stage.component;

    return (
        <div className="min-h-screen bg-[#0a1628] relative">
            {/* Top Bar */}
            <div className="bg-ocean/80 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-6 lg:px-8 sticky top-[72px] z-40">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">{stage.sport}</span>
                        <div>
                            <h1 className="text-xl font-[var(--font-display)] font-bold text-white">
                                {stage.title}
                            </h1>
                            <p className="text-white/40 text-sm">{stage.sportName} • Stage {currentStageId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <GameTimer timer={timer} />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
                <Card className="relative">
                    <CardContent className="pt-6">
                        {!isFinished ? (
                            <StageComponent onComplete={handleComplete} isActive={true} />
                        ) : (
                            <div className="text-center py-16 animate-bounce-in">
                                <div className="text-7xl mb-6">🎉</div>
                                <h2 className="text-5xl font-[var(--font-display)] font-bold gradient-text mb-4">
                                    Stage Complete!
                                </h2>
                                <p className="text-xl text-white/60 mb-2">
                                    You completed <span className="text-white font-bold">{stage.title}</span>
                                </p>
                                <p className="text-3xl font-mono font-bold text-sunny mb-8">
                                    ⏱️ {timer.formattedTime}
                                </p>

                                <div className="flex justify-center gap-4">
                                    {currentStageId < 6 ? (
                                        <Button onClick={() => window.location.href = `/game/${currentStageId + 1}`} size="lg">
                                            {STAGES[currentStageId]?.sport} Next Stage →
                                        </Button>
                                    ) : (
                                        <Button onClick={() => router.push('/leaderboard')} size="lg">
                                            🏆 View Leaderboard
                                        </Button>
                                    )}
                                    <Button variant="secondary" onClick={() => router.push('/dashboard')} size="lg">
                                        🏠 Dashboard
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Coach Bubble */}
                {showCoach && !isFinished && (
                    <div className="fixed bottom-8 right-8 z-50 animate-coach-pop">
                        <div className="bg-sunny/90 backdrop-blur-sm text-ocean rounded-2xl rounded-br-sm p-5 shadow-2xl shadow-sunny/30 max-w-xs">
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">🏅</span>
                                <div>
                                    <p className="font-[var(--font-display)] font-bold text-sm mb-1">Coach says:</p>
                                    <p className="text-sm">Need help? Try reading the instructions again carefully! You got this! 💪</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
