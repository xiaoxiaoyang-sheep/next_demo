import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { OpenRouter } from "./open-router-dts";


export const apiClient = createTRPCClient<OpenRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/open",
        }),
    ],
});

export const createApiClient = ({apiKey, signedToken}: {apiKey?: string, signedToken?: string}) => {
    const header: Record<string, string> = {}

    if(apiKey) {
        header["api-key"] = apiKey
    }
    if(signedToken) {
        header["signed-token"] = signedToken
    }

    return createTRPCClient<OpenRouter>({
        links: [
            httpBatchLink({
                url: "http://localhost:3000/api/open",
                headers: header
            }),
        ],
    });
}
