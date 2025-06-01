import { Hono } from "hono";
import { ExpensesTable } from "../../db/schema/sc_product";
import { DBConnection } from "../../db/database/dbIndex";
import { eq, like } from "drizzle-orm";

export const expenses_router = new Hono();

expenses_router.get("/", async (c) => {
    const db = await DBConnection()
    try {
        const resExpenses = await db.select().from(ExpensesTable);
        return c.json({ success: true, data: resExpenses, message: 'berhasil fetch pengeluaran'}, 200)
    } catch (error) {
        return c.json({ success: false, message: 'Ada yg salah Servernya'}, 500)
    }
})

expenses_router.post('/')