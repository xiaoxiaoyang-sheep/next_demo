"use client";

import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { trpcPureClient } from "@/utils/api";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
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
		<div className=" mx-auto h-screen">
			<div className="container flex justify-between items-center h-[60px]">
				<Button
					onClick={() => {
						uppy.upload();
					}}
				>
					Upload
				</Button>
				<UploadButton uppy={uppy}></UploadButton>
			</div>

			<Dropzone uppy={uppy} className=" relative h-[calc(100%-60px)]">
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
