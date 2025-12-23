export interface DecisionPacket {
  pricePerMonth: number;
  prepayMonths: number;
  marketingSpend: number; // In CNY
  staffRatio: number; // Staff per 10 beds
  wageIndex: number; // 1.0 is market avg
}

export interface SimulationLogEntry {
  category: 'Macro' | 'Micro' | 'Ops' | 'Finance' | 'Event';
  message: string;
  details?: string;
  timestamp: string;
}

export interface RoundState {
  round: number;
  cash: number;
  occupancy: number; // 0.0 to 1.0
  nps: number; // Net Promoter Score -100 to 100
  ebitda: number;
  reputation: number; // 0.0 to 1.0
  marketShare: number; // 0.0 to 1.0
  burnoutIndex: number; // 0.0 to 1.0
  isBankrupt: boolean;
  regulatoryFlags: string[];
  eventLog: string[];
  lastLogs: SimulationLogEntry[];
}

export interface ScenarioEvent {
  title: string;
  description: string;
  impactType: 'Policy' | 'Market' | 'Ops' | 'Finance';
}

export const SCENARIO_EVENTS: Record<number, ScenarioEvent> = {
  0: { title: "基线确立", description: "医保控费基调确立，市场观望情绪浓厚。", impactType: "Policy" },
  1: { title: "长护险(LTCI)窗口期", description: "政策红利释放，入住率激增，但由于封顶结算，毛利被摊薄。", impactType: "Market" },
  2: { title: "人力崩塌", description: "竞争对手高薪挖角，SimPy模拟显示服务抢占频发，护理员流失率飙升。", impactType: "Ops" },
  3: { title: "市场平稳期", description: "市场进入短暂的平静调整期。", impactType: "Market" },
  4: { title: "医保飞行检查(Audit)", description: "严格的医保审计开始，拒付率上升，现金流承压。", impactType: "Finance" },
  5: { title: "流感季爆发", description: "季节性健康风险导致运营成本增加。", impactType: "Ops" },
  6: { title: "半年报压力", description: "股东对财务回报要求提高。", impactType: "Finance" },
  7: { title: "竞争加剧", description: "新的高端竞品项目入市。", impactType: "Market" },
  8: { title: "流动性挤压(Liquidity Squeeze)", description: "医保回款延迟叠加长护险结算滞后，熔断高发期。", impactType: "Finance" },
  9: { title: "重阳节营销", description: "品牌宣传的关键节点。", impactType: "Market" },
  10: { title: "冬季供暖合规", description: "设施设备维护成本上升。", impactType: "Ops" },
  11: { title: "最终审计与REITs评分", description: "决定最终资产估值与退出资格。", impactType: "Finance" },
};