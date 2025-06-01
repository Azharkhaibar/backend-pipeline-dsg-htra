import { drizzle } from "drizzle-orm/mysql2";
import { eq, like, and, asc, desc } from "drizzle-orm";
import * as dotenv from 'dotenv';
import { CustomerDetails } from "../../db/schema/sc_customers";
import mysql from 'mysql2/promise'
import { Hono } from "hono";
import { string, z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { DBConnection } from "../../db/database/dbIndex";
import { E } from "@faker-js/faker/dist/airline-CBNP41sR";

const router_customer_details = new Hono<{ Bindings: { db: any } }>();

router_customer_details.post('/customer_detail', zValidator('json', z.object({
    alamat: z.string().trim().min(1, "Alamat tidak boleh kosong"),
    kelurahan: z.string().trim().min(1),
    kecamatan: z.string().trim().min(1),
    kota: z.string().trim().min(1),
    provinsi: z.string().trim().min(1),
    kodepos: z.coerce.string().regex(/^\d{5,10}$/, "Kodepos tidak valid"),
})), async (c) => {
    try {
        const DBControllerInput = c.req.valid("json");
        const DBConnect = await DBConnection();
        const { alamat, kelurahan, kecamatan, kota, provinsi, kodepos } = DBControllerInput;
        if (!alamat || !kelurahan || !kecamatan || !kota || !provinsi || !kodepos) {
            return c.json({ error: 'Semua field harus diisi' }, 400);
        }
        if (kodepos.length < 5 || kodepos.length > 10) {
            return c.json({ error: 'Kodepos harus terdiri dari 5 hingga 10 digit' }, 400);
        }
        return DBConnection().then((DBConnect) => {
            return DBConnect.select().from(CustomerDetails).where(and(eq(CustomerDetails.kodePos, kodepos), eq(CustomerDetails.alamat, alamat)));
        }).then((CustomerDataExist) => {
            if (CustomerDataExist.length > 0) {
                return c.json({ error: 'data ada dlm database' });
            }
            return DBConnection().then((pushDB: any) => {
                return pushDB.insert(CustomerDetails).values({
                    alamat: DBControllerInput.alamat,
                    kelurahan: DBControllerInput.kelurahan,
                    kecamatan: DBControllerInput.kecamatan,
                    kota: DBControllerInput.kota,
                    provinsi: DBControllerInput.provinsi,
                    kodepos: DBControllerInput.kodepos,
                });
            });
        }).then((result) => {
            return c.json({ message: 'data berhasil ditambahkan', data: result }, 200);
        }).catch((error) => {
            console.error(error);
            return c.json({ error: 'Internal Server Error' }, 500);
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
})

router_customer_details.get('/customer_detail',
    zValidator('query', z.object({
        substr: z.string().optional(),
        limit: z.coerce.number().min(1).max(100).optional().default(10),
        offset: z.coerce.number().min(0).optional().default(0),
        sort: z.enum(['asc', 'desc']).optional().default('asc'),
    })),
    async (c) => {
        try {
            const { substr, limit, offset, sort } = c.req.valid('query');
            return DBConnection().then((z) => {
                let q = z.select().from(CustomerDetails).$dynamic();
                if (substr) {
                    q = q.where(like(CustomerDetails.kota, `%${substr}%`));
                }

                q = q.limit(limit).offset(offset).orderBy(sort === "asc" ? asc(CustomerDetails.kota) : desc(CustomerDetails.kota));
                return q;
            }).then((customers) => {
                return c.json({
                    message: 'Data berhasil ditampilkan',
                    total: customers.length,
                    data: customers
                });
            });
        } catch (error) {
            console.error(error);
            return c.json({ error: "Internal Server Error" }, 500);
        }
    }
);

router_customer_details.delete(
    '/customer_detail',
    zValidator('query',
        z.object({
            id: z.coerce.number().min(1, 'ID Tidak Valid'),
        })
    ),
    async (c) => {
        const { id } = c.req.valid('query');
        return DBConnection().then((db) => {
            return db.select().from(CustomerDetails).where(eq(CustomerDetails.customerDetailId, id)).then((check) => {
                if (check.length === 0) {
                    throw new Error('NOT_FOUND');
                }

                return db.delete(CustomerDetails).where(eq(CustomerDetails.customerDetailId, id));
            });
        }).then(() => {
            return c.json({ message: 'Data berhasil dihapus' }, 200);
        }).catch((err) => {
            if (err.message === 'NOT_FOUND') {
                return c.json({ message: 'Data ID tidak ditemukan' }, 404);
            }

            console.error(err);
            return c.json({ error: 'Internal Server Error' }, 500);
        });
    }
);

