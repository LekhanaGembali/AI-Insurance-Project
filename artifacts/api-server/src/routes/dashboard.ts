import { Router, type IRouter } from "express";
import { db, workersTable, policiesTable, claimsTable, disruptionsTable, fraudAlertsTable } from "@workspace/db";
import { eq, and, count, sum } from "drizzle-orm";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/dashboard/worker", authMiddleware, async (req, res): Promise<void> => {
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, req.worker!.id));
  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }
  const { passwordHash: _, ...safeWorker } = worker;

  const [activePolicy] = await db.select().from(policiesTable)
    .where(and(eq(policiesTable.workerId, worker.id), eq(policiesTable.status, "active")))
    .limit(1);

  const allClaims = await db.select().from(claimsTable).where(eq(claimsTable.workerId, worker.id));
  const approvedClaims = allClaims.filter(c => c.status === "approved");
  const totalPaidOut = approvedClaims.reduce((sum, c) => sum + c.amount, 0);

  const recentClaims = allClaims.slice(-5).reverse().map(c => ({
    ...c,
    workerName: worker.name,
    planName: null,
  }));

  const activeDisruptions = await db.select().from(disruptionsTable)
    .where(and(eq(disruptionsTable.isActive, true), eq(disruptionsTable.city, worker.city)));

  res.json({
    worker: safeWorker,
    activePolicy: activePolicy ? { ...activePolicy, workerName: safeWorker.name, workerCity: safeWorker.city } : undefined,
    recentClaims,
    totalPaidOut,
    activeDisruptions,
    riskLevel: worker.riskLevel,
    claimsCount: allClaims.length,
    approvedClaimsCount: approvedClaims.length,
  });
});

router.get("/dashboard/admin", adminMiddleware, async (_req, res): Promise<void> => {
  const allWorkers = await db.select().from(workersTable).where(eq(workersTable.role, "worker"));
  const activeWorkers = allWorkers.filter(w => w.isActive);

  const allPolicies = await db.select().from(policiesTable);
  const activePolicies = allPolicies.filter(p => p.status === "active");

  const allClaims = await db.select().from(claimsTable);
  const pendingClaims = allClaims.filter(c => c.status === "pending" || c.status === "processing");
  const approvedClaims = allClaims.filter(c => c.status === "approved");
  const rejectedClaims = allClaims.filter(c => c.status === "rejected");
  const totalPayouts = approvedClaims.reduce((sum, c) => sum + c.amount, 0);

  const fraudAlerts = await db.select().from(fraudAlertsTable);

  const allDisruptions = await db.select().from(disruptionsTable);
  const activeDisruptionCount = allDisruptions.filter(d => d.isActive).length;

  const recentClaims = allClaims.slice(-10).reverse();
  const recentClaimsWithWorker = await Promise.all(recentClaims.map(async c => {
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, c.workerId));
    return { ...c, workerName: worker?.name ?? null, planName: null };
  }));

  // City breakdown
  const cities = [...new Set(allWorkers.map(w => w.city))];
  const cityBreakdown = cities.map(city => {
    const cityWorkers = allWorkers.filter(w => w.city === city);
    const cityClaims = allClaims.filter(c => c.city === city);
    const cityPayouts = cityClaims.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0);
    return { city, workers: cityWorkers.length, claims: cityClaims.length, payouts: cityPayouts };
  });

  res.json({
    totalWorkers: allWorkers.length,
    activeWorkers: activeWorkers.length,
    activePolicies: activePolicies.length,
    totalClaims: allClaims.length,
    pendingClaims: pendingClaims.length,
    approvedClaims: approvedClaims.length,
    rejectedClaims: rejectedClaims.length,
    totalPayouts,
    fraudAlerts: fraudAlerts.length,
    activeDisruptions: activeDisruptionCount,
    recentClaims: recentClaimsWithWorker,
    cityBreakdown,
  });
});

export default router;
