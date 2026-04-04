import { useListActiveDisruptions, useListDisruptions } from "@workspace/api-client-react";
import { WorkerLayout } from "../components/WorkerLayout";
import { AlertCircle, CloudRain, Wind, Thermometer, Lock, CheckCircle } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  rain: { icon: CloudRain, color: "text-blue-600", bg: "bg-blue-50" },
  pollution: { icon: Wind, color: "text-purple-600", bg: "bg-purple-50" },
  heat: { icon: Thermometer, color: "text-red-600", bg: "bg-red-50" },
  curfew: { icon: Lock, color: "text-orange-600", bg: "bg-orange-50" },
};

export default function DisruptionAlerts() {
  const { data: activeDisruptions, isLoading: activeLoading } = useListActiveDisruptions();
  const { data: allDisruptions, isLoading: allLoading } = useListDisruptions();

  return (
    <WorkerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Disruption Alerts</h1>
        <p className="text-muted-foreground mt-1">Live disruption monitoring in your delivery zone</p>
      </div>

      {/* Active alerts */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Active Alerts in Your City
        </h2>

        {activeLoading ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (activeDisruptions ?? []).length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <div className="font-semibold text-green-900 mb-1">All clear</div>
            <div className="text-sm text-green-700">No active disruptions in your city right now</div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDisruptions!.map((disruption) => {
              const config = TYPE_CONFIG[disruption.type] ?? { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-50" };
              const Icon = config.icon;
              return (
                <div key={disruption.id} className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg capitalize">{disruption.type} Alert</span>
                        <StatusBadge status={disruption.severity} />
                      </div>
                      <p className="text-sm text-red-800 mb-3">{disruption.description}</p>
                      {disruption.affectedZones && (
                        <div className="text-xs text-red-600 mb-3">
                          Affected zones: {disruption.affectedZones}
                        </div>
                      )}
                      <div className="bg-white/70 rounded-xl p-4 border border-red-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-red-900 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Auto-claim workflow active
                        </div>
                        <p className="text-xs text-red-700">
                          Your claim has been automatically detected and is being processed. You will receive your payout shortly if you have an active policy.
                        </p>

                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-red-600 mb-1">
                            <span>Auto-claim processing</span>
                            <span>100%</span>
                          </div>
                          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full w-full transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disruption history */}
      <div>
        <h2 className="font-semibold mb-4">Recent Disruption Events</h2>
        {allLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {(allDisruptions ?? []).slice(0, 10).map((disruption, i) => {
              const config = TYPE_CONFIG[disruption.type] ?? { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-50" };
              const Icon = config.icon;
              return (
                <div key={disruption.id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className={`w-9 h-9 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{disruption.type} — {disruption.city}</div>
                    <div className="text-xs text-muted-foreground truncate">{disruption.description}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{new Date(disruption.createdAt).toLocaleDateString("en-IN")}</span>
                    <div className={`w-2 h-2 rounded-full ${disruption.isActive ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                    <StatusBadge status={disruption.severity} />
                  </div>
                </div>
              );
            })}
            {(allDisruptions ?? []).length === 0 && (
              <div className="px-5 py-8 text-center text-muted-foreground text-sm">No disruption events recorded</div>
            )}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
