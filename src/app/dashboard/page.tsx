"use client";

import { createTRPCContext, serverCaller } from "@/utils/trpc";
import { Uppy } from "@uppy/core";
import type { UploadSuccessCallback } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useState } from "react";
import { useUppyState } from "./useUppyState";
import { Button } from "@/components/Button";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePasteFile } from "@/hooks/usePasteFile";

export default function Home() {
	const [uppy] = useState(() => {
		const uppy = new Uppy();
		uppy.use(AWSS3, {
			shouldUseMultipart: false,
			getUploadParameters(file) {
				return trpcPureClient.file.createPresignedUrl.mutate({
					filename:
						file.data instanceof File ? file.data.name : "test",
					contentType: file.data.type || "",
					size: file.size,
				});
			},
		});
		return uppy;
	});

	const files = useUppyState(uppy, (s) => Object.values(s.files));
	const progress = useUppyState(uppy, (s) => s.totalProgress);

	useEffect(() => {
		const handler: UploadSuccessCallback<{}> = (file, resp) => {
			if (file) {
				console.log(file, resp);
				
				trpcPureClient.file.saveFile.mutate({
					name: file.data instanceof File ? file.data.name : "test",
					path: resp.uploadURL ?? "",
					type: file.data.type,
				});
			}
		};
		uppy.on("upload-success", handler);

		return () => {
			uppy.off("upload-success", handler);
		};
	}, [uppy]);

	const { data: fileList, isPending } =
		trpcClientReact.file.listFiles.useQuery();


	usePasteFile({onFilePaste: (files) => {
		uppy.addFiles(files.map((file) => ({
			data: file
		})))
	}})

	return (
		<div className="container mx-auto p-4">
			<div>
				<UploadButton uppy={uppy}></UploadButton>
				<Button
					onClick={() => {
						uppy.upload();
					}}
				>
					Upload
				</Button>
			</div>
			{isPending && <div>Loading</div>}
			<Dropzone uppy={uppy}>
				{(draging) => (
					<div className={cn(
						"flex flex-wrap gap-4 relative",
						draging && " border border-dashed"
					)}>
						{
							draging && <div className=" absolute inset-0 bg-secondary/30 flex justify-center items-center text-3xl">Drop File Here to Upload</div>
						}
						{fileList?.map((file) => {
							const isImage =
								file.contentType.startsWith("image");
							return (
								<div className=" w-56 h-56 flex justify-center items-center border">
									{isImage ? (
										<img
											className=" max-h-56 max-w-56"
											src={file.url}
											alt={file.name}
										></img>
									) : (
										<Image
											src="/unknown-file-types.png"
											alt="unknow file type"
											width={100}
											height={100}
										></Image>
									)}
								</div>
							);
						})}
					</div>
				)}
			</Dropzone>

			<div>{progress}</div>
		</div>
	);
}
