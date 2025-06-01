import { Context, Hono } from "hono";
import { asc, desc, eq, like, and, lte, gte, count, or, SQL } from "drizzle-orm";
import { productTable, categoryTable } from "../../db/schema/sc_product";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { StatusCode } from "hono/utils/http-status";
import { DBConnection } from "../../db/database/dbIndex";
import { vendorsTable } from "../../db/schema/sc_vendor";


import { error } from "console";

export const router_product = new Hono();

const productSchema = z.object({
  namaProduk: z.string().min(1),
  warnaProduk: z.string().optional().nullable(),
  fotoProduk: z.string().optional().nullable(),
  deskripsiProduk: z.string().min(1),
  harga: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "harga harus berupa angka dengan maksimal 2 desimal"),
  fkVendor: z.string().regex(/^\d+$/, "fkVendor harus angka"),
  fkCategory: z.string().regex(/^\d+$/, "fkCategory harus angka"),
  stok: z.string().regex(/^\d+$/, "stok harus angka"),
  stok_minimum: z.string().regex(/^\d+$/, "stok_minimum harus angka"),
  isManageStock: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ).default(true),
});

router_product.post('/', async (c) => {
  const db = await DBConnection();
  const form = await c.req.formData();

  const rawValues = {
    namaProduk: form.get("namaProduk"),
    warnaProduk: form.get("warnaProduk"),
    fotoProduk: null,
    deskripsiProduk: form.get("deskripsiProduk"),
    harga: form.get("harga"),
    fkVendor: form.get("fkVendor"),
    fkCategory: form.get("fkCategory"),
    stok: form.get("stok"),
    stok_minimum: form.get("stok_minimum"),
    isManageStock: form.get("isManageStock"),
  };

  const parsed = productSchema.safeParse(rawValues);
  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.flatten() }, 400);
  }
  const file = form.get("fotoProduk");
  if (file instanceof File) {
    parsed.data.fotoProduk = file.name;
  }

  const finalValues = {
    ...parsed.data,
    harga: parsed.data.harga,
    fkVendor: Number(parsed.data.fkVendor),
    fkCategory: Number(parsed.data.fkCategory),
    stok: Number(parsed.data.stok),
    stok_minimum: Number(parsed.data.stok_minimum),
    isManageStock: parsed.data.isManageStock,
  };

  try {
    const inserted = await db.insert(productTable).values(finalValues).$returningId();

    return c.json({
      success: true,
      message: 'produk ditambahkan',
      data: inserted[0],
    });
  } catch (err) {
    console.error('terjadi error : ', err);
    return c.json({
      success: false,
      message: 'gagal tambah produk',
      error: err instanceof Error ? err.message : String(err),
    }, 500);
  }
});


router_product.get('/', async (c) => {
  try {
    const db = await DBConnection();
    const getProduct = await db
      .select({
        id: productTable.id,
        namaProduk: productTable.namaProduk,
        fotoProduk: productTable.fotoProduk,
        deskripsiProduk: productTable.deskripsiProduk,
        harga: productTable.harga,
        stok: productTable.stok,
        stok_minimum: productTable.stok_minimum,
        perusahaan: vendorsTable.perusahaan,
        namaKategori: categoryTable.namaKategori
      })
      .from(productTable)
      .leftJoin(vendorsTable, eq(productTable.fkVendor, vendorsTable.vendorId))
      .leftJoin(categoryTable, eq(productTable.fkCategory, categoryTable.id));

    return c.json({ success: true, data: getProduct });
  } catch (err) {
    console.error('Gagal fetch produk:', err);
    return c.json({ success: false, message: 'Kesalahan pada server' });
  }
});


