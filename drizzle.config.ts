import { defineConfig } from "drizzle-kit";

export default defineConfig({
   schema: "./src/server/db/schema.ts",
   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
   dbCredentials: {
     user: "postgres",
     password: "root",
     host: "localhost",
     port: 5432,
     database: "postgres",
   },
   verbose: true,
   strict: true,
 });