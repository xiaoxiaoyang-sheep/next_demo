import { getServerSession } from "@/server/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import next from "next";

export async function createTRPCContext() {
	const session = await getServerSession();
	return {
		session,
	};
}

const t = initTRPC.context<typeof createTRPCContext>().create();

const { router, procedure } = t;

const middleware = t.middleware(async ({ ctx, next }) => {
	const start = Date.now();
	const result = await next();
	console.log(
		"%c [ api time ]-29",
		"font-size:13px; background:pink; color:#bf2c9f;",
		Date.now() - start
	);
	return result;
});

const checkLoginMiddleware = t.middleware(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({
			code: "FORBIDDEN",
		});
	}

	return next();
});

const loggedProcedure = procedure.use(middleware);

const protectedProcedure = procedure.use(checkLoginMiddleware);

export const testRouter = router({
	hello: loggedProcedure.query(async ({ ctx }) => {
		return {
			hello: "world!",
		};
	}),
});

export type TestRouter = typeof testRouter;
