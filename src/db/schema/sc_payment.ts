import { varchar, text, int, timestamp, decimal, mysqlTable, date} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { OrderTable } from "./sc_orders";
import { CustomerTable } from "./sc_customers";

export const paymentsTable = mysqlTable( "payments", {
    paymentId: int("payment_id").notNull().primaryKey().autoincrement(),
    orderId: int("order_id").notNull().references(() => OrderTable.orderId, { onDelete: "cascade"}),
    metodePembayaran: varchar("metode_pembayaran", { length: 55}).notNull().default("cash"),
    jumlahBayar: decimal("jumlah_bayar", { precision: 10, scale: 2}).notNull(),
    statusPembayaran: varchar("status_pembayaran", { length: 30}).notNull(),
    paymentDate: timestamp("payment_date").defaultNow().notNull(),
    customerId: int("customer_id").notNull().references(() => CustomerTable.id),
})  
