import { sql } from "drizzle-orm";
import { varchar, mysqlTable, mysqlEnum, text, int, timestamp, boolean, decimal } from "drizzle-orm/mysql-core";
import { app } from "../../app";
import { METHODS } from "http";
import { json } from "stream/consumers";

export const CustomerTable = mysqlTable("customers", {
    id: int("customer_id").primaryKey().notNull().autoincrement(),
    namaCustomer: varchar("nama_customer", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    status: mysqlEnum("status", ["active", "inactive"]).default("active"), 
    lastContacted: timestamp("last_contacted"),  
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const CustomerDetails = mysqlTable("customer_details", {
    customerDetailId: int("customer_detail_id").primaryKey().notNull().autoincrement(),
    customerId: int("customer_id").notNull().references(() => CustomerTable.id, { onDelete: "cascade" }),
    alamat: varchar("alamat", { length: 255 }),
    kelurahan: varchar("kelurahan", { length: 100 }),
    kecamatan: varchar("kecamatan", { length: 100 }),
    kota: varchar("kota", { length: 100 }),
    provinsi: varchar("provinsi", { length: 100 }),
    kodePos: varchar("kode_pos", { length: 10 }),
  });

export const customerBehavior = mysqlTable("customer_behavior", {
  id: int("id").primaryKey().autoincrement().notNull(),
  customerId: int("customer_id")
    .notNull()
    .references(() => CustomerTable.id),
  pageViews: int("page_views").default(0).notNull(),
  cartAdds: int("cart_adds").default(0).notNull(),
  wishlistAdds: int("wishlist_adds").default(0).notNull(),
  lastVisit: timestamp("last_visit", { mode: "date" }),
});