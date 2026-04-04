import { pgTable, text, serial, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workersTable = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  city: text("city").notNull(),
  platform: text("platform").notNull(),
  weeklyIncome: real("weekly_income").notNull(),
  zone: text("zone"),
  riskLevel: text("risk_level").notNull().default("moderate"),
  isActive: boolean("is_active").notNull().default(true),
  role: text("role").notNull().default("worker"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertWorkerSchema = createInsertSchema(workersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
  riskLevel: true,
  isActive: true,
  role: true,
});

export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type Worker = typeof workersTable.$inferSelect;
