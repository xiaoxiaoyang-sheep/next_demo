import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { TestRouter } from "./trpc";
import { AppRouter } from "@/server/router";


export const trpcClientReact = createTRPCReact<AppRouter>();

export const trpcClient = trpcClientReact.createClient({
	links: [
		httpBatchLink({
			url: "http://localhost:3000/api/trpc",
		}),
	],
});

export const trpcPureClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/trpc",
        }),
    ],
});
