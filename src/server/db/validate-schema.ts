import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./schema";

export const insertUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email.email()
})

export const updateUserSchema = insertUserSchema.pick({email :true})


export const queryUserSchema = createSelectSchema(users)