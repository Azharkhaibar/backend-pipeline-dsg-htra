import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { usersTable } from "../schema/sc_users";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
dotenv.config({
  path: ".env"
});

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

interface UserSeedData {
    id: string;
    namaDepan: string;
    namaBelakang: string;
    fullname: string;
    email: string;
    password: string;
    createAt: Date;
    updateAt: Date;
    lastLoginAt: Date | null;
  }

const mainSeed = async () => {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);
    const dataUserSeed: UserSeedData[] = [];
    for (let i = 0; i < 15; i++) {
      dataUserSeed.push({
        id: faker.name.firstName() ,
        namaDepan: faker.name.firstName(),
        namaBelakang: faker.name.lastName(),
        fullname: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createAt: new Date(),
        updateAt: new Date(),
        lastLoginAt: null,
      });
    }

    console.log('Seeding data...');
    await Promise.all(
      dataUserSeed.map(async (user) => {
        await db.insert(usersTable).values(dataUserSeed);
      })
    );

    console.log("Seeding data completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

mainSeed();
