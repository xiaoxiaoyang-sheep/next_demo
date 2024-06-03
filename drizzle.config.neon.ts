import { defineConfig } from "drizzle-kit";

export default defineConfig({
   schema: "./src/server/db/schema.ts",
   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
   dbCredentials: {
    url: "postgresql://images_owner:KbwtLvH3Vam2@ep-little-mud-a1ce2qu4.ap-southeast-1.aws.neon.tech/images?sslmode=require"
   },
   verbose: true,
   strict: true,
 });