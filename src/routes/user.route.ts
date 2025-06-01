// user.controller.ts
import { Hono } from "hono";
import { authenticate } from "../middleware/authmiddleware"; // Import the authenticate middleware
import { AuthContext } from "../middleware/authmiddleware";

const authUsers = new Hono();

authUsers.get("/protected-route", authenticate, (c: AuthContext) => {
  return c.json({ message: "This is a protected route", user: c.user });
});

export { authUsers };
