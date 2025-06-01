import { asc, desc, eq, like } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { coerce, z } from "zod";
import { DBConnection } from "../../db/database/dbIndex";
import { SC_TODO_LIST } from "../../db/schema/sc_todo";
import { Hono } from "hono";
import { off } from "process";
import { error } from "console";

export const MeetingController = new Hono();

// MeetingController.get('/',
//     zValidator('query',
//         z.object({
//             substr: z.string().optional(),
//             limit: z.coerce.number().min(0)
//             .max(100).optional().default(10),
//             offset: z.coerce.number().min(0).optional().default(0),
//             sort: z.enum(['asc', 'desc']).optional().default('asc')
//         })
//     ), async (c) => {
//         try {
//             const { substr, limit, offset, sort } = c.req.valid('query');
//             const DB = await DBConnection()
//             const fetchBD = await DB.select().from(SC_TODO_LIST)
//             let srch = DB.select().from(SC_TODO_LIST).$dynamic();
//             if (substr) {
//                 z = srch.where(like(SC_TODO_LIST.todoStatus, `%${substr}%`));
//             }

//             z = srch.limit(limit).offset(offset).orderBy( sort === 'asc' ? asc(SC_TODO_LIST.todoPriority : desc(SC_TODO_LIST.todoPriority)));
//             return z
//         } catch (err) {
//             console.error(err);
//             return c.json({ success: false, data: null, status: 500})

//         }
//     }
// )

MeetingController.delete("/:id", async (c) => {
  try {
    const DB = await DBConnection();
    const todoId = Number(c.req.param("id"));

    // Cek apakah data dengan ID tersebut ada
    const existing = await DB.select().from(SC_TODO_LIST).where(eq(SC_TODO_LIST.TodoId, todoId));

    if (existing.length === 0) {
      return c.json({
        success: false,
        data: null,
        status: 404,
        message: "Todo not found",
      });
    }

    // Hapus data
    const result = await DB.delete(SC_TODO_LIST).where(eq(SC_TODO_LIST.TodoId, todoId));

    if (result.affectedRows === 0) {
      return c.json({
        success: false,
        data: null,
        status: 500,
        message: "Failed to delete todo",
      });
    }

    return c.json({
      success: true,
      data: null,
      status: 200,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return c.json({
      success: false,
      data: null,
      status: 500,
      message: "Internal server error",
    });
  }
});
