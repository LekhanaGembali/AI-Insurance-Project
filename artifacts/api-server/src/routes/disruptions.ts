import { Router, type IRouter } from "express";
import { db, disruptionsTable, policiesTable, workersTable, claimsTable, fraudAlertsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateDisruptionBody, ActivateDisruptionParams, DeactivateDisruptionParams } from "@workspace/api-zod";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/disruptions", async (_req, res): Promise<void> => {
  const disruptions = await db.select().from(disruptionsTable).orderBy(disruptionsTable.createdAt);
  res.json(disruptions.reverse());
});

router.post("/disruptions", adminMiddleware, async (req, res): Promise<void> => {
  const parsed = CreateDisruptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [disruption] = await db.insert(disruptionsTable).values({
    type: parsed.data.type,
    city: parsed.data.city,
    severity: parsed.data.severity,
    description: parsed.data.description,
    affectedZones: parsed.data.affectedZones ?? null,
  }).returning();

  res.status(201).json(disruption);
});

router.get("/disruptions/active", authMiddleware, async (req, res): Promise<void> => {
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, req.worker!.id));
  if (!worker) {
    res.json([]);
    return;
  }

  const disruptions = await db.select().from(disruptionsTable)
    .where(and(eq(disruptionsTable.isActive, true), eq(disruptionsTable.city, worker.city)));
  res.json(disruptions);
});

router.patch("/disruptions/:disruptionId/activate", adminMiddleware, async (req, res): Promise<void> => {
  const params = ActivateDisruptionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [disruption] = await db.update(disruptionsTable)
    .set({ isActive: true, activatedAt: new Date() })
    .where(eq(disruptionsTable.id, params.data.disruptionId))
    .returning();

  if (!disruption) {
    res.status(404).json({ error: "Disruption not found" });
    return;
  }

  // Auto-trigger claims for eligible workers in the city
  const activePolicies = await db.select()
    .from(policiesTable)
    .where(eq(policiesTable.status, "active"));

  let claimsCreated = 0;

  for (const policy of activePolicies) {
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, policy.workerId));
    if (!worker || worker.city.toLowerCase() !== disruption.city.toLowerCase()) continue;

    // Fraud check: duplicate claim for same disruption
    const existingClaim = await db.select().from(claimsTable)
      .where(and(eq(claimsTable.workerId, worker.id), eq(claimsTable.disruptionId, disruption.id)));

    if (existingClaim.length > 0) {
      // Flag fraud: duplicate
      await db.insert(fraudAlertsTable).values({
        claimId: existingClaim[0].id,
        workerId: worker.id,
        reason: "Duplicate claim for same disruption event",
        severity: "medium",
      });
      continue;
    }

    // Auto-generate and approve claim
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [claim] = await db.insert(claimsTable).values({
      workerId: worker.id,
      policyId: policy.id,
      disruptionId: disruption.id,
      amount: policy.coverageAmount,
      disruptionType: disruption.type,
      city: disruption.city,
      description: `Auto-claim triggered by ${disruption.type} disruption in ${disruption.city}. ${disruption.description}`,
    }).returning();

    // Auto-approve
    await db.update(claimsTable)
      .set({ status: "approved", transactionId, processedAt: new Date() })
      .where(eq(claimsTable.id, claim.id));

    // Update policy total paid out
    await db.update(policiesTable)
      .set({ totalPaidOut: policy.totalPaidOut + policy.coverageAmount })
      .where(eq(policiesTable.id, policy.id));

    claimsCreated++;
  }

  // Update disruption claims count
  const [updatedDisruption] = await db.update(disruptionsTable)
    .set({ claimsTriggered: disruption.claimsTriggered + claimsCreated })
    .where(eq(disruptionsTable.id, disruption.id))
    .returning();

  res.json({
    disruption: updatedDisruption,
    claimsCreated,
    message: `Disruption activated. ${claimsCreated} auto-claims triggered and approved.`,
  });
});

router.patch("/disruptions/:disruptionId/deactivate", adminMiddleware, async (req, res): Promise<void> => {
  const params = DeactivateDisruptionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [disruption] = await db.update(disruptionsTable)
    .set({ isActive: false })
    .where(eq(disruptionsTable.id, params.data.disruptionId))
    .returning();

  if (!disruption) {
    res.status(404).json({ error: "Disruption not found" });
    return;
  }

  res.json(disruption);
});

export default router;
