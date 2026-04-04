import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, workersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterWorkerBody, LoginWorkerBody, LoginAdminBody } from "@workspace/api-zod";
import { signToken } from "../middlewares/auth.js";
import { cityRiskLevel } from "../lib/risk.js";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterWorkerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, phone, city, platform, weeklyIncome, zone } = parsed.data;

  const existing = await db.select().from(workersTable).where(eq(workersTable.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const riskLevel = cityRiskLevel(city);

  const [worker] = await db.insert(workersTable).values({
    name,
    email,
    passwordHash,
    phone: phone ?? null,
    city,
    platform,
    weeklyIncome,
    zone: zone ?? null,
    riskLevel,
  }).returning();

  const token = signToken({ id: worker.id, email: worker.email, role: worker.role });

  const { passwordHash: _, ...safeWorker } = worker;
  res.status(201).json({ token, worker: { ...safeWorker, weeklyIncome: worker.weeklyIncome }, role: worker.role });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginWorkerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.email, email));

  if (!worker || worker.role !== "worker") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, worker.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken({ id: worker.id, email: worker.email, role: worker.role });
  const { passwordHash: _, ...safeWorker } = worker;
  res.json({ token, worker: safeWorker, role: worker.role });
});

router.post("/auth/admin-login", async (req, res): Promise<void> => {
  const parsed = LoginAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.email, email));

  if (!worker || worker.role !== "admin") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, worker.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken({ id: worker.id, email: worker.email, role: worker.role });
  const { passwordHash: _, ...safeWorker } = worker;
  res.json({ token, worker: safeWorker, role: worker.role });
});

export default router;
