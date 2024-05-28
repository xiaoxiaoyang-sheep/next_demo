"use client";

import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { trpcClientReact } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppDashboardNav({
	params: { id },
}: {
	params: { id: string };
}) {
	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();

	const currentApp = apps?.filter((app) => app.id === id)[0];

	return (
		<div className=" flex justify-between items-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						{isPending
							? "Loading..."
							: currentApp
							? currentApp.name
							: "..."}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{apps?.map((app) => {
						return (
							<DropdownMenuItem
								key={app.id}
								disabled={app.id === id}
							>
								<Link
									href={`/dashboard/apps/${app.id}`}
									className=" w-full"
								>
									{app.name}
								</Link>
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
            <div>
                {` / api keys`}
            </div>
		</div>
	);
}
