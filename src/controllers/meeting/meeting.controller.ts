import { like, eq, and } from "drizzle-orm";
import { SC_MEETING, sc_default_meeting_table } from "../../db/schema/sc_meeting";
import { Hono } from "hono";
import { z } from 'zod';
import { asc, desc } from "drizzle-orm";
import { DBConnection } from "../../db/database/dbIndex";
import { zValidator } from "@hono/zod-validator";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
export const meetingController = new Hono();

meetingController.get(
    '/',
    zValidator(
        'query',
        z.object({
            limit: z.coerce.number().min(1).optional(),
            sort: z.enum(['asc', 'desc']).optional().default('asc'),
        })
    ),
    async (c) => {
        try {
            const { limit, sort } = c.req.valid('query');
            const db = await DBConnection();

            let query = db
                .select()
                .from(SC_MEETING)
                .orderBy(sort === 'asc' ? asc(SC_MEETING.meetingId) : desc(SC_MEETING.meetingId));

            return c.json({
                status: 200,
                data: query,
                message: 'berhasil'
            }, 200)
        } catch (error) {
            console.error('[Meeting GET error]', error);
            return c.json(
                { status: 500, message: 'Terjadi kesalahan server', error: String(error) },
                500
            );
        }
    }
);

