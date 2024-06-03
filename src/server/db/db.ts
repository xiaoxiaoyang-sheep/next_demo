import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { drizzle as drizzleHTTP } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

function createDB() {
	const neonDBUrl = process.env.NEON_DB_URL;

	if (neonDBUrl) {
		const client = neon(neonDBUrl);

		return drizzleHTTP(client, { schema });
	} else {
		// for query purposes
		const queryClient = postgres(
			"postgres://postgres:123123@localhost:5432/postgres"
		);

		return drizzle(queryClient, { schema, logger: false });
	}
}

export const db = createDB();
