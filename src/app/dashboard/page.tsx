"use client";

import { createTRPCContext, serverCaller } from "@/utils/trpc";
import { Uppy } from "@uppy/core";
import type { UploadCallback, UploadSuccessCallback } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useState } from "react";
import { useUppyState } from "./useUppyState";
import { Button } from "@/components/ui/Button";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePasteFile } from "@/hooks/usePasteFile";
import { UploadPreview } from "@/components/feature/UploadPreview";
import { FileList } from "@/components/feature/FileList";

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

	usePasteFile({
		onFilePaste: (files) => {
			uppy.addFiles(
				files.map((file) => ({
					data: file,
				}))
			);
		},
	});

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<Button
					onClick={() => {
						uppy.upload();
					}}
				>
					Upload
				</Button>
				<UploadButton uppy={uppy}></UploadButton>
			</div>

			<Dropzone uppy={uppy} className=" relative">
				{(draging) => {
					return (
						<>
							{draging && (
								<div className=" absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center text-3xl">
									Drop File Here to Upload
								</div>
							)}
							<FileList uppy={uppy}></FileList>
						</>
					);
				}}
			</Dropzone>
			<UploadPreview uppy={uppy}></UploadPreview>
		</div>
	);
}
