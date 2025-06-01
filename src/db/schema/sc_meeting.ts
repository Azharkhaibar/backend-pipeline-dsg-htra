import { drizzle } from "drizzle-orm/mysql2";
import { DBConnection } from "../database/dbIndex";
import { like, sql } from "drizzle-orm";
import { varchar, int, timestamp, json, text, mysqlTable } from "drizzle-orm/mysql-core";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { timeStamp } from "console";

export const sc_default_meeting_table = mysqlTable('tbl_default_meeting', {
    meetingDefaultId: int('id').primaryKey().notNull().autoincrement(),
    meetingIdFK: int('meeting_id_fk').notNull().references(() => SC_MEETING.meetingId, { onDelete: 'cascade'}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull()
})

export const SC_MEETING = mysqlTable('sc_meeting_table', {
    meetingId: int('id').primaryKey().notNull().autoincrement(),
    meetingSubject: varchar('meeting_subject', { length: 100 }).notNull(),
    meetingPlace: varchar('meeting_place', { length: 100 }).notNull(),
    meetingDate: timestamp('meeting_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull()
  });