import { categoryTable } from "../../db/schema/sc_product";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { DBConnection } from "../../db/database/dbIndex";
import { Hono } from "hono";
import { asc, desc, eq, and } from "drizzle-orm";

export const router_category_product = new Hono();

router_category_product.get("/", async (c) => {
  try {
    const db = await DBConnection();
    const categories = await db.select().from(categoryTable);
    return c.json(categories);
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ error: "Unknown error occurred" }, 500);
  }
});

const CategorySchema = z.object({
  namaKategori: z.string(),
  deskripsiKategori: z.string().optional(),
});

type CategoryInsert = {
  namaKategori: string;
  deskripsiKategori?: string | null;
};

router_category_product.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, data: null, message: "Kategori gagal dibuat", error: parsed.error.flatten() }, 400);
    }

    const db = await DBConnection();

    const insertData: CategoryInsert = {
      namaKategori: parsed.data.namaKategori,
      deskripsiKategori: parsed.data.deskripsiKategori ?? null,
    };

    if (parsed.data.deskripsiKategori) {
      insertData.deskripsiKategori = parsed.data.deskripsiKategori;
    }

    await db.insert(categoryTable).values(insertData);

    return c.json({ success: true, message: "Kategori berhasil ditambahkan" }, 201);
  } catch (error) {
    console.error("Gagal tambah kategori:", error);
    return c.json({ success: false, error: "Unknown error occurred" }, 500);
  }
});
