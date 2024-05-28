"use client";

import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { trpcClientReact } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function StoragePage({
	params: { id },
}: {
	params: { id: string };
}) {
	const { data: storages } = trpcClientReact.storage.listStorages.useQuery();
	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
	const utils = trpcClientReact.useUtils();
	const { mutate } = trpcClientReact.storage.changeStorage.useMutation({
		onSuccess: (data, {appId, storageId}) => {
			utils.apps.listApps.setData(void 0, (prev) => {
				if(!prev) {
					return prev
				}
				return prev.map(p => p.id === appId ? {
					...p,
					storageId: storageId
				} : p)
			})
		}
	});

	const currentApp = apps?.filter((app) => app.id === id)[0];

	return (
		<div className=" container pt-10 pb-10 relative flex flex-col">
			<div className=" flex justify-between items-center">
				<h1 className=" text-3xl mb-6">Storage</h1>
				<Button>
					<Link href={`/dashboard/apps/${id}/storage/new`}><Plus /></Link>
				</Button>
			</div>
			
			{storages?.map((storage) => {
				return (
					<div
						key={storage.id}
						className=" border p-4 flex justify-between items-center"
					>
						<span>{storage.name}</span>
						<Button disabled={storage.id === currentApp?.storageId} onClick={() => {
							mutate({appId: id, storageId: storage.id})
						}}>
							{storage.id === currentApp?.storageId
								? "Used"
								: "Use"}
						</Button>
					</div>
				);
			})}
			
		</div>
	);
}