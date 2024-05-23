import { getServerSession } from "@/server/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import { Session } from "next-auth";

const t = initTRPC.context().create();

const { router, procedure } = t;

export const withLoggerProcedure = procedure.use(async ({ ctx, next }) => {
	const start = Date.now();

	const result = await next();

	console.log("----> Api Time", Date.now());
	return result;
});

export const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
	const session = await getServerSession();

	return next({
		ctx: {
			session,
		},
	});
});

export const protectedProcedure = withLoggerProcedure
	.use(withSessionMiddleware)
	.use(async ({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({
				code: "FORBIDDEN",
			});
		}
		return next({
			ctx: {
				session: ctx.session!,
			},
		});
	});

export { router };
