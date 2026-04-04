import { Router, type IRouter } from "express";
import { db, policiesTable, plansTable, workersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { SelectPolicyBody } from "@workspace/api-zod";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.post("/policies/select", authMiddleware, async (req, res): Promise<void> => {
  const parsed = SelectPolicyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, parsed.data.planId));
  if (!plan) {
    res.status(404).json({ error: "Plan not found" });
    return;
  }

  // Deactivate existing active policies
  await db.update(policiesTable)
    .set({ status: "inactive" })
    .where(and(eq(policiesTable.workerId, req.worker!.id), eq(policiesTable.status, "active")));

  const finalPremium = parsed.data.finalPremium ?? plan.weeklyPremium;

  const [policy] = await db.insert(policiesTable).values({
    workerId: req.worker!.id,
    planId: plan.id,
    planName: plan.name,
    weeklyPremium: finalPremium,
    coverageAmount: plan.coverageAmount,
  }).returning();

  res.status(201).json({ ...policy, workerName: null, workerCity: null });
});

router.get("/policies/active", authMiddleware, async (req, res): Promise<void> => {
  const [policy] = await db.select().from(policiesTable)
    .where(and(eq(policiesTable.workerId, req.worker!.id), eq(policiesTable.status, "active")))
    .limit(1);

  if (!policy) {
    res.status(404).json({ error: "No active policy" });
    return;
  }

  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, policy.workerId));
  res.json({ ...policy, workerName: worker?.name ?? null, workerCity: worker?.city ?? null });
});

router.get("/policies/history", authMiddleware, async (req, res): Promise<void> => {
  const policies = await db.select().from(policiesTable)
    .where(eq(policiesTable.workerId, req.worker!.id));
  res.json(policies.map(p => ({ ...p, workerName: null, workerCity: null })));
});

router.get("/policies/all", adminMiddleware, async (_req, res): Promise<void> => {
  const policies = await db.select().from(policiesTable);
  const result = await Promise.all(policies.map(async p => {
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, p.workerId));
    return { ...p, workerName: worker?.name ?? null, workerCity: worker?.city ?? null };
  }));
  res.json(result);
});

export default router;
