import React, { useState, useEffect, useRef } from 'react';
import { Person, WinnerRecord } from '../types';
import { Gift, RefreshCw, Settings, Trash2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LuckyDrawProps {
  people: Person[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ people }) => {
  const [winnersHistory, setWinnersHistory] = useState<WinnerRecord[]>([]);
  const [currentWinners, setCurrentWinners] = useState<Person[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [allowRepetition, setAllowRepetition] = useState(false);
  const [animationName, setAnimationName] = useState("準備抽獎");
  
  const animationIntervalRef = useRef<number | null>(null);

  // Filter available candidates
  const getAvailableCandidates = () => {
    if (allowRepetition) return people;
    const allPastWinnerNames = new Set(winnersHistory.flatMap(w => w.winners));
    return people.filter(p => !allPastWinnerNames.has(p.name));
  };

  const availableCandidates = getAvailableCandidates();

  const startDraw = () => {
    if (people.length === 0) {
        alert("請先輸入名單！");
        return;
    }
    if (availableCandidates.length < drawCount && !allowRepetition) {
      alert("剩餘候選人不足！請重置抽獎紀錄或允許重複抽取。");
      return;
    }

    setIsDrawing(true);
    setCurrentWinners([]);

    // Animation Logic
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

    animationIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableCandidates.length);
      setAnimationName(availableCandidates[randomIndex]?.name || "抽選中...");
    }, 50);

    setTimeout(() => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      
      // Select winners
      const candidates = [...availableCandidates];
      const newWinners: Person[] = [];
      
      for (let i = 0; i < drawCount; i++) {
        if (candidates.length === 0) break;
        const winnerIndex = Math.floor(Math.random() * candidates.length);
        newWinners.push(candidates[winnerIndex]);
        candidates.splice(winnerIndex, 1); // Remove selected to prevent duplicate in same batch (unless allowed logic differs, but usually batch needs unique)
      }

      setAnimationName(newWinners.length === 1 ? newWinners[0].name : "恭喜中獎！");
      setCurrentWinners(newWinners);
      setWinnersHistory(prev => [{
        timestamp: Date.now(),
        winners: newWinners.map(w => w.name)
      }, ...prev]);
      
      setIsDrawing(false);
      triggerConfetti();

    }, duration);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const resetHistory = () => {
    if (window.confirm("確定要清空所有中獎紀錄嗎？")) {
      setWinnersHistory([]);
      setCurrentWinners([]);
      setAnimationName("準備抽獎");
    }
  };

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Main Draw Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6">
               <Gift className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-5xl font-bold text-slate-800 mb-2 h-20 flex items-center justify-center">
               {animationName}
            </h2>
            <p className="text-slate-500">
               {isDrawing ? "正在尋找幸運兒..." : `目前名單共有 ${people.length} 人，剩餘可抽 ${availableCandidates.length} 人`}
            </p>
          </div>

          <div className="flex justify-center gap-4">
             <button
               onClick={startDraw}
               disabled={isDrawing || availableCandidates.length === 0}
               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none min-w-[200px]"
             >
               {isDrawing ? '抽選中...' : '開始抽獎'}
             </button>
          </div>
          
          {/* Current Batch Winners Display */}
          {currentWinners.length > 0 && !isDrawing && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 pt-8 border-t border-slate-100"
             >
                <h3 className="text-lg font-semibold text-slate-600 mb-4">🎉 本次中獎名單</h3>
                <div className="flex flex-wrap justify-center gap-3">
                   {currentWinners.map((winner, idx) => (
                      <span key={idx} className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-bold text-lg border border-yellow-200 shadow-sm">
                         {winner.name}
                      </span>
                   ))}
                </div>
             </motion.div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4 w-full md:w-auto">
              <Settings className="w-5 h-5 text-slate-400" />
              <div className="flex flex-col">
                 <label className="text-sm text-slate-500 mb-1">一次抽取人數</label>
                 <input 
                   type="number" 
                   min="1" 
                   max="50"
                   value={drawCount}
                   onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                   className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 px-4 py-3 rounded-xl">
              <input 
                type="checkbox" 
                id="allowRepetition"
                checked={allowRepetition}
                onChange={(e) => setAllowRepetition(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="allowRepetition" className="text-slate-700 font-medium cursor-pointer select-none">
                 允許重複中獎
                 <span className="block text-xs text-slate-400 font-normal">若勾選，已中獎者可再次被抽出</span>
              </label>
           </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] lg:h-auto">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Trophy className="w-5 h-5 text-yellow-500" />
               中獎紀錄
            </h3>
            <button 
              onClick={resetHistory}
              disabled={winnersHistory.length === 0}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="清空紀錄"
            >
               <Trash2 className="w-4 h-4" />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {winnersHistory.length === 0 ? (
               <div className="text-center text-slate-400 py-12">
                  <RefreshCw className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p>尚無中獎紀錄</p>
               </div>
            ) : (
               winnersHistory.map((record, index) => (
                  <motion.div 
                    key={record.timestamp}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                  >
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-slate-400">
                           #{winnersHistory.length - index} · {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {record.winners.map((w, idx) => (
                           <span key={idx} className="font-medium text-slate-700 bg-white px-2 py-1 rounded shadow-sm text-sm border border-slate-100">
                              {w}
                           </span>
                        ))}
                     </div>
                  </motion.div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};