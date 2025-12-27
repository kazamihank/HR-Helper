import React, { useState, useEffect, useRef } from 'react';
import { Person } from '../types';
import { MOCK_NAMES } from '../constants';
import { Upload, Trash2, UserPlus, AlertTriangle, FileText, CheckCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputSectionProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}

export const InputSection: React.FC<InputSectionProps> = ({ people, setPeople }) => {
  const [inputText, setInputText] = useState('');
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect duplicates whenever people list changes
    const names = people.map(p => p.name);
    const uniqueNames = new Set(names);
    const duplicateNames = names.filter((item, index) => names.indexOf(item) !== index);
    setDuplicates([...new Set(duplicateNames)]);
  }, [people]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const processNames = (rawText: string) => {
    const lines = rawText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
    const newPeople: Person[] = lines.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    setPeople(prev => [...prev, ...newPeople]);
    setInputText('');
  };

  const handleAddFromText = () => {
    if (!inputText) return;
    processNames(inputText);
  };

  const handleLoadMock = () => {
    const newPeople = MOCK_NAMES.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    setPeople(newPeople);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processNames(text);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleRemoveDuplicates = () => {
    const uniquePeople: Person[] = [];
    const seenNames = new Set<string>();

    people.forEach(p => {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        uniquePeople.push(p);
      }
    });
    setPeople(uniquePeople);
  };

  const clearList = () => setPeople([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Control Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            名單來源
          </h2>
          
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="請在此貼上姓名，以換行或逗號分隔..."
            className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-4 text-slate-700 placeholder:text-slate-400"
          />

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleAddFromText}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              加入名單
            </button>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.txt"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center gap-2 border border-slate-200">
                <Upload className="w-4 h-4" />
                上傳 CSV/TXT
              </button>
            </div>
            <button
              onClick={handleLoadMock}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center gap-2 border border-indigo-100 ml-auto"
            >
              <Copy className="w-4 h-4" />
              使用模擬名單
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">名單狀態</h3>
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">總人數</span>
                <span className="text-2xl font-bold text-slate-800">{people.length}</span>
            </div>
            {duplicates.length > 0 ? (
                 <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-800 font-medium">發現 {duplicates.length} 個重複姓名</p>
                            <p className="text-amber-600 text-sm mt-1">
                                重複項目: {duplicates.slice(0, 3).join(', ')} {duplicates.length > 3 ? `...等` : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveDuplicates}
                        className="w-full py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium transition-colors text-sm"
                    >
                        一鍵移除重複姓名
                    </button>
                 </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">名單檢查正常，無重複</span>
                </div>
            )}
            
            <button 
                onClick={clearList}
                disabled={people.length === 0}
                className="w-full mt-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <Trash2 className="w-4 h-4" />
                清空名單
            </button>
        </div>
      </div>

      {/* Preview Column */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] lg:h-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
          <span>名單預覽</span>
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {people.length} 人
          </span>
        </h2>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 border-t border-slate-100 pt-4">
          <AnimatePresence>
            {people.map((person, index) => {
              const isDuplicate = duplicates.includes(person.name);
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isDuplicate 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-6">{index + 1}</span>
                    <span className={`font-medium ${isDuplicate ? 'text-amber-800' : 'text-slate-700'}`}>
                      {person.name}
                    </span>
                    {isDuplicate && (
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">重複</span>
                    )}
                  </div>
                  <button
                    onClick={() => setPeople(prev => prev.filter(p => p.id !== person.id))}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {people.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-12 h-12 mb-2 opacity-20" />
                <p>尚未加入任何名單</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};