"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { trpcClientReact } from "@/utils/api";
import copy from "copy-to-clipboard";
import { Copy, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SecretKey } from "./SecretKey";

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
				<Accordion collapsible type="single">
					{apiKeys?.map((apiKey) => {
						return (
							<AccordionItem
								key={apiKey.id}
								value={apiKey.id.toString()}
							>
								<AccordionTrigger className=" text-lg hover:no-underline">
									{apiKey.name}
								</AccordionTrigger>
								<AccordionContent>
									<div className=" flex justify-between w-full items-center">
										<span>Client Id</span>
										<div className=" flex items-center">
											<span>{apiKey.clientId}</span>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													copy(apiKey.clientId);
													toast("client id copied!");
												}}
											>
												<Copy size={20} />
											</Button>
										</div>
									</div>
									<SecretKey id={apiKey.id} havenShown={apiKey.havenShown}></SecretKey>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			</div>
		</ScrollArea>
	);
}
