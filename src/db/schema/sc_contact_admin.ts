import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const SC_CONTACT_STAKEHOLDER = mysqlTable('stakeholder', () => ({
  stakeholderId: int('stakeholder_id').primaryKey().autoincrement().notNull(),
  stakeholderName: varchar('stakeholeder_name', { length: 100 }).notNull(),
  stakeholderEmail: varchar('stakeholder_email', { length: 100 }).unique().notNull(),
  stakeholderPhone: varchar('stakeholder_phone', { length: 100 }).notNull(),
  createAt: timestamp('create_at').defaultNow(),
  updateAt: timestamp('update_at').defaultNow().notNull(),
}));
