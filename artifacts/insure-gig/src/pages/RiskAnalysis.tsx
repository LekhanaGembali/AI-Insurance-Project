import { useState } from "react";
import { useCalculateRisk } from "@workspace/api-client-react";
import { useGetMyProfile } from "@workspace/api-client-react";
import { WorkerLayout } from "../components/WorkerLayout";
import { TrendingUp, CloudRain, Wind, Thermometer, MapPin } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

export default function RiskAnalysis() {
  const { data: worker } = useGetMyProfile();
  const [planType, setPlanType] = useState("standard");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("moderate");

  const calculateRiskMutation = useCalculateRisk();

  const targetCity = city || worker?.city || "Mumbai";

  function handleCalculate() {
    calculateRiskMutation.mutate({
      data: { city: targetCity, planType, zone },
    });
  }

  const result = calculateRiskMutation.data;

  return (
    <WorkerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Risk Analysis</h1>
        <p className="text-muted-foreground mt-1">See how your city and zone affect your premium</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-5">Premium Calculator</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <select
                value={city || worker?.city || ""}
                onChange={e => setCity(e.target.value)}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {["Mumbai", "Delhi", "Hyderabad", "Bengaluru", "Chennai", "Kolkata", "Pune", "Ahmedabad"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Plan Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["basic", "standard", "premium"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlanType(p)}
                    className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                      planType === p ? "bg-primary text-white" : "border border-border hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Zone</label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="safe">Safe Zone (-₹5/wk discount)</option>
                <option value="moderate">Moderate Zone</option>
                <option value="high_risk">High Risk Zone</option>
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={calculateRiskMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {calculateRiskMutation.isPending ? "Calculating..." : "Calculate Premium"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl p-6 text-white shadow-md">
              <div className="text-blue-200 text-sm mb-1">Final Weekly Premium</div>
              <div className="text-5xl font-black mb-2">₹{result.finalPremium}</div>
              <div className="flex items-center gap-2">
                <span className="text-blue-200 text-sm">Risk Category:</span>
                <span className="capitalize font-medium">{result.riskCategory}</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Premium Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Base Premium
                  </div>
                  <span className="font-medium">₹{result.basePremium}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Rain Risk Adjustment
                  </div>
                  <span className={`font-medium ${result.rainAdjustment > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                    +₹{result.rainAdjustment}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Wind className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    Pollution (AQI) Adjustment
                  </div>
                  <span className={`font-medium ${result.pollutionAdjustment > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                    +₹{result.pollutionAdjustment}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    Heat Risk Adjustment
                  </div>
                  <span className={`font-medium ${result.heatAdjustment > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                    +₹{result.heatAdjustment}
                  </span>
                </div>

                {result.safeZoneDiscount < 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      Safe Zone Discount
                    </div>
                    <span className="font-medium text-green-600">-₹{Math.abs(result.safeZoneDiscount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-border pt-3 font-bold">
                  <span>Final Weekly Premium</span>
                  <span className="text-primary text-lg">₹{result.finalPremium}</span>
                </div>
              </div>
            </div>

            {result.riskFactors.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <div className="font-medium text-orange-900 mb-2 text-sm">Risk Factors Detected</div>
                {result.riskFactors.map((f: string) => (
                  <div key={f} className="text-sm text-orange-700 flex items-start gap-2">
                    <span className="mt-0.5">•</span> {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-64">
            <TrendingUp className="w-10 h-10 text-primary/30 mb-3" />
            <p className="text-muted-foreground text-sm">Configure your city and plan, then calculate your risk-adjusted premium</p>
          </div>
        )}
      </div>

      {/* City comparison */}
      <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">City Risk Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { city: "Mumbai", risk: "High", reason: "Monsoon rain risk", color: "text-orange-600", bg: "bg-orange-50" },
            { city: "Delhi", risk: "High", reason: "Severe AQI pollution", color: "text-red-600", bg: "bg-red-50" },
            { city: "Hyderabad", risk: "High", reason: "Extreme heat risk", color: "text-orange-600", bg: "bg-orange-50" },
            { city: "Bengaluru", risk: "Low", reason: "Mild climate", color: "text-green-600", bg: "bg-green-50" },
          ].map(({ city, risk, reason, color, bg }) => (
            <div key={city} className={`rounded-xl p-4 ${bg}`}>
              <div className="font-semibold text-sm mb-1">{city}</div>
              <div className={`text-xs font-bold ${color} mb-1`}>{risk} Risk</div>
              <div className="text-xs text-muted-foreground">{reason}</div>
            </div>
          ))}
        </div>
      </div>
    </WorkerLayout>
  );
}
