import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

interface AdminTokenPayload {
  adminId: number;
  email: string;
}

declare module "hono" {
  interface ContextVariableMap {
    user: AdminTokenPayload;
  }
}

export const verifyTokenMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ status: 401, message: "Authorization header missing or invalid" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return c.json({ status: 500, message: "JWT_SECRET not set" }, 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as AdminTokenPayload;

    if (!decoded.adminId || !decoded.email) {
      return c.json({ status: 401, message: "Invalid token payload" }, 401);
    }

    c.set("user", decoded); // ✅
    await next(); // ✅ lanjutkan ke route berikutnya
  } catch (err) {
    return c.json({ status: 401, message: "Invalid or expired token" }, 401);
  }
};
