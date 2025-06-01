import { sql } from "drizzle-orm";
import { MySqlTable, text, varchar, timestamp, int, decimal, mysqlTable } from "drizzle-orm/mysql-core";
import { productTable } from "./sc_product";
import { CustomerTable } from "./sc_customers";

export const reviewsTable = mysqlTable("reviews",
    {
        reviewId: int("review_id").notNull().primaryKey().autoincrement(),
        productId: int("product_id").notNull().references(() => productTable.id),
        customerId: int("customer_id").notNull().references(() => CustomerTable.id),
        rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
        reviewText: varchar("review_text", { length: 500 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    }
);