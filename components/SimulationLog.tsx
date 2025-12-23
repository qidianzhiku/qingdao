import React from 'react';
import { SimulationLogEntry } from '../types';
import { Terminal, Cpu, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants';

interface Props {
  logs: SimulationLogEntry[];
}

export const SimulationLog: React.FC<Props> = ({ logs }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Macro': return <TrendingUp size={16} className="text-blue-600" />;
      case 'Micro': return <Cpu size={16} className="text-purple-600" />;
      case 'Ops': return <Users size={16} className="text-orange-600" />;
      case 'Finance': return <DollarSign size={16} className="text-green-600" />;
      default: return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
      switch (category) {
          case 'Macro': return '宏观';
          case 'Micro': return '微观';
          case 'Ops': return '运营';
          case 'Finance': return '财务';
          case 'Event': return '事件';
          default: return category;
      }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <Terminal size={18} color={COLORS.textDark} />
        <h3 className="font-serif font-bold text-gray-800 text-sm uppercase tracking-wide">
          仿真推演日志 (Internal Thought Process)
        </h3>
      </div>
      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3 bg-[#1e1e1e] text-gray-300">
        {logs.length === 0 ? (
          <p className="opacity-50 italic">等待模拟输入...</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="border-l-2 border-gray-600 pl-3 py-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="opacity-70 text-[10px]">{log.timestamp}</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] bg-opacity-20 ${
                  log.category === 'Macro' ? 'bg-blue-500 text-blue-300' :
                  log.category === 'Micro' ? 'bg-purple-500 text-purple-300' :
                  log.category === 'Ops' ? 'bg-orange-500 text-orange-300' :
                  log.category === 'Finance' ? 'bg-green-500 text-green-300' :
                  'bg-gray-500 text-gray-300'
                }`}>
                  [{getCategoryLabel(log.category)}]
                </span>
              </div>
              <p className="text-gray-100 font-semibold mb-0.5">{log.message}</p>
              {log.details && <p className="text-gray-400 leading-relaxed">{log.details}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};