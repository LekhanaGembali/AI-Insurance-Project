export interface RiskInput {
  city: string;
  planType: string;
  zone?: string | null;
}

export interface RiskOutput {
  city: string;
  planType: string;
  basePremium: number;
  rainAdjustment: number;
  pollutionAdjustment: number;
  heatAdjustment: number;
  safeZoneDiscount: number;
  finalPremium: number;
  riskCategory: string;
  riskFactors: string[];
}

const BASE_PREMIUMS: Record<string, number> = {
  basic: 20,
  standard: 35,
  premium: 63,
};

const CITY_RAIN_RISK: Record<string, number> = {
  mumbai: 8,
  kolkata: 6,
  chennai: 5,
  pune: 3,
  bengaluru: 2,
  hyderabad: 1,
  delhi: 0,
  ahmedabad: 0,
};

const CITY_POLLUTION_RISK: Record<string, number> = {
  delhi: 10,
  ahmedabad: 6,
  kolkata: 5,
  mumbai: 3,
  pune: 2,
  hyderabad: 1,
  chennai: 1,
  bengaluru: 1,
};

const CITY_HEAT_RISK: Record<string, number> = {
  hyderabad: 7,
  ahmedabad: 8,
  delhi: 5,
  chennai: 6,
  kolkata: 3,
  mumbai: 2,
  pune: 1,
  bengaluru: 0,
};

export function calculateRisk(input: RiskInput): RiskOutput {
  const cityKey = input.city.toLowerCase();
  const planKey = input.planType.toLowerCase();
  const basePremium = BASE_PREMIUMS[planKey] ?? 35;

  const rainAdjustment = CITY_RAIN_RISK[cityKey] ?? 2;
  const pollutionAdjustment = CITY_POLLUTION_RISK[cityKey] ?? 2;
  const heatAdjustment = CITY_HEAT_RISK[cityKey] ?? 2;

  const safeZoneDiscount = input.zone?.toLowerCase() === "safe" ? -5 : 0;

  const riskFactors: string[] = [];
  if (rainAdjustment >= 5) riskFactors.push("High rain disruption risk");
  if (pollutionAdjustment >= 5) riskFactors.push("High AQI pollution risk");
  if (heatAdjustment >= 5) riskFactors.push("Extreme heat risk");
  if (safeZoneDiscount < 0) riskFactors.push("Safe zone discount applied");

  const totalRisk = rainAdjustment + pollutionAdjustment + heatAdjustment;
  let riskCategory = "low";
  if (totalRisk >= 15) riskCategory = "extreme";
  else if (totalRisk >= 10) riskCategory = "high";
  else if (totalRisk >= 5) riskCategory = "moderate";

  const finalPremium = Math.max(basePremium + rainAdjustment + pollutionAdjustment + heatAdjustment + safeZoneDiscount, basePremium);

  return {
    city: input.city,
    planType: input.planType,
    basePremium,
    rainAdjustment,
    pollutionAdjustment,
    heatAdjustment,
    safeZoneDiscount,
    finalPremium,
    riskCategory,
    riskFactors,
  };
}

export function cityRiskLevel(city: string): string {
  const cityKey = city.toLowerCase();
  const total = (CITY_RAIN_RISK[cityKey] ?? 2) + (CITY_POLLUTION_RISK[cityKey] ?? 2) + (CITY_HEAT_RISK[cityKey] ?? 2);
  if (total >= 15) return "extreme";
  if (total >= 10) return "high";
  if (total >= 5) return "moderate";
  return "low";
}
