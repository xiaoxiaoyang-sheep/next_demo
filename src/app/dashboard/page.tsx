"use client";

import { createTRPCContext, serverCaller } from "@/utils/trpc";
import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useState } from "react";
import { useUppyState } from "./useUppyState";
import { Button } from "@/components/Button";
import { trpcPureClient } from "@/utils/api";

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

	return (
		<div className="h-screen flex justify-center items-center">
			<input
				type="file"
				onChange={(e) => {
					if (e.target.files) {
						Array.from(e.target.files).forEach((file) => {
							uppy.addFile({
								data: file,
							});
						});
					}
				}}
				multiple
			></input>
			{files.map((file) => {
				const url = URL.createObjectURL(file.data);
				return <img src={url} key={file.id}></img>;
			})}
			<Button onClick={() => {
				uppy.upload();
			}}>Upload</Button>
			<div>{progress}</div>
		</div>
	);
}
