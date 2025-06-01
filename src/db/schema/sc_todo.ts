import { mysqlTable } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { varchar, text, int, timestamp, datetime, json } from "drizzle-orm/mysql-core";
import { mysqlEnum } from "drizzle-orm/mysql-core";

export const SC_TODO_LIST = mysqlTable('todo_list', {
    TodoId: int('id').primaryKey().autoincrement().notNull(),
    todoTarget: varchar('target', { length: 255 }).notNull(),
    todoStatus: mysqlEnum('status', ['Inactive', 'Pending', 'In-Progress', 'Completed']).notNull(),
    deadline: datetime('deadline'),
    AssignedTo: varchar('assigned_to', { length: 100 }).notNull(),
    todoPriority: mysqlEnum('todo_priority', ['Low', 'Medium', 'High']).notNull(),
    todoCreatedDate: timestamp('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    todoModifiedDate: timestamp('modified_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    todoCreatedBy: varchar('created_by', { length: 255 }),
});