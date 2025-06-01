import { sql } from "drizzle-orm";
import { varchar, json, timestamp, decimal, int, mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";
import { CustomerTable } from "./sc_customers";
import { productTable } from "./sc_product";

export const OrderTable = mysqlTable("orders", {
  orderId: int("order_id").primaryKey().notNull().autoincrement(),
  customerId: int("customer_id").notNull().references(() => CustomerTable.id),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  status: mysqlEnum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']).notNull(),
  notes: varchar("notes", { length: 255 }),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'paid', 'refunded']).default('pending').notNull(),
  shippingAddress: json('shipping_address').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow()
});
