import { datetime, mysqlTable, MySqlTable } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { varchar, timestamp, int, json, text, boolean } from "drizzle-orm/mysql-core";
import { usersTable } from "./sc_users";
import { adminTable } from "./sc_admin";

export const SC_TASK = mysqlTable('tasks', {
    id: int('id').primaryKey().autoincrement().notNull(),
    adminId: int('user_id').references(() => adminTable.adminId),
    Todo: varchar('todo', { length: 255 }).notNull(),
    isDone: boolean('is_done').notNull().default(false),
    create_at: timestamp('created_at').defaultNow().notNull(),
    delete_at: datetime('deleted_at').default(sql`null`)
})