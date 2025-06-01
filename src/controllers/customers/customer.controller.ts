import { drizzle } from "drizzle-orm/mysql2";
import { asc, desc, eq, like } from "drizzle-orm";
import * as dotenv from 'dotenv';
import { CustomerTable } from "../../db/schema/sc_customers";
import mysql from 'mysql2/promise'
import { Hono } from "hono";
import { z } from "zod";
import { DBConnection } from "../../db/database/dbIndex";
import { zValidator } from "@hono/zod-validator";

const router_customer = new Hono

router_customer.get('/list', zValidator('query', z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    offset: z.coerce.number().min(0).optional().default(0),
    sort: z.enum(['asc', 'desc']).optional().default('asc'),
})), async (c) => {
    try {
        const { limit, offset, sort } = c.req.valid('query');
        const DBConnect = await DBConnection();
        const customers = await DBConnect.select().from(CustomerTable).limit(limit)
        .offset(offset).orderBy(sort === 'asc' ? asc(CustomerTable.namaCustomer) : desc(CustomerTable.namaCustomer));
        return c.json({
            message: 'List customer berhasil diambil',
            total: customers.length,
            data: customers
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

router_customer.get('/search', zValidator('query', z.object({
    substr: z.string().min(1, "Keyword pencarian diperlukan"),
})), async (c) => {
    try {
        const { substr } = c.req.valid('query');
        const DBConnect = await DBConnection();
        const customers = await DBConnect.select().from(CustomerTable)
        .where(like(CustomerTable.namaCustomer, `%${substr}%`));
        return c.json({
            message: `Hasil pencarian untuk: ${substr}`,
            total: customers.length,
            data: customers
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});


router_customer.get('/:id', async (c) => {
    try {
        const id = Number(c.req.param('id')); 
        const DBConnect = await DBConnection();
        const result = await DBConnect.select().from(CustomerTable).where(eq(CustomerTable.id, id));
        if (result.length === 0) {
            return c.json({ message: "Customer tidak ditemukan" }, 404);
        }
        return c.json({
            message: "Customer ditemukan",
            data: result[0]
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

router_customer.post('/', zValidator('json', z.object({
    namaCustomer: z.string().min(2, "nama panjang minimal 2 huruf"),
    email: z.string().email(),
    status: z.enum(["active", "inactive"]),
    lastContacted: z.coerce.date().optional(),
})), async (c) => {
    try {
        const DBControllerInput = c.req.valid('json');
        const DBConnect = await DBConnection();
        const emailNormalized = DBControllerInput.email.toLowerCase();
        const EmailValidation = await DBConnect.select().from(CustomerTable).where(eq(CustomerTable.email, emailNormalized));
        if (EmailValidation.length > 0) {
            return c.json({ error: "sudah ada email yg sama" }, 400);
        }

        await DBConnect.insert(CustomerTable).values({
            namaCustomer: DBControllerInput.namaCustomer,
            email: emailNormalized,
            status: DBControllerInput.status,
            lastContacted: DBControllerInput.lastContacted ?? null,
        });

        return c.json({ message: "success" }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

// perlu di perbaiki

router_customer.patch('/:id', zValidator('json', z.object({
    namaCustomer: z.string().min(2, "nama panjang minimal 2 huruf").optional(),
    email: z.string().email().optional(),
    status: z.enum(["active", "inactive"]).optional(),
    lastContacted: z.coerce.date().optional(),
})), (c) => {
    const DBConnect = DBConnection();
    const DBControllerUpdate = c.req.valid('json');
    const id = Number(c.req.param("id"));
    return DBConnect.then((z) => z.select().from(CustomerTable).where(eq(CustomerTable.id, id)))
        .then((customerExist) => {
            if (customerExist.length === 0) {
                return c.json({ message: 'Customer tidak ditemukan' }, 404); 
            }

            if (DBControllerUpdate.email) {
                DBControllerUpdate.email = DBControllerUpdate.email.toLowerCase();
            }

            return DBConnect
                .then((z) => {
                    return z.update(CustomerTable).set({
                            ...DBControllerUpdate,
                            updated_at: new Date(),
                        }).where(eq(CustomerTable.id, id));
                }).then(() => {
                    return c.json({ message: 'data customer diubah'});
                });
        }).catch((error) => {
            console.error(error);
            return c.json({ message: "Internal Server Error" }, 500);
        });
});

router_customer.delete('/:id', async (c) => {
    try {
        const DBConnect = await DBConnection(); 
        const id = Number(c.req.param("id"));
        return DBConnect.select().from(CustomerTable).where(eq(CustomerTable.id, id))
            .then(customerExist => {
                if (customerExist.length === 0) {
                    return c.json({ message: 'Customer tidak ditemukan' }, 404);
                }
                return DBConnect.delete(CustomerTable).where(eq(CustomerTable.id, id)).then(() => {
                    return c.json({ message: 'Customer berhasil dihapus' });
                });
            })
            .catch((error) => {
                console.error(error);
                return c.json({ message: "Internal Server Error" }, 500);
            });
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});