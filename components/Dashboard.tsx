import React from 'react';
import { RoundState } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Activity, AlertOctagon, HeartPulse, Wallet } from 'lucide-react';
import { COLORS } from '../constants';

interface Props {
  history: RoundState[];
  currentRound: number;
}

export const Dashboard: React.FC<Props> = ({ history, currentRound }) => {
  const currentState = history[history.length - 1];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(val);
  };

  const KPICard = ({ title, value, subtext, icon, alert }: { title: string, value: string, subtext?: string, icon: React.ReactNode, alert?: boolean }) => (
    <div className={`bg-white p-5 rounded-lg border ${alert ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} shadow-sm flex items-start justify-between`}>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h4 className={`text-2xl font-serif font-bold ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value}</h4>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-2 rounded-full ${alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-[#A41034]'}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {(currentState.regulatoryFlags.length > 0 || currentState.isBankrupt) && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm flex items-center gap-3 animate-pulse">
          <AlertOctagon className="text-red-600" size={24} />
          <div>
            <h4 className="font-bold text-red-800">严重警告</h4>
            <p className="text-sm text-red-700">
              {currentState.isBankrupt ? "现金流断裂 / 破产风险。 " : ""}
              {currentState.regulatoryFlags.join(" | ")}
            </p>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="现金储备" 
          value={formatCurrency(currentState.cash)} 
          subtext={currentState.ebitda < 0 ? "现金流失中" : "现金流为正"}
          icon={<Wallet size={20} />} 
          alert={currentState.cash < 500000}
        />
        <KPICard 
          title="入住率" 
          value={`${(currentState.occupancy * 100).toFixed(1)}%`} 
          subtext={`市场份额: ${(currentState.marketShare * 100).toFixed(1)}%`}
          icon={<Users size={20} />} 
        />
        <KPICard 
          title="EBITDA" 
          value={formatCurrency(currentState.ebitda)} 
          icon={<TrendingUp size={20} />} 
          alert={currentState.ebitda < 0}
        />
        <KPICard 
          title="NPS / 声誉" 
          value={currentState.nps.toFixed(0)} 
          subtext={`职业倦怠: ${(currentState.burnoutIndex * 100).toFixed(0)}%`}
          icon={<HeartPulse size={20} />} 
          alert={currentState.nps < 30}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={16} /> 财务趋势
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="round" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} width={80} tickFormatter={(val) => `¥${val/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#FFF', borderColor: '#E5E7EB', fontFamily: 'Inter'}}
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="cash" stroke="#10B981" fillOpacity={1} fill="url(#colorCash)" name="现金" strokeWidth={2} />
                <Line type="monotone" dataKey="ebitda" stroke="#A41034" strokeWidth={2} dot={false} name="EBITDA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={16} /> 运营指标
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="round" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" tick={{fontSize: 12}} domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} domain={[0, 100]} />
                <Tooltip contentStyle={{backgroundColor: '#FFF', borderColor: '#E5E7EB', fontFamily: 'Inter'}} />
                <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#A41034" strokeWidth={2} name="入住率" />
                <Line yAxisId="right" type="monotone" dataKey="nps" stroke="#3B82F6" strokeWidth={2} name="NPS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
         <h4 className="font-serif font-bold text-gray-800 mb-4">事件日志 (第 {currentState.round} 回合)</h4>
         <div className="space-y-2">
            {currentState.eventLog.length === 0 ? (
                <p className="text-gray-400 text-sm italic">本回合无特殊事件。</p>
            ) : (
                currentState.eventLog.map((evt, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-[#A41034] text-sm text-gray-700">
                        {evt}
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
};