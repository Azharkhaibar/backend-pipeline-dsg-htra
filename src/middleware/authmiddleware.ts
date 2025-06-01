import { HonoRequest } from 'hono';
import jwt from 'jsonwebtoken';
import { Context } from 'hono';

declare module 'hono' {
  interface HonoRequest {
    user?: any;
  }
}

export interface AuthContext extends Context {
  user?: any;
}

export function authenticate(c: AuthContext) {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return c.json({ error: "Token is required" }, 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return c.json({ error: "JWT_SECRET not set in environment variables" }, 500);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    c.user = decoded;
    return true;
  } catch (err) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}

export const verifyToken = async (c: AuthContext) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return c.json({ error: "Token is required" }, 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return c.json({ error: "JWT_SECRET not set in environment variables" }, 500);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    c.req.user = decoded;
    return true;
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};
