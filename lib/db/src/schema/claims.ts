import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const claimsTable = pgTable("claims", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  policyId: integer("policy_id").notNull(),
  disruptionId: integer("disruption_id").notNull(),
  status: text("status").notNull().default("pending"),
  amount: real("amount").notNull(),
  disruptionType: text("disruption_type").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  transactionId: text("transaction_id"),
  fraudFlag: boolean("fraud_flag").notNull().default(false),
  fraudReason: text("fraud_reason"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertClaimSchema = createInsertSchema(claimsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  fraudFlag: true,
  transactionId: true,
  processedAt: true,
});

export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claimsTable.$inferSelect;
