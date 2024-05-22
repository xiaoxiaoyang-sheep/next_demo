import { initTRPC } from "@trpc/server";


const t = initTRPC.create();

const { router, procedure } = t;

export const testRouter = router({
	hello: procedure.query(() => {
		return {
			hello: "world!",
		};
	}),
});

export type TestRouter = typeof testRouter;