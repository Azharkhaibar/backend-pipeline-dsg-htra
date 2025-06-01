import { sql } from "drizzle-orm";
import { varchar, json, timestamp, decimal, int, mysqlTable } from "drizzle-orm/mysql-core";
import { OrderTable } from "./sc_orders";
import { productTable } from "./sc_product";

export const OrderItemsTable = mysqlTable("order_items", {
    id: int("order_item_id").primaryKey().notNull().autoincrement(),
    orderId: int("order_id").notNull().references(() => OrderTable.orderId),
    productId: int("product_id").notNull().references(() => productTable.id),
    quantity: int("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});
  
