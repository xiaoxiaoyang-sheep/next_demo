import { useUppyState } from "@/app/dashboard/useUppyState";
import { cn } from "@/lib/utils";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import Uppy, { UploadCallback, UploadSuccessCallback } from "@uppy/core";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LocalFileItem, RemoteFileItem } from "./FileItem";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/router";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { FilesOrderByColumn } from "@/server/routes/file";
import { CopyUrl, DeleteFile } from "./FileItemAction";

type FileResult = inferRouterOutputs<AppRouter>["file"]["listFiles"];

export function FileList({
	uppy,
	orderBy,
}: {
	uppy: Uppy;
	orderBy: FilesOrderByColumn;
}) {

    const queryKey = {
        limit: 10,
        orderBy,
    };

	const {
		data: infinityQueryData,
		isPending,
		fetchNextPage,
	} = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
		{...queryKey},
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

						utils.file.infinityQueryFiles.setInfiniteData(
							{...queryKey},
							(prev) => {
								if (!prev) {
									return prev;
								}

								return {
									...prev,
									pages: prev.pages.map((page, index) => {
										if (index === 0) {
											return {
												...page,
												items: [resp, ...page.items],
											};
										}
										return page;
									}),
								};
							}
						);
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

	// ----------------------> intersection

	const buttomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (buttomRef.current) {
			const observer = new IntersectionObserver(
				(e) => {
					if (e[0].intersectionRatio > 0.1) {
						fetchNextPage();
					}
				},
				{
					threshold: 0.1,
				}
			);

			observer.observe(buttomRef.current);
			const element = buttomRef.current;

			return () => {
				observer.unobserve(element);
				observer.disconnect();
			};
		}
	}, [fetchNextPage]);

    const handleFileDelete = (id: string) => {
        utils.file.infinityQueryFiles.setInfiniteData({...queryKey}, (prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                pages: prev.pages.map((page, index) => {
                    if (index === 0) {
                        return {
                            ...page,
                            items: page.items.filter((item) => item.id !== id),
                        };
                    }
                    return page;
                }),
            };
        });
    };

	return (
		<ScrollArea className=" h-full">
			{isPending && <div>Loading</div>}
			<div
				className={cn(
					"flex flex-wrap justify-center gap-4 relative container"
				)}
			>
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
							className=" w-56 h-56 flex justify-center items-center border relative"
						>
							<div className=" absolute inset-0 opacity-0 hover:opacity-100 transition-all bg-background/30 justify-center items-center flex">
								<CopyUrl url={file.url}></CopyUrl>
								<DeleteFile fileId={file.id} onDeleteSuccess={handleFileDelete}></DeleteFile>
							</div>

							<RemoteFileItem
								contentType={file.contentType}
								id={file.id}
								name={file.name}
							></RemoteFileItem>
						</div>
					);
				})}
			</div>
			<div className=" flex justify-center p-8" ref={buttomRef}>
				<Button variant="ghost" onClick={() => fetchNextPage()}>
					Load Next Page
				</Button>
			</div>
		</ScrollArea>
	);
}
