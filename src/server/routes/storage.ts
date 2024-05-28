import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { apps, storageConfiguration } from "../db/schema";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const storageRouters = router({
	/**
	 * 获取仓库列表
	 */
	listStorages: protectedProcedure.query(async ({ ctx }) => {
		return db.query.storageConfiguration.findMany({
			where: (storage, { eq, and, isNull }) =>
				and(
					eq(storage.userId, ctx.session.user.id),
					isNull(storage.deletedAt)
				),
		});
	}),

	/**
	 * 创建仓库
	 */
	createStorage: protectedProcedure
		.input(
			z.object({
				name: z.string().min(3).max(50),
				bucket: z.string(),
				region: z.string(),
				accessKeyId: z.string(),
				secretAccessKey: z.string(),
				apiEndpoint: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { name, ...configuration } = input;

			const result = await db
				.insert(storageConfiguration)
				.values({
					name: name,
					configuration: configuration,
					userId: ctx.session.user.id,
				})
				.returning();

			return result[0];
		}),

    /**
     * 修改仓库
     */
    changeStorage: protectedProcedure.input(z.object({
        appId: z.string(),
        storageId: z.number()
    })).mutation(async ({ctx, input}) => {

        const storage = await db.query.storageConfiguration.findFirst({
           where: (storage, {eq}) => eq(storage.id, input.storageId) 
        })

        if(storage?.userId !== ctx.session.user.id) {
            throw new TRPCError({
                code: "FORBIDDEN"
            })
        }

        await db.update(apps).set({
            storageId: input.storageId
        }).where(and(
            eq(apps.id, input.appId),
            eq(apps.userId, ctx.session.user.id)
        ))
    })
});
