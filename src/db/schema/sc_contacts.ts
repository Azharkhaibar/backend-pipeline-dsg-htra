import { sql } from "drizzle-orm";
import { varchar, mysqlTable, text, timestamp, int, boolean, decimal } from "drizzle-orm/mysql-core";
import { CustomerTable } from "./sc_customers";

export const ContactTable = mysqlTable("contacts", {
    id: int("contact_id").primaryKey().notNull().autoincrement(),
    customer_id: int("customer_id").notNull().references(() => CustomerTable.id),
    contactDate: timestamp("contact_date").defaultNow().notNull(),
    contactMethod: varchar("contact_method", { length: 50 }),
    subject: varchar("subject", { length: 255 }),
    message: text("message"),
    
  });
