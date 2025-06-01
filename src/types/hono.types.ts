// hono.d.ts
import 'hono';
import { Context } from 'hono';

export interface AdminTokenPayload {
  adminId: number;
  email: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AdminTokenPayload; 
  }
}

// Export the enhanced Context type
export type HonoContext = Context;