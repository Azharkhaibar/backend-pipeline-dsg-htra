// lib/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URL_PATH = process.env;

if (!("DATABASE_URL" in DATABASE_URL_PATH)) {
  throw new Error("Database koneksi URL nya kgk ada");
}

export const DBConnection = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);
  return drizzle(connection);
};
