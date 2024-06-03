"use client";

import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
import { usePasteFile } from "@/hooks/usePasteFile";
import { UploadPreview } from "@/components/feature/UploadPreview";
import { FileList } from "@/components/feature/FileList";
import { FilesOrderByColumn } from "@/server/routes/file";
import { MoveUp, MoveDown, Settings } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { UrlMaker } from "./UrlMaker";
import { UpgradeDialog } from "@/components/feature/UpgradeDialog";

export default function AppPage({
	params: { id: appId },
}: {
	params: { id: string };
}) {
	const [showUpgrad, setShowUpgrade] = useState(false);

	const [uppy] = useState(() => {
		const uppy = new Uppy();
		uppy.use(AWSS3, {
			shouldUseMultipart: false,
			async getUploadParameters(file) {
				try {
					const result =
						await trpcPureClient.file.createPresignedUrl.mutate({
							filename:
								file.data instanceof File
									? file.data.name
									: "test",
							contentType: file.data.type || "",
							size: file.size,
							appId: appId,
						});
					return result;
				} catch (err) {
					setShowUpgrade(true);
					throw err;
				}
			},
		});
		return uppy;
	});
	const [showDeleted, setShowDeleted] = useState(false);
	const [orderBy, setOrderBy] = useState<
		Exclude<FilesOrderByColumn, undefined>
	>({ field: "createdAt", order: "desc" });

	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(
		void 0,
		{
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		}
	);

	const { data: plan } = trpcClientReact.user.getPlan.useQuery(void 0, {
		retry: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const currentApp = apps?.filter((app) => app.id === appId)[0];

	const [makingUrlImageId, setMakingUrlImageId] = useState<string | null>(
		null
	);

	usePasteFile({
		onFilePaste: (files) => {
			uppy.addFiles(
				files.map((file) => ({
					data: file,
				}))
			);
		},
	});

	let children: ReactNode;
	if (isPending) {
		children = <p className=" text-center">Loading...</p>;
	} else if (!currentApp) {
		children = (
			<div className=" border max-w-48 m-auto mt-10 flex flex-col items-center p-4 rounded-md">
				<p className=" text-lg">App Not Exist</p>
				<p className=" text-sm">Chose another one</p>
				<div className=" flex flex-col items-center mt-5">
					{apps?.map((app) => (
						<Button
							key={app.id}
							asChild
							variant="link"
							className=" w-full"
						>
							<Link href={`/dashboard/apps/${app.id}`}>
								{app.name}
							</Link>
						</Button>
					))}
				</div>
			</div>
		);
	} else {
		children = (
			<div className=" mx-auto h-full">
				<div className="container flex justify-between items-center h-[60px]">
					<div className="flex items-center h-full gap-2">
						<Button
							onClick={() => {
								setOrderBy((current) => ({
									...current,
									order:
										current.order === "asc"
											? "desc"
											: "asc",
								}));
							}}
						>
							Created At{" "}
							{orderBy.order === "desc" ? (
								<MoveUp />
							) : (
								<MoveDown />
							)}
						</Button>
						<Switch
							id="show_deleted"
							checked={showDeleted}
							onCheckedChange={(checked) =>
								setShowDeleted(checked)
							}
						></Switch>
						<Label htmlFor="show_deleted">Show Deleted</Label>
					</div>
					<div className="flex justify-center gap-2">
						<UploadButton uppy={uppy}></UploadButton>
						<Button
							asChild
							onClick={(e) => {
								if (plan === "free") {
									e.preventDefault()
									setShowUpgrade(true);
								}
							}}
						>
							<Link href="./new">new app</Link>
						</Button>
						<Button asChild>
							<Link
								href={`/dashboard/apps/${appId}/setting/storage`}
							>
								<Settings />
							</Link>
						</Button>
					</div>
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
									onMakeUrl={(id) => setMakingUrlImageId(id)}
								></FileList>
							</>
						);
					}}
				</Dropzone>
				<UploadPreview uppy={uppy}></UploadPreview>
				<Dialog
					open={Boolean(makingUrlImageId)}
					onOpenChange={(flag) => {
						if (flag === false) {
							setMakingUrlImageId(null);
						}
					}}
				>
					<DialogContent className="max-w-4xl">
						<DialogTitle>Make Url</DialogTitle>
						{makingUrlImageId && (
							<UrlMaker id={makingUrlImageId}></UrlMaker>
						)}
					</DialogContent>
				</Dialog>
				<UpgradeDialog
					open={showUpgrad}
					onOpenChange={(f) => setShowUpgrade(f)}
				></UpgradeDialog>
			</div>
		);
	}

	return children;
}
