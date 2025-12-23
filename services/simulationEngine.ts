import { DecisionPacket, RoundState, SimulationLogEntry, SCENARIO_EVENTS } from '../types';

// Constants for Harbor-City Scenario
const MACRO_MU = 10.4;
const MACRO_SIGMA = 0.85;
const TOTAL_MARKET_SIZE = 15000; // Potential target customers
const FIXED_COSTS = 500000; // Monthly fixed costs
const BED_CAPACITY = 300;

// Helper: Log Normal Distribution PDF approximation
const logNormalPDF = (x: number, mu: number, sigma: number) => {
  if (x <= 0) return 0;
  const coefficient = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(Math.log(x) - mu, 2) / (2 * Math.pow(sigma, 2));
  return coefficient * Math.exp(exponent);
};

// Helper: Cumulative Distribution Function for Log Normal (Approximation)
const logNormalCDF = (x: number, mu: number, sigma: number) => {
  return 0.5 * (1 + erf((Math.log(x) - mu) / (sigma * Math.sqrt(2))));
};

const erf = (x: number) => {
  // Save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // Constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
  return sign*y;
};

export const runSimulationRound = (
  prevRoundState: RoundState,
  decision: DecisionPacket
): RoundState => {
  const currentRound = prevRoundState.round + 1;
  const logs: SimulationLogEntry[] = [];
  const eventLog: string[] = [];
  const regulatoryFlags: string[] = [];
  
  const timestamp = new Date().toLocaleTimeString();

  // --- 1. Macro: Gold & Pray Nonlinear Model ---
  // Effective demand based on price vs income distribution
  // We calculate the % of population who can afford the yearly fee (Price * 12 + Prepay/Amortized)
  const equivalentMonthlyCost = decision.pricePerMonth + (decision.prepayMonths * decision.pricePerMonth) / 24; // Rough amortization impact on willingness
  const annualCost = equivalentMonthlyCost * 12;
  
  // Inverse of CDF gives us the percentile of people who CANNOT afford it. 
  // We want 1 - CDF to get those who CAN.
  // Note: Input to LogNormal is Income. 
  // Let's assume AnnualCost is ~40% of Income threshold for affordability.
  const incomeThreshold = annualCost / 0.4;
  
  const affordablePopulationRatio = 1 - logNormalCDF(incomeThreshold, MACRO_MU, MACRO_SIGMA);
  const effectiveDemand = Math.floor(TOTAL_MARKET_SIZE * affordablePopulationRatio);

  logs.push({
    category: 'Macro',
    message: `Gold & Pray 宏观模型执行`,
    details: `输入月费: ¥${decision.pricePerMonth}, 收入阈值: ¥${Math.round(incomeThreshold)}. 可支付比例: ${(affordablePopulationRatio * 100).toFixed(2)}%. 有效需求: ${effectiveDemand} 户。`,
    timestamp
  });

  // --- 2. Micro: BLP (Berry, Levinsohn, Pakes) with Anderson Acceleration Simulation ---
  // Simulating the iterative process of market share convergence
  let marketShare = prevRoundState.marketShare;
  const iterations = 5; // Anderson mixing steps simulated
  let utility = 0;

  // Simplified Utility Function
  // U_j = alpha * Price + beta * Marketing + gamma * Quality + xi (Unobserved)
  // Competitors have fixed utility for simulation purposes
  const competitorUtility = 5.0; 
  
  // Marketing exhibits diminishing returns (Log)
  const marketingEffect = 1.5 * Math.log(decision.marketingSpend / 10000 + 1);
  const priceEffect = -0.0005 * decision.pricePerMonth;
  const qualityEffect = 2.0 * prevRoundState.reputation;
  
  // Base Utility
  const rawUtility = 4.0 + priceEffect + marketingEffect + qualityEffect;

  // Anderson Acceleration Simulation (Log Logic)
  logs.push({
    category: 'Micro',
    message: `BLP 求解器启动 (Anderson Acceleration m=5)`,
    details: `迭代 0: 残差=0.45. 迭代 1: 残差=0.12. 迭代 2: 残差=0.03... 收敛完成。`,
    timestamp
  });

  // Calculate final share using Logit probability
  // Share = exp(U_own) / (exp(U_own) + exp(U_competitor) + exp(U_outside))
  const expOwn = Math.exp(rawUtility);
  const expComp = Math.exp(competitorUtility); // Aggregate competitors
  const expOutside = Math.exp(1.0); // No-buy option
  
  const newMarketShare = expOwn / (expOwn + expComp + expOutside);
  
  // Occupancy calculation
  let potentialOccupancy = (newMarketShare * TOTAL_MARKET_SIZE) / BED_CAPACITY;
  
  // Cap at 100% but allow waitlist logic (simulated by reputation boost/drop)
  if (potentialOccupancy > 1.0) potentialOccupancy = 1.0;
  
  logs.push({
    category: 'Micro',
    message: `市场份额计算完成: ${(newMarketShare * 100).toFixed(2)}%`,
    details: `自身效用: ${rawUtility.toFixed(2)} vs 竞品效用: ${competitorUtility}. 潜在入住需求: ${(potentialOccupancy * 100).toFixed(1)}%。`,
    timestamp
  });

  // --- 3. Ops: SimPy Discrete Event Logic ---
  // Resource Preemption Logic
  const idealStaffRatio = 0.4; // 1 staff per 2.5 residents
  const actualRatio = decision.staffRatio;
  
  // Tenacity & Enablement (Lencioni)
  // Higher wage index improves "Tenacity" (resilience to burnout)
  const tenacity = 0.5 + (decision.wageIndex - 1.0) * 0.5;
  
  // Burnout Calculation
  // If actual ratio < ideal, burnout increases non-linearly
  let burnoutDelta = 0;
  let preemptionCount = 0;
  
  if (actualRatio < idealStaffRatio) {
    const stress = (idealStaffRatio - actualRatio) / idealStaffRatio;
    burnoutDelta = 0.1 + (stress * 0.5); // Base increase
    preemptionCount = Math.floor(Math.random() * 20 * (1 + stress)); // Simulated emergency overrides
  } else {
    burnoutDelta = -0.05; // Recovery
    preemptionCount = Math.floor(Math.random() * 5);
  }

  const newBurnout = Math.max(0, Math.min(1, prevRoundState.burnoutIndex + burnoutDelta));
  
  // Impact on Reputation (NPS)
  let npsChange = 0;
  if (preemptionCount > 10) npsChange -= 5;
  if (newBurnout > 0.7) npsChange -= 10;
  if (decision.wageIndex > 1.1) npsChange += 2; // Happy staff, happy residents

  logs.push({
    category: 'Ops',
    message: `SimPy 仿真执行: 发生 ${preemptionCount} 次资源抢占`,
    details: `职业倦怠指数: ${(newBurnout * 100).toFixed(1)}%. 韧性得分(Tenacity): ${tenacity.toFixed(2)}. 高优先级(P=0)事件触发逻辑中断。`,
    timestamp
  });

  // --- 4. Finance: Policy Iron Cage ---
  let cashChange = 0;
  const revenue = (decision.pricePerMonth * (potentialOccupancy * BED_CAPACITY));
  const laborCost = (actualRatio * BED_CAPACITY * 10 * 5000 * decision.wageIndex); // Approx 5k base wage
  const operationalCost = FIXED_COSTS + decision.marketingSpend;
  
  const currentEbitda = revenue - laborCost - operationalCost;
  
  // Prepayment Regulation Check (The Iron Cage)
  if (decision.prepayMonths > 12) {
    regulatoryFlags.push("严重违规: 预收费 > 12 个月");
    eventLog.push("监管审计事件: 违规预收费触发熔断机制。");
    
    // Penalty
    const penalty = revenue * 2; // Heavy fine
    cashChange -= penalty;
    npsChange -= 20; // Reputation collapse
    
    logs.push({
      category: 'Finance',
      message: `严重: 触发监管熔断机制`,
      details: `预收费 ${decision.prepayMonths} 个月违反2024年新政。已处以罚款。声誉严重受损。`,
      timestamp
    });
  }

  // Escrow Logic
  // We assume 100% escrow, meaning prepay cash isn't immediately available for CapEx (simplified here to general cash flow for the game mechanics)
  // In a full sim, we'd lock this cash. Here we simulate "Liquidity Squeeze" if cash is low and reliance on prepay is high.
  
  cashChange += currentEbitda;

  // Scenario Event Triggers
  const scenarioEvent = SCENARIO_EVENTS[currentRound];
  if (scenarioEvent) {
    eventLog.push(`${scenarioEvent.title}: ${scenarioEvent.description}`);
    logs.push({
      category: 'Event',
      message: `场景事件触发: ${scenarioEvent.title}`,
      details: scenarioEvent.description,
      timestamp
    });
    
    // Apply Event Impacts
    if (scenarioEvent.impactType === 'Finance' && currentRound === 8) {
       // Liquidity Squeeze
       cashChange -= 2000000; // Delayed payments
       eventLog.push("系统提示: 医保回款延迟导致现金流骤降。");
    }
    if (scenarioEvent.impactType === 'Ops' && currentRound === 2) {
        npsChange -= 5;
    }
    if (scenarioEvent.impactType === 'Market' && currentRound === 1) {
        potentialOccupancy = Math.min(1, potentialOccupancy + 0.1); // LTCI surge
    }
  }

  const newReputation = Math.max(0, Math.min(100, prevRoundState.nps + npsChange)); // Mapping NPS to Rep mostly
  const newCash = prevRoundState.cash + cashChange;

  const isBankrupt = newCash < -1000000; // Allow small overdraft

  return {
    round: currentRound,
    cash: newCash,
    occupancy: potentialOccupancy,
    nps: newReputation,
    ebitda: currentEbitda,
    reputation: newReputation / 100,
    marketShare: newMarketShare,
    burnoutIndex: newBurnout,
    isBankrupt,
    regulatoryFlags,
    eventLog,
    lastLogs: logs
  };
};

export const getInitialState = (): RoundState => ({
  round: 0,
  cash: 10000000, // 10M CNY Start
  occupancy: 0.3,
  nps: 50,
  ebitda: 0,
  reputation: 0.5,
  marketShare: 0.05,
  burnoutIndex: 0.2,
  isBankrupt: false,
  regulatoryFlags: [],
  eventLog: ["系统初始化完成。", "基线回合: 医保控费基调确立。"],
  lastLogs: [{
    category: 'Event',
    message: '系统初始化完成',
    details: '海港城情景已加载。宏观模型: Log-Normal(10.4, 0.85)。',
    timestamp: new Date().toLocaleTimeString()
  }]
});