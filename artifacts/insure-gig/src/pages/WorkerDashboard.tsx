import { Link } from "wouter";
import { useGetWorkerDashboard } from "@workspace/api-client-react";
import { WorkerLayout } from "../components/WorkerLayout";
import { StatusBadge } from "../components/StatusBadge";
import { Shield, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function WorkerDashboard() {
  const { data, isLoading } = useGetWorkerDashboard();

  if (isLoading) {
    return (
      <WorkerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </WorkerLayout>
    );
  }

  const worker = data?.worker;
  const activePolicy = data?.activePolicy;

  return (
    <WorkerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Good morning, {worker?.name?.split(" ")[0] ?? "Worker"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {worker?.platform} driver · {worker?.city} · Risk: <span className="font-medium capitalize">{worker?.riskLevel}</span>
        </p>
      </div>

      {/* Active disruption alert */}
      {(data?.activeDisruptions ?? []).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-red-900 mb-1">Active disruption in {worker?.city}</div>
            {data!.activeDisruptions.map((d) => (
              <div key={d.id} className="text-sm text-red-700 capitalize">
                {d.type} — {d.severity} severity: {d.description}
              </div>
            ))}
          </div>
          <Link href="/disruptions" className="text-xs text-red-600 font-medium hover:underline whitespace-nowrap">View details</Link>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground mb-2">Active Plan</div>
          <div className="text-xl font-bold">{activePolicy?.planName ?? "—"}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {activePolicy ? `₹${activePolicy.weeklyPremium}/week` : "No active plan"}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground mb-2">Coverage</div>
          <div className="text-xl font-bold">
            {activePolicy ? `₹${activePolicy.coverageAmount.toLocaleString()}` : "₹0"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Weekly protection</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground mb-2">Total Paid Out</div>
          <div className="text-xl font-bold text-green-600">
            ₹{(data?.totalPaidOut ?? 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Lifetime earnings protected</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground mb-2">Claims</div>
          <div className="text-xl font-bold">{data?.claimsCount ?? 0}</div>
          <div className="text-xs text-green-600 mt-1">{data?.approvedClaimsCount ?? 0} approved</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active policy card */}
        <div className="lg:col-span-2">
          {activePolicy ? (
            <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl p-6 text-white shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-blue-200 text-sm mb-1">Active Policy</div>
                  <div className="text-2xl font-bold">{activePolicy.planName} Plan</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-blue-200 text-xs mb-1">Weekly Premium</div>
                  <div className="font-bold text-lg">₹{activePolicy.weeklyPremium}</div>
                </div>
                <div>
                  <div className="text-blue-200 text-xs mb-1">Coverage</div>
                  <div className="font-bold text-lg">₹{activePolicy.coverageAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-blue-200 text-xs mb-1">Paid Out</div>
                  <div className="font-bold text-lg text-green-300">₹{activePolicy.totalPaidOut.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-blue-200">
                Active since {new Date(activePolicy.startDate).toLocaleDateString("en-IN")}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No active policy</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Protect your income from disruptions starting at ₹20/week
              </p>
              <Link href="/plans" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors">
                Choose a plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Risk level */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Your Risk Profile</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black capitalize text-foreground mb-2">{data?.riskLevel}</div>
            <StatusBadge status={data?.riskLevel ?? "moderate"} />
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">City: {worker?.city}</div>
            <div className="text-xs text-muted-foreground">Zone: {worker?.zone ?? "Not set"}</div>
          </div>
          <Link href="/risk" className="mt-4 flex items-center gap-2 text-xs text-primary font-medium hover:underline">
            View risk analysis <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent claims */}
      {(data?.recentClaims ?? []).length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Claims</h2>
            <Link href="/claims" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {data!.recentClaims.map((claim, i) => (
              <Link href={`/claims/${claim.id}`} key={claim.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium capitalize">{claim.disruptionType} disruption</div>
                  <div className="text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">₹{claim.amount.toLocaleString()}</div>
                  <StatusBadge status={claim.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activePolicy && (
        <div className="mt-6 flex gap-3">
          <Link href="/plans" className="flex items-center gap-2 border border-border bg-card text-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors shadow-sm">
            <Shield className="w-4 h-4" /> Upgrade Plan
          </Link>
          <Link href="/disruptions" className="flex items-center gap-2 border border-border bg-card text-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors shadow-sm">
            <AlertCircle className="w-4 h-4" /> Check Alerts
          </Link>
        </div>
      )}
    </WorkerLayout>
  );
}
