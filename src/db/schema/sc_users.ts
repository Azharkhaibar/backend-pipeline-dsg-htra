import { sql } from "drizzle-orm";
import { mysqlTable, varchar, timestamp, int, text } from "drizzle-orm/mysql-core";

// skema user belum selesai
// Tabel Default
export const tbl_default = mysqlTable("tb_users_default", {
  id: int().autoincrement().primaryKey(),
  UserId: int("user_id")
    .notNull()
    .references(() => usersTable.userId),
  UserSecureId: int("user_secure_id")
    .notNull()
    .references(() => usersSecureTable.userSecureId),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at").defaultNow().onUpdateNow().notNull(),
});

export const usersTable = mysqlTable("users", {
  userId: int("user_id").primaryKey().autoincrement().notNull(),
  namaDepan: varchar("nama_depan", { length: 100 }),
  namaBelakang: varchar("nama_belakang", { length: 100 }),
  fullname: varchar("fullname", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  lastLoginAt: timestamp("last_login_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),

});

export const usersSecureTable = mysqlTable("users_secure", {
  userSecureId: int("user_secure_id").primaryKey().autoincrement().notNull(),
  userId: int("user_id").notNull().references(() => usersTable.userId),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  lastLoginAt: timestamp("last_login_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userProfilesTable = mysqlTable("user_profiles", {
  userProfileId: int("user_profile_id").primaryKey().autoincrement().notNull(),
  userId: int("user_id").notNull().references(() => usersTable.userId),
  phone: varchar("phone", { length: 20 }),
  imageUrl: varchar("image_url", { length: 255 }),
  bio: text("bio"),
});