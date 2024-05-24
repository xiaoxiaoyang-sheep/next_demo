import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// for query purposes
const queryClient = postgres("postgres://postgres:root@localhost:5432/postgres");

export const db = drizzle(queryClient, { schema });
