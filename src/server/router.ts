import { fileRoutes } from "./routes/file";
import { router } from "./trpc";

export const appRouter = router({
    file: fileRoutes,
});

export type AppRouter = typeof appRouter;
