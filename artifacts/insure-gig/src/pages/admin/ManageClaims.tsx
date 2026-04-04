import { useListAllClaims } from "@workspace/api-client-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { FileText, AlertTriangle } from "lucide-react";

export default function ManageClaims() {
  const { data: claims, isLoading } = useListAllClaims();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Manage Claims</h1>
        <p className="text-muted-foreground mt-1">All auto-generated claims across the platform</p>
      </div>

      {/* Summary */}
      {claims && claims.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold">{claims.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{claims.filter(c => c.status === "approved").length}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-yellow-600">{claims.filter(c => c.status === "pending").length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-primary">
              ₹{claims.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Paid Out</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (claims ?? []).length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No claims yet</h3>
          <p className="text-muted-foreground text-sm">Activate a disruption event to trigger auto-claims</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Worker</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Disruption</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fraud</th>
              </tr>
            </thead>
            <tbody>
              {claims!.map((claim, i) => (
                <tr key={claim.id} className={`${i > 0 ? "border-t border-border" : ""} hover:bg-muted/20`}>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium">{claim.workerName ?? "Worker"}</div>
                    <div className="text-xs text-muted-foreground">{claim.city}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm capitalize">{claim.disruptionType}</div>
                    {claim.transactionId && <div className="text-xs text-muted-foreground font-mono">{claim.transactionId}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold">₹{claim.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={claim.status} /></td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-4">
                    {claim.fraudFlag ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Flagged</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Clear</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
