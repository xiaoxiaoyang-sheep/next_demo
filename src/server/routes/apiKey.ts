import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { v4 as uuid } from "uuid";
import { apiKeys } from "../db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const apiKeyRouters = router({
	/**
	 * 获取apiKey列表
	 */
	listApiKeys: protectedProcedure
		.input(
			z.object({
				appId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			return db.query.apiKeys.findMany({
				where: (apiKeys, { eq, and, isNull }) =>
					and(
						eq(apiKeys.appId, input.appId),
						isNull(apiKeys.deletedAt)
					),
			});
		}),

	/**
	 * 创建apiKey
	 */
	createApiKey: protectedProcedure
		.input(
			z.object({
				name: z.string().min(3).max(50),
				appId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const result = await db
				.insert(apiKeys)
				.values({
					name: input.name,
					appId: input.appId,
					key: uuid(),
					clientId: uuid(),
				})
				.returning();

			return result[0];
		}),

   

	/**
	 * 获取secret key
	 */
	requestKey: protectedProcedure
		.input(z.object({
            apiKeyId: z.number(),
            refresh: z.boolean().default(false)
        }))
		.mutation(async ({ input, ctx }) => {
            const {apiKeyId, refresh} = input

			const apiKey = await db.query.apiKeys.findFirst({
				where: (apiKeys, { eq, and, isNull }) =>
					and(eq(apiKeys.id, apiKeyId), isNull(apiKeys.deletedAt)),
				with: {
					app: true,
				},
			});

			if (apiKey?.app.userId !== ctx.session.user.id) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

            if(apiKey.havenShown && !refresh) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            if(!apiKey.havenShown) {
                await db.update(apiKeys).set({
                    havenShown: true
                }).where(eq(apiKeys.id, apiKey.id))
                return apiKey.key
            } else {
                const newKey = uuid()
                await db.update(apiKeys).set({
                    key: newKey,
                    havenShown: true
                }).where(eq(apiKeys.id, apiKey.id))
                return newKey
            }
		}),
});
