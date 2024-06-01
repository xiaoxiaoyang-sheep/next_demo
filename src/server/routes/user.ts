import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc";

export const userRouters = router({
	/**
	 * 获取plan
	 */
	getPlan: protectedProcedure.query(async ({ ctx }) => {
        const result = await db.query.users.findFirst({
            where: (users, {eq}) => eq(users.id, ctx.session.user.id),
            columns: {
                plan: true
            }
        })
		return result?.plan
	}),
});
