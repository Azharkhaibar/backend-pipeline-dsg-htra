import { sql } from "drizzle-orm";
import { varchar, mysqlTable, text, timestamp, int,boolean, decimal } from "drizzle-orm/mysql-core";
import { usersTable } from "./sc_users";


export const ActivityTable = mysqlTable("activities", {
  id: int("activity_customer_id")
    .notNull()
    .primaryKey()
    .autoincrement(), // Defining auto-incrementing without primary key again
  customer_id: int("customer_id").notNull(),
  user_id: int("user_id").notNull().references(() => usersTable.userId),
  activityDate: timestamp("activity_date").defaultNow().notNull(),
  activityType: varchar("activity_type", { length: 100 }).notNull(),
  description: text("description"),
});


