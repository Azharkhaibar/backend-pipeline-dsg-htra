
import { sql } from "drizzle-orm";
import { varchar, int, text, timestamp, json, boolean, uniqueIndex, mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";

// ini untuk di profile page
export const adminProfileTable = mysqlTable("admin_profile", {
  adminProfileId: int("id").primaryKey().notNull().autoincrement(),

  phone: varchar("phone", { length: 20 }).notNull(),
  language: mysqlEnum("language", ["english", "indonesia"]).notNull(),
  jobTitle: varchar("job_title", { length: 100 }),
  bio: text("bio"),
  status: mysqlEnum("status", ["active", "inactive"]),
  team: mysqlEnum("team", ["Staff","Finance", "Tech", "Marketing"]).default("Staff").notNull(),
  profilePicture: varchar("profile_picture", { length: 255 }).default("").notNull(),

  createdBy: int("created_by"),
});

// ini saat di autentikasi
export const adminTable = mysqlTable('admin', {
  adminId: int('id').primaryKey().notNull().autoincrement(),
  adminProfileId: int('admin_profile_id').notNull().references(() => adminProfileTable.adminProfileId),

  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const tbl_admin_default = mysqlTable("admin_default", {
  defaultAdminId: int("default_admin_id").primaryKey().notNull().autoincrement(),
  adminId: int('admin_id').notNull().references(() => adminTable.adminId),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});