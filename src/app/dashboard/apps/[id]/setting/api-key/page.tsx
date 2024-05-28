"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { trpcClientReact } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApiKeyPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const { data: apiKeys } = trpcClientReact.apiKey.listApiKeys.useQuery({
		appId: id,
	});
	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
	const { mutate } = trpcClientReact.apiKey.createApiKey.useMutation({
		onSuccess: (data) => {
			setNewApiKeyName("");
			utils.apiKey.listApiKeys.setData({ appId: id }, (prev) => {
				if (!prev) {
					return prev;
				}
				return [data, ...prev];
			});
		},
	});
	const utils = trpcClientReact.useUtils();

	const [newApiKeyName, setNewApiKeyName] = useState("");

	const currentApp = apps?.filter((app) => app.id === id)[0];

	return (
		<ScrollArea className=" h-full">
			<div className=" container pt-10 pb-10 relative flex flex-col">
				<div className=" flex justify-between items-center">
					<h1 className=" text-3xl mb-6">Api Keys</h1>
					<Popover>
						<PopoverTrigger asChild>
							<Button>
								<Plus />
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<div className=" flex flex-col gap-4">
								<Input
									placeholder="Name"
									value={newApiKeyName}
									onChange={(e) => {
										setNewApiKeyName(e.target.value);
									}}
								></Input>
								<Button
									type="submit"
									onClick={() => {
										mutate({
											appId: id,
											name: newApiKeyName,
										});
									}}
								>
									Submit
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{apiKeys?.map((apiKey) => {
					return (
						<div
							key={apiKey.id}
							className=" border p-4 flex justify-between items-center"
						>
							<span>{apiKey.name}</span>
							<span>{apiKey.key}</span>
						</div>
					);
				})}
			</div>
		</ScrollArea>
	);
}
