import { apiKeyRouters } from "./routes/apiKey";
import { appsRouters } from "./routes/apps";
import { fileRoutes } from "./routes/file";
import { storageRouters } from "./routes/storage";
import { router } from "./trpc";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export const appRouter = router({
    file: fileRoutes,
    apps: appsRouters,
    storage: storageRouters,
    apiKey: apiKeyRouters
});

export type AppRouter = typeof appRouter;

export const serverCaller = createCallerFactory()(appRouter);
