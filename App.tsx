import React, { useState, useEffect } from 'react';
import { DecisionPacket, RoundState, SCENARIO_EVENTS } from './types';
import { runSimulationRound, getInitialState } from './services/simulationEngine';
import { Dashboard } from './components/Dashboard';
import { DecisionForm } from './components/DecisionForm';
import { SimulationLog } from './components/SimulationLog';
import { COPYRIGHT_TEXT, MAX_ROUNDS } from './constants';
import { PlayCircle, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<RoundState[]>([getInitialState()]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const currentState = history[history.length - 1];
  const isGameOver = currentState.round >= MAX_ROUNDS || currentState.isBankrupt;

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleDecisionSubmit = (decision: DecisionPacket) => {
    setIsSimulationRunning(true);
    
    // Simulate processing delay for "High-Fidelity" feel
    setTimeout(() => {
      const newState = runSimulationRound(currentState, decision);
      setHistory(prev => [...prev, newState]);
      setIsSimulationRunning(false);
    }, 800);
  };

  const handleReset = () => {
    setHistory([getInitialState()]);
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#F6F4F2] flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-xl border-t-4 border-[#A41034]">
          <h1 className="text-4xl font-serif font-bold text-[#A41034] mb-2 text-center">TechMark Silver Q</h1>
          <h2 className="text-xl text-gray-600 text-center mb-8 font-serif italic">海港城情景仿真引擎</h2>
          
          <div className="prose prose-sm text-gray-600 mb-8 mx-auto">
            <p><strong>系统身份:</strong> 这是“奇点智库实境案例模拟商战”的核心引擎。</p>
            <p><strong>仿真范式:</strong> Harbor-City (青岛城阳数字孪生)。</p>
            <p><strong>核心逻辑:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
               <li>宏观: Gold & Pray 非线性模型 (对数正态分布)</li>
               <li>微观: BLP 模型 (含 Anderson 加速算法)</li>
               <li>运营: SimPy 离散事件仿真 (Lencioni 团队模型)</li>
               <li>政策: 2024 预收费新政 (严格执行)</li>
            </ul>
          </div>

          <button 
            onClick={handleStartGame}
            className="w-full bg-[#A41034] hover:bg-[#8B0E2C] text-white text-lg font-bold py-4 rounded-md shadow transition-transform transform hover:scale-[1.01] flex items-center justify-center gap-3"
          >
            <PlayCircle size={24} /> 开始模拟
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-8 font-serif">
            {COPYRIGHT_TEXT}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#A41034] text-white shadow-md z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="font-serif font-bold text-lg tracking-wide">TechMark Silver Q</div>
                <div className="h-4 w-px bg-white/30 mx-2"></div>
                <div className="text-sm opacity-90 font-light">海港城情景</div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                <span>第 {currentState.round} / {MAX_ROUNDS} 回合</span>
                {isGameOver && (
                    <button onClick={handleReset} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition">
                        <RotateCcw size={14} /> 重新开始
                    </button>
                )}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Logs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
             <DecisionForm 
                currentRound={currentState.round} 
                onSubmit={handleDecisionSubmit} 
                disabled={isGameOver || isSimulationRunning} 
             />
             <div className="flex-1 min-h-[400px]">
                <SimulationLog logs={currentState.lastLogs} />
             </div>
        </div>

        {/* Right Column: Dashboard (8 cols) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
            <Dashboard history={history} currentRound={currentState.round} />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[10px] text-gray-400 font-serif">
           {COPYRIGHT_TEXT}
        </div>
      </footer>
    </div>
  );
};

export default App;