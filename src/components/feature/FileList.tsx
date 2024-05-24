import { useUppyState } from "@/app/dashboard/useUppyState";
import { cn } from "@/lib/utils";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import Uppy, { UploadCallback, UploadSuccessCallback } from "@uppy/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LocalFileItem, RemoteFileItem } from "./FileItem";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/router";
import { Button } from "../ui/Button";

type FileResult = inferRouterOutputs<AppRouter>["file"]["listFiles"];

export function FileList({ uppy }: { uppy: Uppy }) {
	const {
		data: infinityQueryData,
		isPending,
		fetchNextPage,
	} = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
		{
			limit: 3,
		},
		{
			getNextPageParam: (resp) => resp.nextCursor,
		}
	);

	const fileList = infinityQueryData
		? infinityQueryData.pages.reduce((result, page) => {
				return [...result, ...page.items];
		  }, [] as FileResult)
		: [];

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
			<div className={cn("flex flex-wrap gap-4 relative")}>
				{uploadingFileIDs.length > 0 &&
					uploadingFileIDs.map((id) => {
						const file = uppyFiles[id];
						return (
							<div
								key={file.id}
								className="w-56 h-56 flex justify-center items-center border border-red-500"
							>
								<LocalFileItem
									file={file.data as File}
								></LocalFileItem>
							</div>
						);
					})}
				{fileList?.map((file) => {
					return (
						<div
							key={file.id}
							className=" w-56 h-56 flex justify-center items-center border"
						>
							<RemoteFileItem
								contentType={file.contentType}
								url={file.url}
								name={file.name}
							></RemoteFileItem>
						</div>
					);
				})}

				<Button onClick={() => fetchNextPage()}>Load Next Page</Button>
			</div>
		</>
	);
}
