import { Hono } from "hono";
import { cors } from "hono/cors";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import { serveStatic } from "hono/serve-static";
import { createServer } from "http";

import { router_product } from "./controllers/products/product.controller";
import { router_category_product } from "./controllers/products/categoryProduct.controller";
import { authUsers } from "./routes/user.route";
import { router_users } from "./controllers/auth/auth.controller";
import { adminController } from "./controllers/auth/admin.controller";
import { TaskController } from "./controllers/todo/task.controller";
import { router_vendor } from "./controllers/products/vendor.controller";
import { stakeholderContact } from "./controllers/contact/contact_stakeholder.controller";
import { verifyToken } from "./middleware/jwtverifyadmin";
import { verifyTokenMiddleware } from "./middleware/verifyTokenMiddleware";
import { staticHandler } from "./middleware/staticHandler";

declare module "hono" {
  interface Context {
    user?: { adminId: number; email: string };
  }
}

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (c) => {
  return new Response(null, { status: 204 });
});

// ===== Routes setup =====
app.route("/product", router_product);
app.route("/vendor", router_vendor);
app.route("/stakeholder", stakeholderContact);
app.route("/category_product", router_category_product);
app.route("/auth", authUsers);
app.route("/v1/admin", adminController);
app.route("/users", router_users);
app.route("/task", TaskController);


app.get("/protected", verifyToken, async (c) => {
  const user = c.get("user"); // ✅ valid
  return c.json({ message: "Authorized", user });
});

router_users.get("/protected-route", verifyToken, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ status: 401, message: "Unauthorized" }, 401);
  }
  return c.json({ message: "This is a protected route", user });
});

const showRoutes = (app: Hono) => {
  app.routes.forEach((route) => {
    console.log(`${route.method} ${route.path}`);
  });
};


const startServer = (port = 3000) => {
  const server = createServer(async (req, res) => {
    if (staticHandler(req, res)) return;
    try {
      let body: BodyInit | null = null;
      if (req.method !== "GET" && req.method !== "HEAD") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }

      console.log(chalk.gray(`[${new Date().toISOString()}]`), chalk.cyan(req.method), chalk.green(req.url));

      if (body) {
        try {
          const parsed = JSON.parse(body.toString());
          console.log(chalk.yellow("Request body:"), chalk.white(JSON.stringify(parsed, null, 2)));
        } catch {
          console.log(chalk.yellow("Request body (raw):"), chalk.white(body.toString()));
        }
      }

      const request = new Request(`http://localhost:${port}${req.url}`, {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body: body,
      });

      const resp = await app.fetch(request);

      const statusColor = resp.status >= 400 ? chalk.red : chalk.green;
      console.log(chalk.magenta("Response status:"), statusColor(resp.status.toString()));

      resp.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      res.statusCode = resp.status;

      if (resp.body) {
        for await (const chunk of resp.body as any) {
          res.write(chunk);
        }
      }
      res.end();
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : "Unknown error");
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    showRoutes(app);
  });

  return server;
};

export { startServer };
