import { protectedProcedure, router } from "../trpc";
import z from "zod";
import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = "image-saas-1317906180";
const apiEndpoint = "https://cos.ap-nanjing.myqcloud.com";
const region = "ap-nanjing";
const COS_APP_ID = "AKID0xmmjXAct584tcVCmEl6LPGtbM2e8SaV";
const COS_APP_SECRET = "vz58BQbs7BAxnbKblokV3SwOhBmMtHVd";

export const fileRoutes = router({
    createPresignedUrl: protectedProcedure.input(
        z.object({
            filename: z.string(),
            contentType: z.string(),
            size: z.number(),
        })
    ).mutation(async ({ctx, input}) => {
        const date = new Date();

        const isoString = date.toISOString();
        const dateString = isoString.split("T")[0];

        const params: PutObjectCommandInput = {
            Bucket: bucket,
            Key: `${dateString}/${input.filename.replaceAll(" ", "_")}`,
            ContentType: input.contentType,
            ContentLength: input.size,
        }

        const s3Client = new S3Client({
            endpoint: apiEndpoint,
            region: region,
            credentials: {
                accessKeyId: COS_APP_ID,
                secretAccessKey: COS_APP_SECRET,
            }
        })

        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60
        })

        return {
            url,
            method: "PUT" as const
        }
    })
})