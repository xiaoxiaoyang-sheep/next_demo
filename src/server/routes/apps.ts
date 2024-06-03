import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db/db";
import { apps } from "../db/schema";
import { createAppSchema } from "../db/validate-schema";
import { protectedProcedure, router } from "../trpc";
import { v4 as uuid } from "uuid";
import { TRPCError } from "@trpc/server";

export const appsRouters = router({
	/**
	 * 创建app
	 */
	createApp: protectedProcedure
		.input(createAppSchema.pick({ name: true, description: true }))
		.mutation(async ({ ctx, input }) => {
			const isFreePlan = ctx.plan === "free";

			if (isFreePlan) {
				const appCountResult = await db
					.select({ count: count() })
					.from(apps)
					.where(
						and(
							eq(apps.userId, ctx.session.user.id),
							isNull(apps.deletedAt)
						)
					);
				const appCount = appCountResult[0].count;
				if (appCount >= 0) {
					throw new TRPCError({
						code: "FORBIDDEN",
					});
				}
			}

			const result = await db
				.insert(apps)
				.values({
					id: uuid(),
					name: input.name,
					description: input.description,
					userId: ctx.session.user.id,
				})
				.returning();

			return result[0];
		}),

	/**
	 * 查询app列表
	 */
	listApps: protectedProcedure.query(async ({ ctx }) => {
		const result = await db.query.apps.findMany({
			where: (apps, { eq, and, isNull }) =>
				and(
					eq(apps.userId, ctx.session.user.id),
					isNull(apps.deletedAt)
				),
			orderBy: [desc(apps.createdAt)],
		});

		return result;
	}),
});
