import { Link } from "wouter";
import { useGetMyClaims } from "@workspace/api-client-react";
import { WorkerLayout } from "../components/WorkerLayout";
import { StatusBadge } from "../components/StatusBadge";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";

export default function ClaimHistory() {
  const { data: claims, isLoading } = useGetMyClaims();

  return (
    <WorkerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Claims History</h1>
        <p className="text-muted-foreground mt-1">All your auto-generated claims and payouts</p>
      </div>

      {/* Summary */}
      {claims && claims.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold">{claims.length}</div>
            <div className="text-xs text-muted-foreground">Total Claims</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{claims.filter(c => c.status === "approved").length}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-primary">
              ₹{claims.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Paid Out</div>
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
          <p className="text-muted-foreground text-sm">
            When a disruption triggers an auto-claim, it will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {claims!.map((claim, i) => (
            <Link href={`/claims/${claim.id}`} key={claim.id} className={`flex items-center gap-4 px-6 py-5 hover:bg-muted/30 transition-colors cursor-pointer ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold capitalize mb-0.5">
                    {claim.disruptionType} Disruption — {claim.city}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{claim.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(claim.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {claim.transactionId && <span className="ml-2 text-green-600">TXN: {claim.transactionId}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-base font-bold">₹{claim.amount.toLocaleString()}</div>
                    {claim.planName && <div className="text-xs text-muted-foreground">{claim.planName}</div>}
                  </div>
                  <StatusBadge status={claim.status} />
                  {claim.fraudFlag && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Flagged</span>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
            </Link>
          ))}
        </div>
      )}
    </WorkerLayout>
  );
}
