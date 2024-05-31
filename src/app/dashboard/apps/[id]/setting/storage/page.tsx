"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { trpcClientReact } from "@/utils/api";
import copy from "copy-to-clipboard";
import { Copy, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function StoragePage({
	params: { id },
}: {
	params: { id: string };
}) {
	const { data: storages } = trpcClientReact.storage.listStorages.useQuery();
	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
	const utils = trpcClientReact.useUtils();
	const { mutate } = trpcClientReact.storage.changeStorage.useMutation({
		onSuccess: (data, { appId, storageId }) => {
			utils.apps.listApps.setData(void 0, (prev) => {
				if (!prev) {
					return prev;
				}
				return prev.map((p) =>
					p.id === appId
						? {
								...p,
								storageId: storageId,
						  }
						: p
				);
			});
		},
	});

	const currentApp = apps?.filter((app) => app.id === id)[0];

	return (
		<div className=" container pt-10 pb-10 relative flex flex-col">
			<div className=" flex justify-between items-center">
				<h1 className=" text-3xl mb-6">Storage</h1>
				<Button asChild>
					<Link href={`/dashboard/apps/${id}/setting/storage/new`}>
						<Plus />
					</Link>
				</Button>
			</div>
			<Accordion type="single" collapsible>
				{storages?.map((storage) => {
					return (
						<AccordionItem
							key={storage.id}
							value={storage.id.toString()}
						>
							<AccordionTrigger className=" text-lg hover:no-underline">
								<div className="flex items-center gap-2">
									{storage.name}
									{storage.id === currentApp?.storageId && (
										<div className=" text-xs border p-1 rounded-lg ">
											used
										</div>
									)}
								</div>
							</AccordionTrigger>
							<AccordionContent className=" text-base flex flex-col">
								<div className=" flex justify-between w-full items-center">
									<span>region</span>
									<div className=" flex items-center">
										<span>
											{storage.configuration.region}
										</span>
										{storage.configuration.region && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													copy(
														storage.configuration
															.region!
													);
													toast("region copied!");
												}}
											>
												<Copy size={20} />
											</Button>
										)}
									</div>
								</div>
								<div className=" flex justify-between w-full items-center">
									<span>bucket</span>
									<div className=" flex items-center">
										<span>
											{storage.configuration.bucket}
										</span>
										{storage.configuration.bucket && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													copy(
														storage.configuration
															.bucket!
													);
													toast("bucket copied!");
												}}
											>
												<Copy size={20} />
											</Button>
										)}
									</div>
								</div>
								<div className=" flex justify-between w-full items-center">
									<span>apiEndpoint</span>
									<div className=" flex items-center">
										<span>
											{storage.configuration.apiEndpoint}
										</span>
										{storage.configuration.apiEndpoint && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													copy(
														storage.configuration
															.apiEndpoint!
													);
													toast(
														"apiEndpoint copied!"
													);
												}}
											>
												<Copy size={20} />
											</Button>
										)}
									</div>
								</div>
								<Button
									className="mt-2"
									disabled={
										storage.id === currentApp?.storageId
									}
									onClick={() => {
										mutate({
											appId: id,
											storageId: storage.id,
										});
									}}
								>
									{storage.id === currentApp?.storageId
										? "Used"
										: "Use"}
								</Button>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
		</div>
	);
}
