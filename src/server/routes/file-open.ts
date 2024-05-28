import { withAppProcedure, router } from "../trpc";
import z from "zod";
import {
	S3Client,
	PutObjectCommand,
	PutObjectCommandInput,
	GetObjectCommand,
	GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { db } from "../db/db";
import { apps, files } from "../db/schema";
import { desc, sql, asc, eq, isNull, and } from "drizzle-orm";
import { serverCaller } from "../router";
import { escape } from "querystring";
import { filesCanOrderByColumns } from "../db/validate-schema";
import { TRPCError } from "@trpc/server";

const filesOrderByColumnSchema = z
	.object({
		field: filesCanOrderByColumns.keyof(),
		order: z.enum(["desc", "asc"]),
	})
	.optional();

export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>;

export const fileOpenRoutes = router({
	/**
	 * 上传文件预签名
	 */
	createPresignedUrl: withAppProcedure
		.input(
			z.object({
				filename: z.string(),
				contentType: z.string(),
				size: z.number(),
                appId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const date = new Date();

			const isoString = date.toISOString();
			const dateString = isoString.split("T")[0];

            const {app} = ctx


            if(!app || !app.storage) {
                throw new TRPCError({
                    code: "BAD_REQUEST"
                })
            }

            if(app.userId !== ctx.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN"
                })
            }

            const storage = app.storage

			const params: PutObjectCommandInput = {
				Bucket: storage.configuration.bucket,
				Key: `${dateString}/${input.filename.replaceAll(" ", "_")}`,
				ContentType: input.contentType,
				ContentLength: input.size,
			};

			const s3Client = new S3Client({
				endpoint: storage.configuration.apiEndpoint,
				region: storage.configuration.region,
				credentials: {
					accessKeyId: storage.configuration.accessKeyId,
					secretAccessKey: storage.configuration.secretAccessKey,
				},
			});

			const command = new PutObjectCommand(params);
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: 60,
			});

			return {
				url,
				method: "PUT" as const,
			};
		}),


	/**
	 * 保存文件到数据库
	 */
	saveFile: withAppProcedure
		.input(
			z.object({
				name: z.string(),
				path: z.string(),
				type: z.string(),
				appId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx;
			const url = new URL(input.path);

			const photo = await db
				.insert(files)
				.values({
					...input,
					id: uuid(),
					path: url.pathname,
					url: url.toString(),
					userId: user.id,
					contentType: input.type,
				})
				.returning();

			return photo[0];
		}),

	/**
	 * 读取数据库索引文件
	 */
	listFiles: withAppProcedure
		.input(
			z.object({
				appId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const result = await db.query.files.findMany({
				orderBy: [desc(files.createdAt)],
				where: (files, { eq }) =>
					and(
						eq(files.userId, ctx.user.id),
						eq(files.appId, input.appId)
					),
			});


			return result;
		}),

	/**
	 * 分页读取文件
	 */
	infinityQueryFiles: withAppProcedure
		.input(
			z.object({
				cursor: z
					.object({
						id: z.string(),
						createdAt: z.string(),
					})
					.optional(),
				limit: z.number().default(10),
				orderBy: filesOrderByColumnSchema,
				showDeleted: z.boolean().default(false),
				appId: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const {
				cursor,
				limit,
				orderBy = { field: "createdAt", order: "desc" },
				showDeleted,
				appId,
			} = input;

			const deletedFilter = showDeleted
				? undefined
				: isNull(files.deletedAt);
			const userFilter = eq(files.userId, ctx.user.id);
			const appFilter = eq(files.appId, appId);
			const cursorFilter = cursor
				? orderBy.order === "desc"
					? sql`("files"."created_at", "files"."id") < (${new Date(
							cursor.createdAt
					  ).toISOString()}, ${cursor!.id})`
					: sql`("files"."created_at", "files"."id") > (${new Date(
							cursor.createdAt
					  ).toISOString()}, ${cursor!.id})`
				: undefined;

			const statement = db
				.select()
				.from(files)
				.limit(limit)
				.where(
					cursor
						? and(
								cursorFilter,
								deletedFilter,
								userFilter,
								appFilter
						  )
						: and(deletedFilter, userFilter, appFilter)
				);

			statement.orderBy(
				orderBy.order === "desc"
					? desc(files[orderBy.field])
					: asc(files[orderBy.field])
			);

			const result = await statement;

			return {
				items: result,
				nextCursor:
					result.length > 0
						? {
								createdAt: result[result.length - 1].createdAt!,
								id: result[result.length - 1].id,
						  }
						: null,
			};
		}),

	/**
	 * 删除文件
	 */
	deleteFile: withAppProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return db
				.update(files)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(files.id, input));
		}),
});
