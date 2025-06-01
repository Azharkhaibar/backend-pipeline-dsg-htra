import { mysqlTable, varchar, text, timestamp, int } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const vendorsTable = mysqlTable("vendors", {
  vendorId: int("vendor_id").notNull().primaryKey().autoincrement(),
  namaVendor: varchar("nama_vendor", { length: 100 }).notNull(),
  perusahaan: varchar("perusahaan", { length: 100 }).notNull(),
  kontakEmail: varchar("kontak_email", { length: 100 }).notNull().unique(),
  kontakTelepon: varchar("kontak_telepon", { length: 12 }),
  address: text("address").notNull(),

  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
