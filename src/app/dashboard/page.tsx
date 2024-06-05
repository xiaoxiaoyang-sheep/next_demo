"use client";

import Link from "next/link";
import { trpcClientReact } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { UpgradeDialog } from "@/components/feature/UpgradeDialog";
import { useState } from "react";

export default function DashboardAppList() {
	const getAppsResult = trpcClientReact.apps.listApps.useQuery(void 0, {
		gcTime: Infinity,
		staleTime: Infinity,
	});
	const { data: plan } = trpcClientReact.user.getPlan.useQuery(void 0, {
		retry: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const { data: apps, isLoading } = getAppsResult;
	const [showUpgrad, setShowUpgrade] = useState(false);

	const router = useRouter();

	return (
		<div className=" mx-auto pt-10">
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className=" flex w-full max-w-xs flex-col gap-4 rounded-md border p-4 mx-auto">
					{apps?.map((app) => (
						<div
							key={app.id}
							className="flex items-center justify-between gap-16 "
						>
							<div>
								<h2 className=" text-xl">{app.name}</h2>
								<p className=" text-base-content/60">
									{app.description
										? app.description
										: "(no description)"}
								</p>
							</div>
							<div>
								<Button asChild variant="destructive">
									<Link href={`/dashboard/apps/${app.id}`}>
										Go
									</Link>
								</Button>
							</div>
						</div>
					))}
					<Button asChild>
						<Link
							href="/dashboard/apps/new"
							onClick={(e) => {
								e.preventDefault();
								if (plan === "free" && apps?.length === 1) {
									e.preventDefault();
									setShowUpgrade(true);
								}
							}}
						>
							Create App
						</Link>
					</Button>
				</div>
			)}
			<UpgradeDialog
				open={showUpgrad}
				onOpenChange={(f) => setShowUpgrade(f)}
			></UpgradeDialog>
		</div>
	);
}
