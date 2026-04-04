import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fraudAlertsTable = pgTable("fraud_alerts", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  workerId: integer("worker_id").notNull(),
  reason: text("reason").notNull(),
  severity: text("severity").notNull().default("low"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFraudAlertSchema = createInsertSchema(fraudAlertsTable).omit({
  id: true,
  createdAt: true,
  resolved: true,
});

export type InsertFraudAlert = z.infer<typeof insertFraudAlertSchema>;
export type FraudAlert = typeof fraudAlertsTable.$inferSelect;
