import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/router";


export const trpcClientReact = createTRPCReact<AppRouter>();

export const trpcClient = trpcClientReact.createClient({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});

export const trpcPureClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
        }),
    ],
});
