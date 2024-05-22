"use client";

import { ReactNode, useState } from "react";
import { trpcClientReact, trpcClient } from "@/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function TrpcProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<trpcClientReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpcClientReact.Provider>
	);
}
