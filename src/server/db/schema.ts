import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	date,
	uuid,
	varchar,
	index,
	serial,
	json,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	createdAt: date("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	files: many(files),
	apps: many(apps),
	storages: many(storageConfiguration),
}));

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	})
);

export const files = pgTable(
	"files",
	{
		id: uuid("id").notNull().primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		type: varchar("type", { length: 100 }).notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
		path: varchar("path", { length: 1024 }).notNull(),
		url: varchar("url", { length: 1024 }).notNull(),
		userId: text("user_id").notNull(),
		contentType: varchar("content_type", { length: 100 }).notNull(),
		appId: uuid("app_id").notNull(),
	},
	(table) => ({
		cursorIdx: index("cursor_idx").on(table.id, table.createdAt),
	})
);

export const filesRelations = relations(files, ({ one }) => ({
	files: one(users, { fields: [files.userId], references: [users.id] }),
	app: one(apps, { fields: [files.appId], references: [apps.id] }),
}));

export const apps = pgTable("apps", {
	id: uuid("id").notNull().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 500 }),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
	userId: text("user_id").notNull(),
	storageId: integer("storage_id"),
});

export const appRelations = relations(apps, ({ one, many }) => ({
	user: one(users, { fields: [apps.userId], references: [users.id] }),
	storage: one(storageConfiguration, {
		fields: [apps.storageId],
		references: [storageConfiguration.id],
	}),
	files: many(files),
	apiKeys: many(apiKeys),
}));

export type S3StorageConfiguration = {
	bucket: string;
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	apiEndpoint?: string;
};

export type StorageConfiguration = S3StorageConfiguration;

export const storageConfiguration = pgTable("storageConfiguration", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	userId: uuid("user_id").notNull(),
	configuration: json("configuration")
		.$type<StorageConfiguration>()
		.notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const storageConfigurationRelations = relations(
	storageConfiguration,
	({ one }) => ({
		user: one(users, {
			fields: [storageConfiguration.userId],
			references: [users.id],
		}),
	})
);

export const apiKeys = pgTable("apiKeys", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	clientId: varchar("client_id", {length: 100}).notNull().unique(),
	key: varchar("key", { length: 100 }).notNull().unique(),
	appId: uuid("app_id").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
	app: one(apps, { fields: [apiKeys.appId], references: [apps.id] }),
}));
