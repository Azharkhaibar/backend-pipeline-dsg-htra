import { DBConnection } from "../../db/database/dbIndex";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { adminProfileTable, adminTable, tbl_admin_default } from "../../db/schema/sc_admin";
import { Hono } from "hono";
import { like, eq, desc, asc, max } from "drizzle-orm";
import { profile } from "console";

export const adminController = new Hono();

adminController.get("/", zValidator("query", z.object({})), async (c) => {
  try {
    const db = await DBConnection();
    const result = await db.select().from(adminTable).innerJoin(adminProfileTable, eq(adminTable.adminProfileId, adminProfileTable.adminProfileId));
    const admins = result.map((row) => ({
      adminId: row.admin.adminId,
      name: row.admin.name,
      email: row.admin.email,
      phone: row.admin_profile.phone,
      profilePicture: row.admin_profile.profilePicture,
      createdAt: row.admin.createdAt,
      updatedAt: row.admin.updatedAt,
    }));
    return c.json({
      status: 200,
      message: "Success",
      data: admins,
    });
  } catch (error) {
    console.error("[Admin GET Error]", error);
    return c.json(
      {
        status: 500,
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// POST Register

adminController.post(
  "/register",
  zValidator(
    "json",
    z.object({
      name: z.string().min(2, { message: "minimal 2 karakter" }).max(100),
      email: z.string().email(),
      phone: z.string().min(2, { message: "minimal 2 karakter" }).max(20).optional(),
      password: z
        .string()
        .min(6)
        .max(10)
        .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
        .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
        .regex(/[0-9]/, { message: "Password harus mengandung angka" })
        .regex(/[@$!%*?&]/, { message: "Password harus mengandung karakter spesial" }),
      language: z.enum(["english", "indonesia"]).optional().default("english"),
      team: z.enum(["Staff", "Finance", "Tech", "Marketing"]).optional().default("Staff"),
      jobTitle: z.string().max(100).optional(),
      bio: z.string().optional(),
    })
  ),
  async (c) => {
    try {
      const { name, email, phone, password, language, team, jobTitle, bio } = c.req.valid("json");
      const db = await DBConnection();

      // Cek email duplikat
      const existing = await db.select().from(adminTable).where(eq(adminTable.email, email));
      if (existing.length > 0) {
        return c.json({ status: 400, success: false, message: "Email already exists" }, 400);
      }

      const hash = await bcrypt.hash(password, 10);

      console.log("Inserting admin profile with:", { phone, language, team, jobTitle, bio });

      // Insert ke adminProfile
      const resultProfile = await db
        .insert(adminProfileTable)
        .values({
          phone: phone ?? "",
          language,
          team,
          jobTitle: jobTitle ?? null,
          bio: bio ?? null,
          status: "active",
          profilePicture: "",
          createdBy: null,
        })
        .execute();

      console.log("Result admin profile insert:", resultProfile);

      // Ambil insertId dengan benar
      const profileAdminId = (resultProfile as any)[0]?.insertId;
      if (!profileAdminId || isNaN(profileAdminId)) throw new Error("Gagal insert admin profile");

      // Insert ke admin
      const resultAdmin = await db
        .insert(adminTable)
        .values({
          name,
          email,
          password: hash,
          adminProfileId: profileAdminId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();

      console.log("Result admin insert:", resultAdmin);

      const adminId = (resultAdmin as any)[0]?.insertId;
      console.log("adminId:", adminId);
      if (!adminId || isNaN(adminId)) throw new Error("Gagal insert admin");

      // Insert ke tabel default
      await db
        .insert(tbl_admin_default)
        .values({
          adminId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();

      // JWT
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET not found");
      const token = jwt.sign({ adminId, email }, secret, { expiresIn: "1h" });

      return c.json(
        {
          status: 201,
          success: true,
          message: "Admin registered successfully",
          data: { adminId, name, email, token },
        },
        201
      );
    } catch (err) {
      console.error("[ADMIN REGISTER ERROR]", err);
      return c.json({ status: 500, success: false, message: "Internal server error" }, 500);
    }
  }
);


const adminProfileSchema = z.object({
  name: z.string().min(2, { message: "Minimal 2 karakter" }).max(100),
  email: z.string().email(),
  phone: z.string().min(10, { message: "Minimal 10 karakter" }).max(20),
  profilePicture: z.string().url().optional(),

  language: z.enum(["english", "indonesia"]).default("indonesia"),
  status: z.enum(["active", "inactive"]).default("active"),
  team: z.enum(["Staff", "Finance", "Tech", "Marketing"]).default("Staff"),
  jobTitle: z.string().max(100).optional(),
  bio: z.string().optional(),

  password: z
    .string()
    .min(6, { message: "Minimal 6 karakter" })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
    .regex(/[0-9]/, { message: "Password harus mengandung angka" })
    .regex(/[@$!%*?&]/, { message: "Password harus mengandung karakter spesial" }),
});


adminController.post("/", zValidator("json", adminProfileSchema), async (c) => {
  try {
    const db = await DBConnection();
    const body = c.req.valid("json");
    const existingAdmin = await db.select().from(adminTable).where(eq(adminTable.email, body.email));
    if (existingAdmin.length > 0) {
      return c.json({ status: 400, message: "Email sudah terdaftar" }, 400);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const resultProfile = await db
      .insert(adminProfileTable)
      .values({
        phone: body.phone,
        language: body.language || "indonesia",
        status: body.status || "active",
        team: body.team || "Staff",
        jobTitle: body.jobTitle || "",
        bio: body.bio || "",
        profilePicture: body.profilePicture || "",
      })
      .execute();

    const profileId = (resultProfile as any).insertId as number;
    if (!profileId || isNaN(profileId)) {
      throw new Error("Gagal menyimpan data admin profile");
    }

    const resultAdmin = await db
      .insert(adminTable)
      .values({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        adminProfileId: profileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .execute();

    const adminId = (resultAdmin as any).insertId as number;

    return c.json(
      {
        status: 201,
        message: "Registrasi admin berhasil",
        data: {
          adminId,
          name: body.name,
          email: body.email,
        },
      },
      201
    );
  } catch (error) {
    console.error("[Admin POST Error]", error);
    return c.json(
      {
        status: 500,
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// post login

adminController.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    })
  ),
  async (c) => {
    try {
      const db = await DBConnection();
      const { email, password } = c.req.valid("json");
      const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email)).limit(1);

      if (!admin) {
        return c.json(
          {
            status: 404,
            success: false,
            message: "Email atau password salah",
          },
          404
        );
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, admin.password);
      if (!passwordValid) {
        return c.json(
          {
            status: 401,
            success: false,
            message: "Email atau password salah",
          },
          401
        );
      }

      // Generate token
      const token = jwt.sign({ adminId: admin.adminId, email: admin.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

      return c.json(
        {
          status: 200,
          success: true,
          message: "Login berhasil",
          data: {
            adminId: admin.adminId,
            name: admin.name,
            email: admin.email,
            token,
          },
        },
        200,
        {
          "X-Content-Type-Options": "nosniff",
        }
      );
    } catch (error) {
      console.error("[Admin Login Error]", error);
      return c.json(
        {
          status: 500,
          success: false,
          message: "Terjadi kesalahan server",
        },
        500
      );
    }
  }
);

adminController.delete(
  "/",
  zValidator(
    "query",
    z.object({
      id: z.coerce.number().min(1, { message: "id tidak valid" }),
    })
  ),
  async (c) => {
    try {
      const { id } = c.req.valid("query");
      const db = await DBConnection();
      const checkID = await db.select().from(adminTable).where(eq(adminTable.adminId, id));

      if (checkID.length === 0) {
        return c.json(
          {
            status: 404,
            message: "ID tidak ditemukan",
            data: null,
          },
          404
        );
      }

      await db.delete(adminTable).where(eq(adminTable.adminId, id));
      return c.json(
        {
          status: 200,
          message: "Admin berhasil dihapus",
          data: null,
        },
        200
      );
    } catch (error) {
      console.error("[Admin DELETE Error]", error);
      return c.json(
        {
          status: 500,
          message: "Server error",
          error: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);
