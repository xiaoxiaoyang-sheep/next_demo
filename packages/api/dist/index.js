import { createTRPCClient, httpBatchLink } from "@trpc/client";
export const apiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/open",
        }),
    ],
});
export const createApiClient = ({ apiKey, signedToken }) => {
    const header = {};
    if (apiKey) {
        header["api-key"] = apiKey;
    }
    if (signedToken) {
        header["signed-token"] = signedToken;
    }
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: "http://localhost:3000/api/open",
                headers: header
            }),
        ],
    });
};
