import { useState } from "react";
import { useListWorkers } from "@workspace/api-client-react";
import { AdminLayout } from "../../components/AdminLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { Search, Users } from "lucide-react";

export default function ManageWorkers() {
  const { data: workers, isLoading } = useListWorkers();
  const [search, setSearch] = useState("");

  const filtered = (workers ?? []).filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.city.toLowerCase().includes(search.toLowerCase()) ||
    w.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Workers</h1>
          <p className="text-muted-foreground mt-1">{(workers ?? []).length} registered delivery workers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary w-60"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No workers found</h3>
          <p className="text-muted-foreground text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Worker</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">City</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Platform</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Weekly Income</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Level</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((worker, i) => (
                <tr key={worker.id} className={`${i > 0 ? "border-t border-border" : ""} hover:bg-muted/20`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {worker.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{worker.name}</div>
                        <div className="text-xs text-muted-foreground">{worker.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{worker.city}</td>
                  <td className="px-5 py-4 text-sm">{worker.platform}</td>
                  <td className="px-5 py-4 text-sm font-medium">₹{worker.weeklyIncome.toLocaleString()}</td>
                  <td className="px-5 py-4"><StatusBadge status={worker.riskLevel} /></td>
                  <td className="px-5 py-4"><StatusBadge status={worker.isActive ? "active" : "inactive"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
