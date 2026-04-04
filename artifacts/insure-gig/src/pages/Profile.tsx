import { useState, useEffect } from "react";
import { useGetMyProfile, useUpdateMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { WorkerLayout } from "../components/WorkerLayout";
import { User, Edit3, CheckCircle } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";

const CITIES = ["Mumbai", "Delhi", "Hyderabad", "Bengaluru", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
const PLATFORMS = ["Zomato", "Swiggy", "Dunzo", "Rapido", "Others"];

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: worker, isLoading } = useGetMyProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", platform: "", weeklyIncome: "", zone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (worker) {
      setForm({
        name: worker.name,
        phone: worker.phone ?? "",
        city: worker.city,
        platform: worker.platform,
        weeklyIncome: worker.weeklyIncome.toString(),
        zone: worker.zone ?? "moderate",
      });
    }
  }, [worker]);

  const updateMutation = useUpdateMyProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    },
  });

  function handleSave() {
    updateMutation.mutate({
      data: {
        name: form.name,
        phone: form.phone || undefined,
        city: form.city,
        platform: form.platform,
        weeklyIncome: parseFloat(form.weeklyIncome),
        zone: form.zone || undefined,
      },
    });
  }

  if (isLoading) {
    return (
      <WorkerLayout>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account details</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 border border-border bg-card px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors shadow-sm"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6">
          <CheckCircle className="w-4 h-4" /> Profile updated successfully
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {worker?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="font-bold text-lg">{worker?.name}</div>
          <div className="text-muted-foreground text-sm">{worker?.email}</div>
          <div className="mt-3">
            <StatusBadge status={worker?.riskLevel ?? "moderate"} />
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Member since {new Date(worker?.createdAt ?? "").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Profile details */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-5">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-sm font-medium py-2.5">{worker?.name}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-sm font-medium py-2.5">{worker?.phone || "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">City</label>
              {editing ? (
                <select
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <div className="text-sm font-medium py-2.5">{worker?.city}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Platform</label>
              {editing ? (
                <select
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : (
                <div className="text-sm font-medium py-2.5">{worker?.platform}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Weekly Income (₹)</label>
              {editing ? (
                <input
                  type="number"
                  value={form.weeklyIncome}
                  onChange={e => setForm(f => ({ ...f, weeklyIncome: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="text-sm font-medium py-2.5">₹{worker?.weeklyIncome?.toLocaleString()}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Zone</label>
              {editing ? (
                <select
                  value={form.zone}
                  onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="safe">Safe Zone</option>
                  <option value="moderate">Moderate Zone</option>
                  <option value="high_risk">High Risk Zone</option>
                </select>
              ) : (
                <div className="text-sm font-medium py-2.5 capitalize">{worker?.zone?.replace("_", " ") ?? "—"}</div>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-border px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  );
}
