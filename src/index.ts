import { drizzle } from 'drizzle-orm/mysql2';
import 'dotenv/config';
import mysql from 'mysql2/promise';

export async function connectDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  });

  const db = drizzle(connection); 
}
