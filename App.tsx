import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupGenerator } from './components/GroupGenerator';
import { Person, AppMode } from './types';
import { Users, Gift, Edit3, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);
  const [people, setPeople] = useState<Person[]>([]);

  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
        mode === targetMode
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'text-slate-500 hover:bg-white hover:text-slate-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      {/* Header / Nav */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                    HR 小幫手
                </h1>
                <p className="text-xs text-slate-400">抽獎與分組工具</p>
             </div>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-2 bg-slate-100/50 p-1.5 rounded-full">
            <NavButton targetMode={AppMode.INPUT} icon={Edit3} label="名單管理" />
            <NavButton targetMode={AppMode.DRAW} icon={Gift} label="幸運抽獎" />
            <NavButton targetMode={AppMode.GROUP} icon={Users} label="自動分組" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="h-full">
            {mode === AppMode.INPUT && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InputSection people={people} setPeople={setPeople} />
                </div>
            )}
            
            {mode === AppMode.DRAW && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <LuckyDraw people={people} />
                </div>
            )}
            
            {mode === AppMode.GROUP && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GroupGenerator people={people} />
                </div>
            )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto bg-white">
          <p>© {new Date().getFullYear()} HR 小幫手 | 快速、簡單、好用的團隊管理工具</p>
      </footer>
    </div>
  );
};

export default App;