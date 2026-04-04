import { useState } from "react";
import { useListDisruptions, useCreateDisruption, useActivateDisruption, useDeactivateDisruption, getListDisruptionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { Plus, Zap, ZapOff, CloudRain, Wind, Thermometer, Lock } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  rain: { icon: CloudRain, color: "text-blue-600", bg: "bg-blue-50", label: "Heavy Rain" },
  pollution: { icon: Wind, color: "text-purple-600", bg: "bg-purple-50", label: "Air Pollution" },
  heat: { icon: Thermometer, color: "text-red-600", bg: "bg-red-50", label: "Extreme Heat" },
  curfew: { icon: Lock, color: "text-orange-600", bg: "bg-orange-50", label: "Curfew" },
};

export default function ManageDisruptions() {
  const queryClient = useQueryClient();
  const { data: disruptions, isLoading } = useListDisruptions();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "rain", city: "Mumbai", severity: "moderate", description: "", affectedZones: "" });
  const [activating, setActivating] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{ claimsCreated: number; message: string } | null>(null);

  const createMutation = useCreateDisruption({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDisruptionsQueryKey() });
        setShowForm(false);
        setForm({ type: "rain", city: "Mumbai", severity: "moderate", description: "", affectedZones: "" });
      },
    },
  });

  const activateMutation = useActivateDisruption({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListDisruptionsQueryKey() });
        setActivating(null);
        setLastResult({ claimsCreated: data.claimsCreated, message: data.message });
        setTimeout(() => setLastResult(null), 5000);
      },
    },
  });

  const deactivateMutation = useDeactivateDisruption({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDisruptionsQueryKey() });
      },
    },
  });

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Disruptions</h1>
          <p className="text-muted-foreground mt-1">Create and activate disruption events to trigger auto-claims</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Disruption
        </button>
      </div>

      {lastResult && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 text-green-800 text-sm">
          <strong>Auto-claims triggered:</strong> {lastResult.message}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">Create Disruption Event</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Disruption Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="rain">Heavy Rain</option>
                <option value="pollution">Air Pollution</option>
                <option value="heat">Extreme Heat</option>
                <option value="curfew">Curfew</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                {["Mumbai", "Delhi", "Hyderabad", "Bengaluru", "Chennai", "Kolkata", "Pune", "Ahmedabad"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Severity</label>
              <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Affected Zones (optional)</label>
              <input type="text" value={form.affectedZones} onChange={e => setForm(f => ({ ...f, affectedZones: e.target.value }))} placeholder="e.g. Andheri, Bandra, Dharavi" className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Describe the disruption event..." className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => createMutation.mutate({ data: { type: form.type, city: form.city, severity: form.severity, description: form.description, affectedZones: form.affectedZones || undefined } })} disabled={createMutation.isPending || !form.description} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-60">
              {createMutation.isPending ? "Creating..." : "Create Disruption"}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {(disruptions ?? []).map((d) => {
            const config = TYPE_CONFIG[d.type] ?? { icon: Zap, color: "text-gray-600", bg: "bg-gray-50", label: d.type };
            const Icon = config.icon;
            return (
              <div key={d.id} className={`bg-card border rounded-2xl p-5 shadow-sm ${d.isActive ? "border-red-200" : "border-border"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">{config.label} — {d.city}</span>
                      <StatusBadge status={d.severity} />
                      {d.isActive && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium animate-pulse">ACTIVE</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{d.description}</p>
                    {d.affectedZones && <p className="text-xs text-muted-foreground mt-1">Zones: {d.affectedZones}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("en-IN")}</span>
                      <span className="text-xs text-muted-foreground">{d.claimsTriggered} claims triggered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!d.isActive ? (
                      <button
                        onClick={() => { setActivating(d.id); activateMutation.mutate({ disruptionId: d.id }); }}
                        disabled={activateMutation.isPending && activating === d.id}
                        className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {activateMutation.isPending && activating === d.id ? "Triggering..." : "Activate & Trigger Claims"}
                      </button>
                    ) : (
                      <button
                        onClick={() => deactivateMutation.mutate({ disruptionId: d.id })}
                        disabled={deactivateMutation.isPending}
                        className="flex items-center gap-1.5 border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60"
                      >
                        <ZapOff className="w-3.5 h-3.5" /> Deactivate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {(disruptions ?? []).length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
              <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No disruption events</h3>
              <p className="text-muted-foreground text-sm">Create a disruption to trigger auto-claims for workers</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
