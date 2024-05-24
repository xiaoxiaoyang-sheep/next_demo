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
import { desc, sql } from "drizzle-orm";
import { serverCaller } from "../router";
import { escape } from "querystring";

const bucket = "image-saas-1317906180";
const apiEndpoint = "https://cos.ap-nanjing.myqcloud.com";
const region = "ap-nanjing";
const COS_APP_ID = "AKID0xmmjXAct584tcVCmEl6LPGtbM2e8SaV";
const COS_APP_SECRET = "vz58BQbs7BAxnbKblokV3SwOhBmMtHVd";

export const fileRoutes = router({
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

	saveFile: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				path: z.string(),
				type: z.string(),
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

	listFiles: protectedProcedure.query(async () => {
		const result = await db.query.files.findMany({
			orderBy: [desc(files.createdAt)],
		});

		await Promise.all(
			result.map(async (file) => {
				const url = await serverCaller(
					{}
				).file.createDownloadPresignedUrl({
					key: decodeURIComponent(file.path),
				});
				file.url = url;
			})
		);

		return result;
	}),

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
			})
		)
		.query(async ({ input }) => {
			const { cursor, limit } = input;
        
			const result = await db
				.select()
				.from(files)
				.limit(limit)
				.where(
					cursor
						? sql`("files"."created_at", "files"."id") < (${new Date(
								cursor.createdAt
						  ).toISOString()}, ${cursor.id})`
						: undefined
				)
				.orderBy(desc(files.createdAt));

            await Promise.all(result.map(async (file) => {
				const url = await serverCaller(
					{}
				).file.createDownloadPresignedUrl({
					key: decodeURIComponent(file.path),
				});
				file.url = url;
			}))

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
});
