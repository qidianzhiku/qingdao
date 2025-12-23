import React, { useState } from 'react';
import { DecisionPacket } from '../types';
import { Send, AlertCircle } from 'lucide-react';
import { COLORS } from '../constants';

interface Props {
  currentRound: number;
  onSubmit: (decision: DecisionPacket) => void;
  disabled: boolean;
}

export const DecisionForm: React.FC<Props> = ({ currentRound, onSubmit, disabled }) => {
  const [decision, setDecision] = useState<DecisionPacket>({
    pricePerMonth: 6000,
    prepayMonths: 3,
    marketingSpend: 50000,
    staffRatio: 0.4,
    wageIndex: 1.0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDecision(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(decision);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif font-bold text-xl text-[#A41034]">
          第 {currentRound + 1} 回合决策
        </h3>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">需输入决策</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pricing */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              月费定价 (CNY)
            </label>
            <input
              type="number"
              name="pricePerMonth"
              value={decision.pricePerMonth}
              onChange={handleChange}
              min="2000"
              max="20000"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A41034] transition-colors bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              预收费月数 (月)
            </label>
            <div className="relative">
              <input
                type="number"
                name="prepayMonths"
                value={decision.prepayMonths}
                onChange={handleChange}
                min="0"
                max="36"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-gray-50 ${
                  decision.prepayMonths > 12 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#A41034]'
                }`}
              />
              {decision.prepayMonths > 12 && (
                 <div className="absolute top-full left-0 mt-1 flex items-center text-red-600 text-xs font-bold">
                    <AlertCircle size={12} className="mr-1"/> 政策警告: >12月违规
                 </div>
              )}
            </div>
          </div>

          {/* Marketing */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              营销投入 (CNY)
            </label>
            <input
              type="number"
              name="marketingSpend"
              value={decision.marketingSpend}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A41034] transition-colors bg-gray-50"
            />
          </div>

          {/* HR */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              薪资指数 (市场平均 = 1.0)
            </label>
            <input
              type="number"
              name="wageIndex"
              value={decision.wageIndex}
              onChange={handleChange}
              min="0.8"
              max="2.0"
              step="0.05"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A41034] transition-colors bg-gray-50"
            />
          </div>
          
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              人床比 (员工/床位)
            </label>
            <input
              type="number"
              name="staffRatio"
              value={decision.staffRatio}
              onChange={handleChange}
              min="0.1"
              max="1.0"
              step="0.05"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A41034] transition-colors bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">建议值: 0.4+</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`w-full mt-6 py-3 px-4 rounded-md text-white font-bold flex justify-center items-center gap-2 transition-all shadow-md ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A41034] hover:bg-[#8B0E2C]'
          }`}
        >
          {disabled ? '模拟结束' : (
            <>
              提交决策 <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};