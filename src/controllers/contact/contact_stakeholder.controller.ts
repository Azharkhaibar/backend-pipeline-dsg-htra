// contact_stakeholder.controller.ts

import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DBConnection } from "../../db/database/dbIndex";
import { SC_CONTACT_STAKEHOLDER } from "../../db/schema/sc_contact_admin";
import { da } from "@faker-js/faker/.";

export const stakeholderContactSchema = z.object({
  stakeholderName: z.string().min(3, "Nama minimal 3 karakter"),
  stakeholderEmail: z.string().email("Email tidak valid"),
  stakeholderPhone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{7,10}$/, "Nomor HP Indonesia tidak valid"),
});

// const stakeholderContactSchema = z.object({
//   stakeholderName: z.string().max(100),
//   stakeholderEmail: z.string().email(),
//   stakeholderPhone: z.string().regex(/^(\+62|0)[0-9]{9,13}$/, "Nomor HP tidak valid"),
// });

const stakeholderContact = new Hono();

stakeholderContact.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsedBody = stakeholderContactSchema.safeParse(body);
    if (!parsedBody.success) {
      return c.json({ error: "validasi zod gagal", details: parsedBody.error.flatten() }, 400);
    }

    const normalizePhone = (phone: string): string => {
      if (phone.startsWith("+62")) return phone;
      if (phone.startsWith("62")) return "+" + phone;
      if (phone.startsWith("0")) return "+62" + phone.slice(1);
      return phone;
    };

    const db = await DBConnection();
    const insertDT = await db.insert(SC_CONTACT_STAKEHOLDER).values({
      stakeholderName: parsedBody.data.stakeholderName,
      stakeholderEmail: parsedBody.data.stakeholderEmail,
      // terapkan
      stakeholderPhone: normalizePhone(parsedBody.data.stakeholderPhone),
    });

    return c.json({
      success: true,
      data: {
        affectedRows: insertDT[0]?.affectedRows,
        insertId: insertDT[0]?.insertId,
      },
    });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

export { stakeholderContact };

stakeholderContact.get("/", async (c) => {
  try {
    const db = await DBConnection();
    const stakeholders = await db.select().from(SC_CONTACT_STAKEHOLDER);
    return c.json({ success: true, data: stakeholders });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});
