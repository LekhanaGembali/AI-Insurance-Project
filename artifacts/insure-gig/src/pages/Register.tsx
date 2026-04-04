import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight } from "lucide-react";
import { useRegisterWorker } from "@workspace/api-client-react";
import { useAuth } from "../context/AuthContext";

const CITIES = ["Mumbai", "Delhi", "Hyderabad", "Bengaluru", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
const PLATFORMS = ["Zomato", "Swiggy", "Dunzo", "Rapido", "Others"];
const ZONES = ["safe", "moderate", "high_risk"];

export default function Register() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", city: "", platform: "", weeklyIncome: "", zone: "moderate",
  });
  const [error, setError] = useState("");

  const registerMutation = useRegisterWorker({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.role);
        navigate("/dashboard");
      },
      onError: (err: any) => {
        setError(err?.data?.error || "Registration failed. Please try again.");
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.city || !form.platform || !form.weeklyIncome) {
      setError("Please fill in all required fields.");
      return;
    }
    registerMutation.mutate({
      data: {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        city: form.city,
        platform: form.platform,
        weeklyIncome: parseFloat(form.weeklyIncome),
        zone: form.zone || undefined,
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">InSureGig</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-blue-200 text-sm">Start protecting your income today</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul Kumar"
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="9876543210"
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="rahul@example.com"
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                <select
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Platform *</label>
                <select
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Weekly Income (₹) *</label>
                <input
                  type="number"
                  value={form.weeklyIncome}
                  onChange={e => setForm(f => ({ ...f, weeklyIncome: e.target.value }))}
                  placeholder="3500"
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Zone</label>
                <select
                  value={form.zone}
                  onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                  className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="safe">Safe Zone (-₹5/wk)</option>
                  <option value="moderate">Moderate Zone</option>
                  <option value="high_risk">High Risk Zone</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {registerMutation.isPending ? "Creating account..." : (
                <><span>Create account</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
