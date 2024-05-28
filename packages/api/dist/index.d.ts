export declare const apiClient: {
    file: {
        createPresignedUrl: {
            mutate: import("@trpc/client").Resolver<{
                input: {
                    contentType: string;
                    appId: string;
                    filename: string;
                    size: number;
                };
                output: {
                    url: string;
                    method: "PUT";
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        saveFile: {
            mutate: import("@trpc/client").Resolver<{
                input: {
                    name: string;
                    type: string;
                    path: string;
                    appId: string;
                };
                output: {
                    type: string;
                    url: string;
                    id: string;
                    name: string;
                    createdAt: string | null;
                    deletedAt: string | null;
                    path: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        listFiles: {
            query: import("@trpc/client").Resolver<{
                input: {
                    appId: string;
                };
                output: {
                    type: string;
                    url: string;
                    id: string;
                    name: string;
                    createdAt: string | null;
                    deletedAt: string | null;
                    path: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        infinityQueryFiles: {
            query: import("@trpc/client").Resolver<{
                input: {
                    appId: string;
                    orderBy?: {
                        field: "createdAt" | "deletedAt";
                        order: "desc" | "asc";
                    } | undefined;
                    limit?: number | undefined;
                    cursor?: {
                        id: string;
                        createdAt: string;
                    } | undefined;
                    showDeleted?: boolean | undefined;
                };
                output: {
                    items: {
                        type: string;
                        url: string;
                        id: string;
                        name: string;
                        createdAt: string | null;
                        deletedAt: string | null;
                        path: string;
                        userId: string;
                        contentType: string;
                        appId: string;
                    }[];
                    nextCursor: {
                        id: string;
                        createdAt: string;
                    } | null;
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        deleteFile: {
            mutate: import("@trpc/client").Resolver<{
                input: string;
                output: never[];
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
    };
};
export declare const createApiClient: ({ apiKey, signedToken }: {
    apiKey?: string;
    signedToken?: string;
}) => {
    file: {
        createPresignedUrl: {
            mutate: import("@trpc/client").Resolver<{
                input: {
                    contentType: string;
                    appId: string;
                    filename: string;
                    size: number;
                };
                output: {
                    url: string;
                    method: "PUT";
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        saveFile: {
            mutate: import("@trpc/client").Resolver<{
                input: {
                    name: string;
                    type: string;
                    path: string;
                    appId: string;
                };
                output: {
                    type: string;
                    url: string;
                    id: string;
                    name: string;
                    createdAt: string | null;
                    deletedAt: string | null;
                    path: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        listFiles: {
            query: import("@trpc/client").Resolver<{
                input: {
                    appId: string;
                };
                output: {
                    type: string;
                    url: string;
                    id: string;
                    name: string;
                    createdAt: string | null;
                    deletedAt: string | null;
                    path: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        infinityQueryFiles: {
            query: import("@trpc/client").Resolver<{
                input: {
                    appId: string;
                    orderBy?: {
                        field: "createdAt" | "deletedAt";
                        order: "desc" | "asc";
                    } | undefined;
                    limit?: number | undefined;
                    cursor?: {
                        id: string;
                        createdAt: string;
                    } | undefined;
                    showDeleted?: boolean | undefined;
                };
                output: {
                    items: {
                        type: string;
                        url: string;
                        id: string;
                        name: string;
                        createdAt: string | null;
                        deletedAt: string | null;
                        path: string;
                        userId: string;
                        contentType: string;
                        appId: string;
                    }[];
                    nextCursor: {
                        id: string;
                        createdAt: string;
                    } | null;
                };
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
        deleteFile: {
            mutate: import("@trpc/client").Resolver<{
                input: string;
                output: never[];
                errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
                transformer: false;
            }>;
        };
    };
};
