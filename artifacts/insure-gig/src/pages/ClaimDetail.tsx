import { useRoute } from "wouter";
import { useGetClaim } from "@workspace/api-client-react";
import { WorkerLayout } from "../components/WorkerLayout";
import { StatusBadge } from "../components/StatusBadge";
import { CheckCircle, ArrowLeft, FileText, Shield } from "lucide-react";
import { Link } from "wouter";

export default function ClaimDetail() {
  const [, params] = useRoute("/claims/:id");
  const claimId = parseInt(params?.id ?? "0");
  const { data: claim, isLoading } = useGetClaim(claimId, { query: { enabled: !!claimId } });

  if (isLoading) {
    return (
      <WorkerLayout>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </WorkerLayout>
    );
  }

  if (!claim) {
    return (
      <WorkerLayout>
        <div className="text-center py-16 text-muted-foreground">Claim not found</div>
      </WorkerLayout>
    );
  }

  const isApproved = claim.status === "approved";

  return (
    <WorkerLayout>
      <div className="mb-6">
        <Link href="/claims" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Claims
        </Link>
      </div>

      {isApproved && (
        <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-8 text-white text-center mb-8 shadow-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Payout Successful</h1>
          <div className="text-5xl font-black mb-3">₹{claim.amount.toLocaleString()}</div>
          <p className="text-green-100 text-sm">Credited to your registered account</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claim details */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold">Claim Details</h2>
              <div className="text-xs text-muted-foreground">Claim #{claim.id}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={claim.status} />
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Disruption Type</span>
              <span className="text-sm font-medium capitalize">{claim.disruptionType}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">City</span>
              <span className="text-sm font-medium">{claim.city}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Payout Amount</span>
              <span className="text-sm font-bold text-green-600">₹{claim.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-start border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm text-right max-w-xs">{claim.description}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Claim Date</span>
              <span className="text-sm font-medium">{new Date(claim.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Transaction details */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold">Transaction Details</h2>
              <div className="text-xs text-muted-foreground">Payment information</div>
            </div>
          </div>

          {claim.transactionId ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="text-sm font-mono font-medium text-primary">{claim.transactionId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Amount Credited</span>
                <span className="text-sm font-bold text-green-600">₹{claim.amount.toLocaleString()}</span>
              </div>
              {claim.processedAt && (
                <>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium">{new Date(claim.processedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="text-sm font-medium">{new Date(claim.processedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="text-sm font-medium">Auto-payout (Direct Credit)</span>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Payout successful
                </div>
                <p className="text-xs text-green-700 mt-1">
                  This claim was auto-triggered and approved by InSureGig's zero-touch claim engine.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-sm">No transaction details yet</div>
              <div className="text-xs mt-1">Status: <StatusBadge status={claim.status} /></div>
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  );
}
