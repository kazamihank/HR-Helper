import React, { useState } from 'react';
import { Person, Group } from '../types';
import { Users, Download, Shuffle, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupGeneratorProps {
  people: Person[];
}

export const GroupGenerator: React.FC<GroupGeneratorProps> = ({ people }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateGroups = () => {
    if (people.length === 0) {
        alert("請先輸入名單");
        return;
    }
    
    // Fisher-Yates Shuffle
    const shuffled = [...people];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: Group[] = [];
    let groupIndex = 1;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const chunk = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: groupIndex++,
        members: chunk
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // CSV BOM for UTF-8 compatibility in Excel
    const BOM = "\uFEFF";
    let csvContent = BOM + "組別,姓名\n";

    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `第 ${group.id} 組,${member.name}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
         <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
                <label className="block text-sm text-slate-500 mb-1 font-medium">每組人數</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min="1" 
                        max={people.length || 100}
                        value={groupSize} 
                        onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full md:w-32 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium text-slate-700"
                    />
                    <span className="text-slate-400 text-sm whitespace-nowrap">
                        預計 {Math.ceil((people.length || 0) / groupSize)} 組
                    </span>
                </div>
            </div>
         </div>

         <div className="flex items-center gap-3 w-full md:w-auto">
             <button
                onClick={generateGroups}
                disabled={people.length === 0}
                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-100"
             >
                <Shuffle className="w-4 h-4" />
                自動分組
             </button>
             {isGenerated && (
                <button
                    onClick={downloadCSV}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium flex items-center justify-center gap-2 shadow-md shadow-slate-200"
                >
                    <Download className="w-4 h-4" />
                    下載 CSV
                </button>
             )}
         </div>
      </div>

      {/* Results Visualization */}
      <div className="flex-1 bg-slate-50 rounded-2xl p-4 md:p-6 overflow-y-auto custom-scrollbar border border-slate-200 min-h-[400px]">
        {!isGenerated ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">設定人數並點擊「自動分組」以查看結果</p>
                <p className="text-sm mt-2 opacity-60">目前共有 {people.length} 位參與者</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                    {groups.map((group) => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: group.id * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
                        >
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">第 {group.id} 組</h3>
                                <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                                    {group.members.length} 人
                                </span>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                {group.members.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium shrink-0">
                                            {idx + 1}
                                        </div>
                                        {member.name}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
};