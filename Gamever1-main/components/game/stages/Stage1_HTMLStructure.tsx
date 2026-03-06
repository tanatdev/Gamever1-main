"use client";

import { useState, useEffect } from "react";

interface StageProps {
  onComplete: () => void;
  isActive: boolean;
}

interface Bubble {
  id: number;
  tag: string;
  y: number;
  x: number;
  speed: number;
}

// 1. คลังคำถาม
const ALL_QUESTIONS = [
  {
    tag: "<h1>",
    q: "แท็ก <h1> ใช้ทำอะไรในหน้าเว็บ?",
    ans: "หัวข้อหลัก (Main Heading)",
    decovs: ["ย่อหน้าทั่วไป (Paragraph)", "ตัวหนา (Bold Text)", "รายการ (List Item)"],
  },
  {
    tag: "<p>",
    q: "แท็ก <p> มีหน้าที่หลักคืออะไร?",
    ans: "ข้อความย่อหน้า (Paragraph Content)",
    decovs: ["หัวข้อใหญ่ (Main Heading)", "ลิงก์เชื่อมโยง (Hyperlink)", "รูปภาพประกอบ (Image Content)"],
  },
  {
    tag: "<a>",
    q: "แท็ก <a> ถูกใช้เพื่อจุดประสงค์ใด?",
    ans: "ลิงก์เชื่อมโยง (Hyperlink Link)",
    decovs: ["ขึ้นบรรทัดใหม่ (Line Breaker)", "ตัวอักษรเอียง (Italic Style)", "จัดกลุ่มข้อมูล (Division Box)"],
  },
  {
    tag: "<img>",
    q: "แท็ก <img> จำเป็นต้องมี Attribute ใด?",
    ans: "แหล่งที่มารูป (Source Path)",
    decovs: ["ลิงก์ปลายทาง (Link Path)", "ชื่อหัวข้อ (Title Name)", "ลำดับรายการ (List Index)"],
  },
  {
    tag: "<ul>",
    q: "แท็ก <ul> ทำงานร่วมกับแท็กใดเสมอ?",
    ans: "รายการข้อมูล (List Item)",
    decovs: ["เส้นคั่นบรรทัด (Horizontal Line)", "จัดกลุ่มเนื้อหา (Content Group)", "ส่วนหัวตาราง (Table Header)"],
  },
];

export function Stage1_HTMLStructure({ onComplete, isActive }: StageProps) {
  const [yPos, setYPos] = useState(50);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isStunned, setIsStunned] = useState(false);
  const [stunTimer, setStunTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  // 1. สร้างคิวคำถาม (กองไพ่ที่สับแล้ว)
  const [questionQueue, setQuestionQueue] = useState<typeof ALL_QUESTIONS>([]);
  // 2. เก็บข้อปัจจุบันที่กำลังเล่น
  const [currentQ, setCurrentQ] = useState<(typeof ALL_QUESTIONS)[0] | null>(
    null,
  );

  // 3. กำหนดเป้าหมาย (ถ้ายังไม่มีคำถาม ให้เป็นว่างไว้ก่อน)
  const targetTag = currentQ?.tag || "";
  const dummyTags = [
    "<p>",
    "<div>",
    "<span>",
    "<a>",
    "<img>",
    "<ul>",
    "<li>",
    "<br>",
    "<hr>",
  ];

  // ระบบควบคุมตัวละคร
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isQuizMode || isStunned) return;
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") {
        e.preventDefault();
        setYPos((prev) => Math.max(10, prev - 20));
      }
      if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        setYPos((prev) => Math.min(90, prev + 20));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isQuizMode, isStunned]);

  // ระบบสร้างและเคลื่อนที่ฟองสบู่
  useEffect(() => {
    if (!isActive || isQuizMode || isStunned) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      const isTarget = Math.random() < 0.25;
      const lanes = [10, 30, 50, 70, 90];
      const randomY = lanes[Math.floor(Math.random() * lanes.length)];

      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        tag: isTarget
          ? targetTag
          : dummyTags[Math.floor(Math.random() * dummyTags.length)],
        y: randomY,
        x: 100,
        speed: 0.6 + Math.random() * 0.7,
      };
      setBubbles((prev) => [...prev, newBubble]);
    }, 900);

    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => ({ ...b, x: b.x - b.speed })).filter((b) => b.x > -20),
      );
    }, 20);

    return () => {
      clearInterval(interval);
      clearInterval(moveInterval);
    };
  }, [isActive, isQuizMode, isStunned, targetTag]);

  // ตรวจจับการชน
  useEffect(() => {
    if (!isActive || isQuizMode || isStunned) return;
    const hit = bubbles.find(
      (b) => Math.abs(b.x - 15) < 1.5 && Math.abs(b.y - yPos) < 4,
    );

    if (hit && hit.x > 12 && hit.x < 18) {
      setBubbles((prev) => prev.filter((b) => b.id !== hit.id));
      if (hit.tag === targetTag) {
        setIsQuizMode(true);
      } else {
        triggerPenalty();
      }
    }
  }, [bubbles, yPos, isActive, isQuizMode, isStunned, targetTag]);

  // สลับปุ่ม Kahoot
  useEffect(() => {
    if (isQuizMode) {
      const all = [currentQ.ans, ...currentQ.decovs]
        .map((text) => ({ text, isCorrect: text === currentQ.ans }))
        .sort(() => Math.random() - 0.5);
      setShuffledOptions(all);
    }
  }, [isQuizMode, currentQ]);

  const triggerPenalty = () => {
    setIsStunned(true);
    setStunTimer(3);
    const timer = setInterval(() => {
      setStunTimer((p) => {
        if (p <= 1) {
          clearInterval(timer);
          setIsStunned(false);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  const handleCorrect = () => {
    const newScore = score + 1;
    setScore(newScore);
    setIsQuizMode(false);

    // ถ้าคะแนนถึง 3 ให้จบ Stage
    if (newScore >= 3) {
      onComplete();
    } else {
      // 🎲 หยิบคำถามใบถัดไปจากกองที่สับไว้แล้ว (ใช้คะแนนเป็นดัชนี)
      if (questionQueue[newScore]) {
        setCurrentQ(questionQueue[newScore]);
      }
    }
  };
  // สั่งสับลำดับคำถามใหม่ทันทีที่เข้า Stage
  useEffect(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestionQueue(shuffled);
    setCurrentQ(shuffled[0]); // เริ่มที่ข้อแรกของกองที่สับแล้ว
  }, []);
  return (
    <div className="space-y-6 overflow-hidden select-none">
      {/* PROGRESS BAR แถบสีเทาด้านบน */}
      <div className="bg-white/10 p-4 rounded-2xl border-2 border-white/20 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div>
            <h3 className="font-black text-white italic tracking-tighter">
              SWIMMING STAGE
            </h3>
            <p className="text-cyan-300 text-[10px] font-bold uppercase">
              Progress: {score}/3
            </p>
          </div>

          {/* ป้ายบอกเป้าหมายสีเทา */}
          <div className="h-10 w-[2px] bg-white/20 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
              Target:
            </span>
            <span className="text-yellow-400 font-black text-2xl animate-pulse">
              {targetTag}
            </span>
          </div>
        </div>

        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-sm rotate-45 transition-all duration-500 ${i < score ? "bg-yellow-400 shadow-[0_0_15px_#f2d913]" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      {/* SWIMMING POOL CONTAINER */}
      <div className="relative w-full h-[450px] bg-gradient-to-b from-cyan-600 via-blue-500 to-blue-700 rounded-3xl overflow-hidden border-8 border-slate-800 shadow-2xl">
        {/* ทุ่นเลนสระว่ายน้ำ */}
        <div className="absolute inset-0 flex flex-col justify-between py-[10%] opacity-60 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative w-full h-4 flex items-center overflow-hidden"
            >
              <div className="absolute w-full h-[2px] bg-slate-300 top-1/2 -translate-y-1/2"></div>
              <div className="flex w-full justify-around px-2">
                {[...Array(20)].map((_, ballIdx) => (
                  <div
                    key={ballIdx}
                    className={`w-3 h-3 rounded-full shadow-inner ${ballIdx % 2 === 0 ? "bg-rose-500" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Player */}
        <div
          className="absolute transition-all duration-300 ease-out z-50"
          style={{
            left: `15%`,
            top: `${yPos}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <span className="text-6xl drop-shadow-2xl block">🏊‍♂️</span>
            {!isStunned && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                YOU
              </div>
            )}
          </div>
        </div>

        {/* Bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold px-4 py-2 rounded-full shadow-inner flex items-center justify-center z-40"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {b.tag}
          </div>
        ))}

        {/* Quiz Overlay */}
        {isQuizMode && (
          <div className="absolute inset-0 bg-slate-900/90 z-[100] flex flex-col items-center p-8 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 text-center shadow-2xl">
              <h2 className="text-blue-600 font-black text-xl mb-2">
                QUESTION {score + 1}/3
              </h2>
              <h1 className="text-4xl font-black text-slate-800 mb-8 italic">
                {currentQ?.q} {/* เติมเครื่องหมาย ? หลัง currentQ */}
              </h1>
              <div className="grid grid-cols-2 gap-4">
                {shuffledOptions.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      opt.isCorrect
                        ? handleCorrect()
                        : (setIsQuizMode(false), triggerPenalty())
                    }
                    className={`${["bg-rose-500", "bg-blue-600", "bg-emerald-500", "bg-amber-400"][index % 4]} hover:opacity-90 text-white p-6 rounded-2xl font-bold text-xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Frozen Overlay */}
        {isStunned && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/40 backdrop-blur-xl z-[110] animate-in fade-in zoom-in duration-300">
            <div className="text-center relative">
              <div className="text-9xl animate-bounce mb-2">🥶</div>
              <div className="text-[12rem] font-black text-white drop-shadow-2xl leading-none mt-[-20px]">
                {stunTimer}
              </div>
              <div className="text-4xl font-black text-cyan-100 italic tracking-widest uppercase mt-4">
                FREEZING...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
