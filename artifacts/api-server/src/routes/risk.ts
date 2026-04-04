import { Router, type IRouter } from "express";
import { CalculateRiskBody } from "@workspace/api-zod";
import { calculateRisk } from "../lib/risk.js";

const router: IRouter = Router();

router.post("/risk/calculate", async (req, res): Promise<void> => {
  const parsed = CalculateRiskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = calculateRisk({
    city: parsed.data.city,
    planType: parsed.data.planType,
    zone: parsed.data.zone ?? null,
  });

  res.json(result);
});

export default router;
