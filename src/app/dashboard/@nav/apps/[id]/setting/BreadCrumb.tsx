import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";
import Link from "next/link";
import { Home } from "lucide-react";

export function BreadCrumb({ id, leaf }: { id: string; leaf: string }) {
	const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();

	const currentApp = apps?.filter((app) => app.id === id)[0];

	return (
		<nav className="flex" aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				<li className="inline-flex items-center">
					<Link
						href={`/dashboard/apps/${id}`}
						className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
					>
						<Home></Home>
					</Link>
				</li>
				<li className="inline-flex items-center">
					<DropdownMenu>
						<DropdownMenuTrigger className=" p-2">
							{isPending
								? "Loading..."
								: currentApp
								? currentApp.name
								: "..."}
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
				</li>
				<li aria-current="page">
					<div className="flex items-center">
						<svg
							className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m1 9 4-4-4-4"
							/>
						</svg>
						<span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
							{leaf}
						</span>
					</div>
				</li>
			</ol>
		</nav>
	);
}
