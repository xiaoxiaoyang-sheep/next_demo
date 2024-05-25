import { protectedProcedure, router } from "../trpc";
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
import { files } from "../db/schema";
import { desc, sql, asc, eq, isNull, and } from "drizzle-orm";
import { serverCaller } from "../router";
import { escape } from "querystring";
import { filesCanOrderByColumns } from "../db/validate-schema";

const bucket = "image-saas-1317906180";
const apiEndpoint = "https://cos.ap-nanjing.myqcloud.com";
const region = "ap-nanjing";
const COS_APP_ID = "AKID0xmmjXAct584tcVCmEl6LPGtbM2e8SaV";
const COS_APP_SECRET = "vz58BQbs7BAxnbKblokV3SwOhBmMtHVd";

const filesOrderByColumnSchema = z
	.object({
		field: filesCanOrderByColumns.keyof(),
		order: z.enum(["desc", "asc"]),
	})
	.optional();

export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>;

export const fileRoutes = router({
	/**
	 * 上传文件预签名
	 */
	createPresignedUrl: protectedProcedure
		.input(
			z.object({
				filename: z.string(),
				contentType: z.string(),
				size: z.number(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const date = new Date();

			const isoString = date.toISOString();
			const dateString = isoString.split("T")[0];

			const params: PutObjectCommandInput = {
				Bucket: bucket,
				Key: `${dateString}/${input.filename.replaceAll(" ", "_")}`,
				ContentType: input.contentType,
				ContentLength: input.size,
			};

			const s3Client = new S3Client({
				endpoint: apiEndpoint,
				region: region,
				credentials: {
					accessKeyId: COS_APP_ID,
					secretAccessKey: COS_APP_SECRET,
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
	 * 读取文件预签名
	 */
	createDownloadPresignedUrl: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			})
		)
		.query(async ({ input }) => {
			const params: GetObjectCommandInput = {
				Bucket: bucket,
				Key: input.key,
			};

			const s3Client = new S3Client({
				endpoint: apiEndpoint,
				region: region,
				credentials: {
					accessKeyId: COS_APP_ID,
					secretAccessKey: COS_APP_SECRET,
				},
			});

			const command = new GetObjectCommand(params);
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: 60,
			});

			return url;
		}),

	/**
	 * 保存文件到数据库
	 */
	saveFile: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				path: z.string(),
				type: z.string(),
				appId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { session } = ctx;
			const url = new URL(input.path);

			const photo = await db
				.insert(files)
				.values({
					...input,
					id: uuid(),
					path: url.pathname,
					url: url.toString(),
					userId: session.user.id,
					contentType: input.type,
				})
				.returning();

			return photo[0];
		}),

	/**
	 * 读取数据库索引文件
	 */
	listFiles: protectedProcedure
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
						eq(files.userId, ctx.session.user.id),
						eq(files.appId, input.appId)
					),
			});

			// await Promise.all(
			// 	result.map(async (file) => {
			// 		const url = await serverCaller(
			// 			{}
			// 		).file.createDownloadPresignedUrl({
			// 			key: decodeURIComponent(file.path),
			// 		});
			// 		file.url = url;
			// 	})
			// );

			return result;
		}),

	/**
	 * 分页读取文件
	 */
	infinityQueryFiles: protectedProcedure
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
			const userFilter = eq(files.userId, ctx.session.user.id);
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
	deleteFile: protectedProcedure
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
