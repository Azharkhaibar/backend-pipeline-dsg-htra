import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DBConnection } from "../../db/database/dbIndex";
import { SC_TASK } from "../../db/schema/sc_task";
import { z } from "zod";
import { verifyToken } from "../../middleware/jwtverifyadmin";

const DB = DBConnection();
export const TaskController = new Hono();

TaskController.use(verifyToken);

// GET /tasks

const TaskSchema = z.object({
  Todo: z.string().max(255).min(1, "harus isi boss"),
  isDone: z.boolean().default(false),
});

TaskController.post("/", zValidator("json", TaskSchema), async (c) => {
  const { Todo, isDone } = c.req.valid("json");
  const db = await DBConnection();

  // Ambil adminId dari context user yang login
  const adminId = c.get("user").adminId;
  if (!adminId) return c.json({ success: false, message: "Unauthorized" }, 401);

  const result = await db
    .insert(SC_TASK)
    .values({
      adminId,
      Todo,
      isDone,
    })
    .$returningId();

  return c.json({
    success: true,
    message: "Task created successfully",
    data: result[0],
  });
});

// GET /tasks
TaskController.get("/", async (c) => {
  const adminId = c.get("user").adminId;

  if (!adminId) return c.json({ success: false, message: "Unauthorized" }, 401);

  const db = await DBConnection();
  const rawTasks = await db.select().from(SC_TASK).where(eq(SC_TASK.adminId, adminId));

  const tasks = rawTasks.map((task) => ({
    ...task,
    id: task.id,
  }));

  return c.json({
    success: true,
    message: "Tasks fetched successfully",
    data: tasks,
  });
});

TaskController.patch("/:id", zValidator("json", TaskSchema), async (c) => {
  const taskId = Number(c.req.param("id"));
  const { Todo, isDone } = c.req.valid("json");
  const adminId = c.get("user").adminId;

  if (!adminId) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  if (!taskId || isNaN(taskId) || taskId < 1) {
    return c.json({ success: false, message: "Invalid task ID" }, 400);
  }

  const db = await DBConnection();

  const tasks = await db
    .select()
    .from(SC_TASK)
    .where(and(eq(SC_TASK.id, taskId), eq(SC_TASK.adminId, adminId)));

  const existingTask = tasks[0];

  if (!existingTask) {
    return c.json({ success: false, message: "Task not found or unauthorized" }, 404);
  }

  const result = await db.update(SC_TASK).set({ Todo, isDone }).where(eq(SC_TASK.id, taskId));

  return c.json({
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

TaskController.delete("/:id", async (c) => {
  const rawId = c.req.param("id");
  const taskId = Number(rawId);
  const adminId = c.get("user").adminId;

  if (!adminId) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  if (!taskId || isNaN(taskId) || taskId < 1) {
    return c.json({ success: false, message: "Invalid task ID" }, 400);
  }

  const db = await DBConnection();

  const tasks = await db
    .select()
    .from(SC_TASK)
    .where(and(eq(SC_TASK.id, taskId), eq(SC_TASK.adminId, adminId)));

  const existingTask = tasks[0];

  if (!existingTask) {
    return c.json({ success: false, message: "Task not found or unauthorized" }, 404);
  }

  await db.delete(SC_TASK).where(eq(SC_TASK.id, taskId));

  return c.json({
    success: true,
    message: "Task deleted successfully",
  });
});
