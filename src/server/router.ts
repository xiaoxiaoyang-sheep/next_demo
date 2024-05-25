import { appsRouter } from "./routes/apps";
import { fileRoutes } from "./routes/file";
import { router } from "./trpc";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export const appRouter = router({
    file: fileRoutes,
    apps: appsRouter
});

export type AppRouter = typeof appRouter;

export const serverCaller = createCallerFactory()(appRouter);
