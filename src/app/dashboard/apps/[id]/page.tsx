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
import { FilesOrderByColumn } from "@/server/routes/file";
import { MoveUp, MoveDown } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

export default function AppPage({
	params: { id: appId },
}: {
	params: { id: string };
}) {
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
	const [showDeleted, setShowDeleted] = useState(false);

	const [orderBy, setOrderBy] = useState<
		Exclude<FilesOrderByColumn, undefined>
	>({ field: "createdAt", order: "desc" });

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
		<div className=" mx-auto h-full">
			<div className="container flex justify-between items-center h-[60px]">
				<div className="flex items-center h-full gap-2">
					<Button
						onClick={() => {
							setOrderBy((current) => ({
								...current,
								order: current.order === "asc" ? "desc" : "asc",
							}));
						}}
					>
						Created At{" "}
						{orderBy.order === "desc" ? <MoveUp /> : <MoveDown />}
					</Button>
					<Switch
						id="show_deleted"
						onCheckedChange={(checked) => setShowDeleted(checked)}
					></Switch>
					<Label htmlFor="show_deleted">Show Deleted</Label>
				</div>

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
							<FileList
								uppy={uppy}
								orderBy={orderBy}
								showDeleted={showDeleted}
								appId={appId}
							></FileList>
						</>
					);
				}}
			</Dropzone>
			<UploadPreview uppy={uppy}></UploadPreview>
		</div>
	);
}