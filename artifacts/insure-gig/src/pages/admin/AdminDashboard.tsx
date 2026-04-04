import { useGetAdminDashboard } from "@workspace/api-client-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { Users, Shield, FileText, DollarSign, AlertTriangle, Zap } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const metrics = [
    { label: "Total Workers", value: data?.totalWorkers ?? 0, sub: `${data?.activeWorkers ?? 0} active`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Policies", value: data?.activePolicies ?? 0, sub: "Currently covered", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Claims", value: data?.totalClaims ?? 0, sub: `${data?.pendingClaims ?? 0} pending`, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Payouts", value: `₹${(data?.totalPayouts ?? 0).toLocaleString()}`, sub: `${data?.approvedClaims ?? 0} approved`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Fraud Alerts", value: data?.fraudAlerts ?? 0, sub: "Flagged claims", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Active Disruptions", value: data?.activeDisruptions ?? 0, sub: "Live events", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and analytics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${m.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div className="text-sm text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent claims */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border font-semibold">Recent Claims</div>
          {(data?.recentClaims ?? []).length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No claims yet</div>
          ) : (
            <div>
              {data!.recentClaims.slice(0, 8).map((claim, i) => (
                <div key={claim.id} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{claim.disruptionType} — {claim.city}</div>
                    <div className="text-xs text-muted-foreground">{claim.workerName ?? "Worker"}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold">₹{claim.amount.toLocaleString()}</span>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City breakdown */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border font-semibold">City Breakdown</div>
          {(data?.cityBreakdown ?? []).length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <div>
              {data!.cityBreakdown.map((city, i) => (
                <div key={city.city} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{city.city}</div>
                    <div className="text-xs text-muted-foreground">{city.workers} workers · {city.claims} claims</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">₹{city.payouts.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claims breakdown */}
      <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Claims Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{data?.approvedClaims ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Approved</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">{data?.pendingClaims ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">{data?.rejectedClaims ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Rejected</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
