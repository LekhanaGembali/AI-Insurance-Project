import { Router, type IRouter } from "express";
import { db, plansTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/plans", async (_req, res): Promise<void> => {
  const plans = await db.select().from(plansTable);
  res.json(plans);
});

export default router;
