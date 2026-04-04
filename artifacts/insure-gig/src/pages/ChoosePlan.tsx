import { useState } from "react";
import { useLocation } from "wouter";
import { useListPlans, useCalculateRisk, useSelectPolicy, getGetActivePolicyQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { WorkerLayout } from "../components/WorkerLayout";
import { useGetMyProfile } from "@workspace/api-client-react";
import { CheckCircle, Shield, ArrowRight, TrendingUp } from "lucide-react";

export default function ChoosePlan() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { data: plans, isLoading: plansLoading } = useListPlans();
  const { data: worker } = useGetMyProfile();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [riskCalc, setRiskCalc] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  const calculateRiskMutation = useCalculateRisk({
    mutation: {
      onSuccess: (data) => setRiskCalc(data),
    },
  });

  const selectPolicyMutation = useSelectPolicy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetActivePolicyQueryKey() });
        navigate("/dashboard");
      },
    },
  });

  function handleSelectPlan(planId: number, planName: string) {
    setSelectedPlanId(planId);
    setRiskCalc(null);
    setConfirming(false);
    if (worker) {
      calculateRiskMutation.mutate({
        data: {
          city: worker.city,
          planType: planName,
          zone: worker.zone ?? undefined,
        },
      });
    }
  }

  function handleConfirm() {
    if (!selectedPlanId) return;
    selectPolicyMutation.mutate({
      data: {
        planId: selectedPlanId,
        finalPremium: riskCalc?.finalPremium ?? undefined,
      },
    });
  }

  if (plansLoading) {
    return (
      <WorkerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-1">Select the coverage that fits your work and risk profile</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans?.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-primary shadow-lg bg-card ring-2 ring-primary"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              }`}
              onClick={() => handleSelectPlan(plan.id, plan.name)}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`p-6 rounded-2xl ${isSelected ? "bg-primary text-white" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-sm font-medium mb-1 ${isSelected ? "text-blue-100" : "text-muted-foreground"}`}>{plan.name}</div>
                    <div className={`text-3xl font-bold ${isSelected ? "text-white" : "text-foreground"}`}>
                      ₹{plan.weeklyPremium}
                      <span className={`text-sm font-normal ${isSelected ? "text-blue-200" : "text-muted-foreground"}`}>/week</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/20" : "bg-primary/10"}`}>
                    <Shield className={`w-6 h-6 ${isSelected ? "text-white" : "text-primary"}`} />
                  </div>
                </div>

                <div className={`text-sm font-semibold mb-4 ${isSelected ? "text-blue-100" : "text-primary"}`}>
                  ₹{plan.coverageAmount.toLocaleString()} weekly coverage
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isSelected ? "text-blue-100" : "text-muted-foreground"}`}>
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-blue-200" : "text-green-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={`text-xs ${isSelected ? "text-blue-200" : "text-muted-foreground"}`}>{plan.description}</div>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-white font-medium text-sm">
                    <CheckCircle className="w-4 h-4" /> Selected
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk calculation */}
      {selectedPlanId && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Risk-adjusted Premium for {worker?.city}</h2>
          </div>

          {calculateRiskMutation.isPending ? (
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Calculating your premium...
            </div>
          ) : riskCalc ? (
            <div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Premium</span>
                    <span className="font-medium">₹{riskCalc.basePremium}</span>
                  </div>
                  {riskCalc.rainAdjustment > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rain Risk (+)</span>
                      <span className="font-medium text-orange-600">+₹{riskCalc.rainAdjustment}</span>
                    </div>
                  )}
                  {riskCalc.pollutionAdjustment > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pollution Risk (+)</span>
                      <span className="font-medium text-orange-600">+₹{riskCalc.pollutionAdjustment}</span>
                    </div>
                  )}
                  {riskCalc.heatAdjustment > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Heat Risk (+)</span>
                      <span className="font-medium text-orange-600">+₹{riskCalc.heatAdjustment}</span>
                    </div>
                  )}
                  {riskCalc.safeZoneDiscount < 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Safe Zone Discount</span>
                      <span className="font-medium text-green-600">-₹{Math.abs(riskCalc.safeZoneDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                    <span>Final Weekly Premium</span>
                    <span className="text-primary">₹{riskCalc.finalPremium}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Risk Category</div>
                  <div className="text-lg font-bold capitalize mb-2">{riskCalc.riskCategory}</div>
                  {riskCalc.riskFactors.length > 0 && (
                    <div className="space-y-1">
                      {riskCalc.riskFactors.map((f: string) => (
                        <div key={f} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-orange-500 mt-0.5">•</span> {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={selectPolicyMutation.isPending}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {selectPolicyMutation.isPending ? "Activating..." : (
                  <>Activate Policy at ₹{riskCalc.finalPremium}/week <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </WorkerLayout>
  );
}
