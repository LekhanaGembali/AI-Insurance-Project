import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const disruptionsTable = pgTable("disruptions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  city: text("city").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  affectedZones: text("affected_zones"),
  claimsTriggered: integer("claims_triggered").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  activatedAt: timestamp("activated_at", { withTimezone: true }),
});

export const insertDisruptionSchema = createInsertSchema(disruptionsTable).omit({
  id: true,
  createdAt: true,
  isActive: true,
  claimsTriggered: true,
  activatedAt: true,
});

export type InsertDisruption = z.infer<typeof insertDisruptionSchema>;
export type Disruption = typeof disruptionsTable.$inferSelect;
