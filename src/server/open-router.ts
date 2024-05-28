
import { fileRoutes } from "./routes/file";
import { router } from "./trpc";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export const openRouter = router({
    file: fileRoutes,
});

export type OpenRouter = typeof openRouter;

export const openServerCaller = createCallerFactory()(openRouter);
