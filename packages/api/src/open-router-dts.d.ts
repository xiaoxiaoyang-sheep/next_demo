import * as postgres from 'postgres';
import * as _trpc_server_unstable_core_do_not_import from '@trpc/server/unstable-core-do-not-import';

declare const openRouter: _trpc_server_unstable_core_do_not_import.BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, _trpc_server_unstable_core_do_not_import.DecorateCreateRouterOptions<{
    file: _trpc_server_unstable_core_do_not_import.BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape;
        transformer: false;
    }, {
        createPresignedUrl: _trpc_server_unstable_core_do_not_import.MutationProcedure<{
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
        }>;
        saveFile: _trpc_server_unstable_core_do_not_import.MutationProcedure<{
            input: {
                name: string;
                type: string;
                path: string;
                appId: string;
            };
            output: {
                id: string;
                name: string;
                createdAt: Date | null;
                type: string;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            };
        }>;
        listFiles: _trpc_server_unstable_core_do_not_import.QueryProcedure<{
            input: {
                appId: string;
            };
            output: {
                id: string;
                name: string;
                createdAt: Date | null;
                type: string;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            }[];
        }>;
        infinityQueryFiles: _trpc_server_unstable_core_do_not_import.QueryProcedure<{
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
                    id: string;
                    name: string;
                    createdAt: Date | null;
                    type: string;
                    deletedAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                nextCursor: {
                    createdAt: Date;
                    id: string;
                } | null;
            };
        }>;
        deleteFile: _trpc_server_unstable_core_do_not_import.MutationProcedure<{
            input: string;
            output: postgres.RowList<never[]>;
        }>;
    }>;
}>>;
type OpenRouter = typeof openRouter;

export type { OpenRouter };
