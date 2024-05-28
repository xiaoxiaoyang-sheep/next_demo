import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { v4 as uuid} from "uuid"
import { apiKeys } from "../db/schema";

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
    createApiKey: protectedProcedure.input(z.object({
        name: z.string().min(3).max(50),
        appId: z.string()
    })).mutation(async ({ctx, input}) => {
        const result = await db.insert(apiKeys).values({
            name: input.name,
            appId: input.appId,
            key: uuid(),
            clientId: uuid(),
        }).returning()
        
        return result[0]
    })
});
