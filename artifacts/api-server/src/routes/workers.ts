import { Router, type IRouter } from "express";
import { db, workersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMyProfileBody, GetWorkerParams } from "@workspace/api-zod";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/workers/me", authMiddleware, async (req, res): Promise<void> => {
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, req.worker!.id));
  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }
  const { passwordHash: _, ...safeWorker } = worker;
  res.json(safeWorker);
});

router.patch("/workers/me", authMiddleware, async (req, res): Promise<void> => {
  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [worker] = await db.update(workersTable).set(parsed.data).where(eq(workersTable.id, req.worker!.id)).returning();
  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }
  const { passwordHash: _, ...safeWorker } = worker;
  res.json(safeWorker);
});

router.get("/workers", adminMiddleware, async (_req, res): Promise<void> => {
  const workers = await db.select().from(workersTable);
  const safe = workers.map(({ passwordHash: _, ...w }) => w);
  res.json(safe);
});

router.get("/workers/:workerId", adminMiddleware, async (req, res): Promise<void> => {
  const params = GetWorkerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, params.data.workerId));
  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }
  const { passwordHash: _, ...safeWorker } = worker;
  res.json(safeWorker);
});

export default router;
