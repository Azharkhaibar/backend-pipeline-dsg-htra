// import { sql } from "drizzle-orm";
// import { varchar, text, json, int, time, boolean, mysqlTable } from "drizzle-orm/mysql-core";

// export type enum = ['New Lead', 'In Progress', 'Loss' ,'Won', 'Coverted']

// export const SC_LEAD_REPORTS = mysqlTable('lead_report', {
//     leadReportId: int('id').primaryKey().autoincrement().notNull(),
//     leadReportName: varchar('name', { length: 100}).notNull(),
//     email: varchar('email', { length: 255}).unique().notNull(),
//     phone: varchar('phone', { length: 12}).notNull(),
//     company: varchar('company', { length: 100 }).notNull()
// })