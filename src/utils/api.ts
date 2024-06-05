import { TRPCClientError, createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/router";
import { TRPCError } from "@trpc/server";

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

export function isTRPCClientError(
	cause: unknown
): cause is TRPCClientError<AppRouter> {
	return cause instanceof TRPCClientError;
}

export function isTRPCError(
	cause: unknown
): cause is TRPCError {
	return cause instanceof TRPCError;
}

