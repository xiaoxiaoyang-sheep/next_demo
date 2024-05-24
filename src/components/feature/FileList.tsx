import { useUppyState } from "@/app/dashboard/useUppyState";
import { cn } from "@/lib/utils";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import Uppy, { UploadCallback, UploadSuccessCallback } from "@uppy/core";
import { useEffect, useState } from "react";
import Image from "next/image";

export function FileList({ uppy }: { uppy: Uppy }) {

    const { data: fileList, isPending } =
		trpcClientReact.file.listFiles.useQuery();

	const utils = trpcClientReact.useUtils();

	const [uploadingFileIDs, setUploadingFileIDs] = useState<string[]>([]);
	const uppyFiles = useUppyState(uppy, (s) => s.files);

	

	useEffect(() => {
		const handler: UploadSuccessCallback<{}> = (file, resp) => {
			if (file) {
				trpcPureClient.file.saveFile
					.mutate({
						name:
							file.data instanceof File ? file.data.name : "test",
						path: resp.uploadURL ?? "",
						type: file.data.type,
					})
					.then(async (resp) => {
						const presignedUrl =
							await trpcPureClient.file.createDownloadPresignedUrl.query(
								{
									key: decodeURIComponent(resp.path),
								}
							);
						resp.url = presignedUrl;

						console.log(resp);

						utils.file.listFiles.setData(void 0, (prev) => {
							if (!prev) {
								return prev;
							}
							return [resp, ...prev];
						});
					});
			}
		};

		const uploadProgressHandler: UploadCallback = (data) => {
			setUploadingFileIDs((currentFiles) => [
				...data.fileIDs,
				...currentFiles,
			]);
		};

		const completeHandler = () => {
			setUploadingFileIDs([]);
		};

		uppy.on("upload-success", handler);
		uppy.on("upload", uploadProgressHandler);
		uppy.on("complete", completeHandler);

		return () => {
			uppy.off("upload-success", handler);
			uppy.off("upload", uploadProgressHandler);
			uppy.off("complete", completeHandler);
		};
	}, [uppy, utils]);

	return (
		<>
			{isPending && <div>Loading</div>}
			<div
				className={cn(
					"flex flex-wrap gap-4 relative",
				)}
			>
				
				{uploadingFileIDs.length > 0 &&
					uploadingFileIDs.map((id) => {
						const file = uppyFiles[id];
						const isImage = file.data.type.startsWith("image");
						const url = URL.createObjectURL(file.data);
						return (
							<div
								key={file.id}
								className="w-56 h-56 flex justify-center items-center border border-red-500"
							>
								{isImage ? (
									<img
										className=" max-h-[13.9rem] max-w-[13.9rem]"
										src={url}
										alt={file.name}
									/>
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
				{fileList?.map((file) => {
					const isImage = file.contentType.startsWith("image");
					return (
						<div className=" w-56 h-56 flex justify-center items-center border">
							{isImage ? (
								<img
									className=" max-h-[13.9rem] max-w-[13.9rem]"
									draggable={false}
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
		</>
	);
}
