import { Router, type IRouter } from "express";
import { db, claimsTable, workersTable, policiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetClaimParams } from "@workspace/api-zod";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/claims", authMiddleware, async (req, res): Promise<void> => {
  const claims = await db.select().from(claimsTable)
    .where(eq(claimsTable.workerId, req.worker!.id));

  const result = await Promise.all(claims.map(async c => {
    const [policy] = await db.select().from(policiesTable).where(eq(policiesTable.id, c.policyId));
    return { ...c, workerName: null, planName: policy?.planName ?? null };
  }));

  res.json(result.reverse());
});

router.get("/claims/all", adminMiddleware, async (_req, res): Promise<void> => {
  const claims = await db.select().from(claimsTable);

  const result = await Promise.all(claims.map(async c => {
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, c.workerId));
    const [policy] = await db.select().from(policiesTable).where(eq(policiesTable.id, c.policyId));
    return { ...c, workerName: worker?.name ?? null, planName: policy?.planName ?? null };
  }));

  res.json(result.reverse());
});

router.get("/claims/:claimId", authMiddleware, async (req, res): Promise<void> => {
  const params = GetClaimParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [claim] = await db.select().from(claimsTable).where(eq(claimsTable.id, params.data.claimId));
  if (!claim) {
    res.status(404).json({ error: "Claim not found" });
    return;
  }

  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, claim.workerId));
  const [policy] = await db.select().from(policiesTable).where(eq(policiesTable.id, claim.policyId));

  res.json({ ...claim, workerName: worker?.name ?? null, planName: policy?.planName ?? null });
});

export default router;
