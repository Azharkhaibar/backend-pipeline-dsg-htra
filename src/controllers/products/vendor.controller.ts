import { DBConnection } from "../../db/database/dbIndex";
import { Hono } from "hono";
import { vendorsTable } from "../../db/schema/sc_vendor";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, Param } from "drizzle-orm";
import { error } from "console";

export const router_vendor = new Hono();

router_vendor.get("/", async (c) => {
  try {
    const db = await DBConnection(); 
    const vendors = await db.select().from(vendorsTable);
    return c.json(vendors);
  } catch (error: unknown) {
    console.error("Failed to fetch vendors:", error);

    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ error: "Unknown error occurred" }, 500);
  }
});

const VendorSchema = z.object({
  namaVendor: z.string().min(2, 'Wajib isi nama vendor'),
  perusahaan: z.string(),
  kontakEmail: z.string().email('Wajib isi email'),
  kontakTelepon: z.string().max(12).optional(),
  address: z.string(),
  description: z.string().optional()
});

router_vendor.post('/',
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = VendorSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { error: "Validasi gagal", details: parsed.error.flatten() },
          400
        );
      }

      const db = await DBConnection();
      const insertVendor = await db.insert(vendorsTable).values({
        namaVendor: parsed.data.namaVendor,
        perusahaan: parsed.data.perusahaan,
        kontakEmail: parsed.data.kontakEmail,
        kontakTelepon: parsed.data.kontakTelepon,
        address: parsed.data.address,
        description: parsed.data.description
      });

      return c.json({ success: true, message: "Vendor berhasil ditambahkan" }, 201);
    } catch (error: unknown) {
      console.error("Gagal menambahkan vendor:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }

      return c.json({ error: "Unknown error occurred" }, 500);
    }
  }
)

router_vendor.delete('/:id', async(c) => {
  try {
    const idParam = c.req.param('id')
  const vendorId = Number(idParam)
  if (isNaN(vendorId)) {
    return c.json({ error: 'id ga valid'}, 400)
  }

  const db = await DBConnection()
  const existing = await db.select().from(vendorsTable).where(eq(
    vendorsTable.vendorId, vendorId
  ))
   if(existing.length === 0)  {
    return c.json({ error: "Vendor tidak ditemukan" }, 404);
   }
   await db.delete(vendorsTable).where(eq(
    vendorsTable.vendorId, vendorId
   ));
   return c.json({ success: true, message: `Data Vendor ID ${vendorId} di hapus`})
  } catch (error: unknown) {
    console.error('gagal hapus : ', error);
    if (error instanceof Error) {
      return c.json({ error: error.message}, 500)
    }
    return c.json({ error: "Unknown error occurred" }, 500);
    
  }
})
