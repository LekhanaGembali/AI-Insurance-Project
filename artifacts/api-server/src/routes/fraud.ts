import { Router, type IRouter } from "express";
import { db, fraudAlertsTable, workersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminMiddleware } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/fraud-alerts", adminMiddleware, async (_req, res): Promise<void> => {
  const alerts = await db.select().from(fraudAlertsTable);

  const result = await Promise.all(alerts.map(async a => {
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, a.workerId));
    return { ...a, workerName: worker?.name ?? null, workerCity: worker?.city ?? null };
  }));

  res.json(result.reverse());
});

export default router;
