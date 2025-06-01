import { sql } from "drizzle-orm";
import {
  varchar,
  mysqlTable,
  timestamp,
  decimal,
  int,
  text,
  boolean as mysqlBoolean,
} from "drizzle-orm/mysql-core";

import { CustomerTable } from "./sc_customers";
import { vendorsTable } from "./sc_vendor";

export const categoryTable = mysqlTable("category", {
  id: int("category_id").notNull().primaryKey().autoincrement(),
  namaKategori: varchar("nama_kategori", { length: 100 }).notNull(),
  deskripsiKategori: varchar("deskripsi_kategori", { length: 255 }),
});

export const productTable = mysqlTable("product", {
  id: int("product_id").primaryKey().autoincrement(),
  namaProduk: varchar("nama_produk", { length: 100 }).notNull(),
  warnaProduk: varchar("warna_produk", { length: 50 }),
  fotoProduk: varchar("foto_produk", { length: 255 }),
  deskripsiProduk: text("deskripsi_produk").notNull(),
  harga: decimal("harga", { precision: 10, scale: 2 }),  

  fkVendor: int("fk_vendor").references(() => vendorsTable.vendorId, {onDelete: "restrict"}),
  fkCategory: int("fk_category").references(() => categoryTable.id, {onDelete: 'set null'}),

  stok: int("stok"),
  stok_minimum: int("stok_minimum"),
  isManageStock: mysqlBoolean("isManageStock").default(true),

  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const ExpensesTable = mysqlTable("expenses", {
  expensesId: int('expenses_id').primaryKey().autoincrement(),
  vendorId: int('vendor_id').notNull().references(() => vendorsTable.vendorId),
  productId: int('product_id').notNull().references(() => productTable.id),
  tipePengeluaran: varchar("expense_type", { length: 100}),
  kuantitas: int("quantity"),
  jumlah: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  deskripsi: text("description"),

  expenseDate: timestamp("expense_date").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})


export const cartItemsTable = mysqlTable("cart_item", {
  cartItemId: int("cart_item_id").notNull().primaryKey().autoincrement(),
  customerId: int("customer_id")
    .notNull()
    .references(() => CustomerTable.id, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});