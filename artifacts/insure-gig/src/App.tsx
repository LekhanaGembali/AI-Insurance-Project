import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// Pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import WorkerDashboard from "./pages/WorkerDashboard";
import ChoosePlan from "./pages/ChoosePlan";
import RiskAnalysis from "./pages/RiskAnalysis";
import DisruptionAlerts from "./pages/DisruptionAlerts";
import ClaimHistory from "./pages/ClaimHistory";
import ClaimDetail from "./pages/ClaimDetail";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageWorkers from "./pages/admin/ManageWorkers";
import ManageDisruptions from "./pages/admin/ManageDisruptions";
import ManageClaims from "./pages/admin/ManageClaims";
import FraudAlerts from "./pages/admin/FraudAlerts";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Landing} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/admin/login" component={AdminLogin} />

      {/* Worker routes */}
      <Route path="/dashboard">
        <RequireAuth><WorkerDashboard /></RequireAuth>
      </Route>
      <Route path="/plans">
        <RequireAuth><ChoosePlan /></RequireAuth>
      </Route>
      <Route path="/risk">
        <RequireAuth><RiskAnalysis /></RequireAuth>
      </Route>
      <Route path="/disruptions">
        <RequireAuth><DisruptionAlerts /></RequireAuth>
      </Route>
      <Route path="/claims">
        <RequireAuth><ClaimHistory /></RequireAuth>
      </Route>
      <Route path="/claims/:id">
        <RequireAuth><ClaimDetail /></RequireAuth>
      </Route>
      <Route path="/profile">
        <RequireAuth><Profile /></RequireAuth>
      </Route>

      {/* Admin routes */}
      <Route path="/admin/dashboard">
        <RequireAdmin><AdminDashboard /></RequireAdmin>
      </Route>
      <Route path="/admin/workers">
        <RequireAdmin><ManageWorkers /></RequireAdmin>
      </Route>
      <Route path="/admin/disruptions">
        <RequireAdmin><ManageDisruptions /></RequireAdmin>
      </Route>
      <Route path="/admin/claims">
        <RequireAdmin><ManageClaims /></RequireAdmin>
      </Route>
      <Route path="/admin/fraud">
        <RequireAdmin><FraudAlerts /></RequireAdmin>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
