import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const policiesTable = pgTable("policies", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  planId: integer("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("active"),
  weeklyPremium: real("weekly_premium").notNull(),
  coverageAmount: real("coverage_amount").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
  endDate: timestamp("end_date", { withTimezone: true }),
  totalPaidOut: real("total_paid_out").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPolicySchema = createInsertSchema(policiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  totalPaidOut: true,
  startDate: true,
});

export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policiesTable.$inferSelect;
