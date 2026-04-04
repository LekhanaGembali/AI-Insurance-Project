import { useListFraudAlerts } from "@workspace/api-client-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function FraudAlerts() {
  const { data: alerts, isLoading } = useListFraudAlerts();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Fraud Alerts</h1>
        <p className="text-muted-foreground mt-1">Flagged claims and suspicious activity</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (alerts ?? []).length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No fraud alerts</h3>
          <p className="text-muted-foreground text-sm">All claims are passing fraud checks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts!.map((alert) => (
            <div key={alert.id} className="bg-card border border-red-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{alert.workerName ?? "Worker"}</span>
                    <StatusBadge status={alert.severity} />
                    {alert.resolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.reason}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">Claim #{alert.claimId}</span>
                    {alert.workerCity && <span className="text-xs text-muted-foreground">{alert.workerCity}</span>}
                    <span className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
