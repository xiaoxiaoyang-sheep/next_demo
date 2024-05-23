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
import Image from "next/image";

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

	return (
		<div className="container mx-auto">
			<div>
				<UploadButton uppy={uppy}></UploadButton>
			</div>
			{isPending && <div>Loading</div>}
			<div className=" flex flex-wrap gap-4">
				{fileList?.map((file) => {
					const isImage = file.contentType.startsWith("image");
					return (
						<div className=" w-56 h-56 flex justify-center items-center border">
							{isImage ? (
								<img src={file.url} alt={file.name}></img>
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
			<Button
				onClick={() => {
					uppy.upload();
				}}
			>
				Upload
			</Button>
			<div>{progress}</div>
		</div>
	);
}
