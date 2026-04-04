import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";
import { useLoginAdmin } from "@workspace/api-client-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const loginMutation = useLoginAdmin({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.role);
        navigate("/admin/dashboard");
      },
      onError: () => {
        setError("Invalid admin credentials.");
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { email: form.email, password: form.password } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">InSureGig</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Admin Console</h1>
          <p className="text-gray-300 text-sm">Restricted access</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Admin Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@insuregig.com"
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Admin password"
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gray-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 mt-2"
            >
              {loginMutation.isPending ? "Signing in..." : "Access Admin Console"}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <strong>Demo admin:</strong> admin@insuregig.com / admin123
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/login" className="hover:underline">Worker login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
