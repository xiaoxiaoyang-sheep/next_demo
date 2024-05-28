import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { OpenRouter } from "@/server/open-router";


export const apiClient = createTRPCClient<OpenRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/trpc",
        }),
    ],
});

export {OpenRouter}
