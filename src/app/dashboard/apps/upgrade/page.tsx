"use client";

import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";

export default function UpgradePage() {
	const { mutate, isPending } = trpcClientReact.user.upgrade.useMutation({
		onSuccess: (resp) => {
			window.location.href = resp.url;
		},
	});

	const { data: plan } = trpcClientReact.user.getPlan.useQuery(void 0, {
		retry: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	return (
		<div className=" container flex justify-center items-center min-h-[calc(100vh-80px)]">
			<div className=" flex items-end">
				<section className=" hover:scale-110 hover:-translate-y-5  transition-all">
					<div className="container px-4">
						<div className="flex flex-col items-center space-y-4 md:space-y-8">
							<div className="grid max-w-sm gap-4 md:grid-cols-1 md:max-w-none md:gap-8">
								<div className="flex flex-col rounded-lg border-2 border-indigo-600 hover:border-indigo-200">
									<div className="flex-1 grid items-center justify-center p-6 text-center">
										<h2 className="text-lg font-semibold">
											Free
										</h2>
										<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
											For growing usage with additional
											needs
										</p>
									</div>
									<div className="border-t border-gray-200 dark:border-gray-800">
										<div className="grid items-center justify-center p-6">
											<span className="text-2xl font-semibold text-center">
												free
											</span>
											<span className=" ml-2 text-sm text-gray-500 dark:text-gray-400">
												per month
											</span>
										</div>
									</div>
									<ul className="divide-y divide-gray-200 dark:divide-gray-800">
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Limited
											</span>
											Uploads
										</li>
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Limited
											</span>
											Apps
										</li>
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Limited
											</span>
											Storage Configurations
										</li>
									</ul>
									<div className="p-4 text-center text-sm">
										{plan === "free" ? (
											<Button
												className=" w-full"
												disabled
												onClick={() => {
													mutate();
												}}
											>
												Current
											</Button>
										) : (
											<text className=" text-xs text-center w-full text-gray-500">You're already a pro user</text>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className=" hover:scale-110 hover:-translate-y-5  transition-all">
					<div className="container px-4">
						<div className="flex flex-col items-center space-y-4 md:space-y-8">
							<div className="grid max-w-sm gap-4 md:grid-cols-1 md:max-w-none md:gap-8">
								<div className="flex flex-col rounded-lg border-2 border-indigo-600 hover:border-indigo-200">
									<div className="flex-1 grid items-center justify-center p-6 text-center">
										<h2 className="text-lg font-semibold">
											Pro
										</h2>
										<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
											For growing usage with additional
											needs
										</p>
									</div>
									<div className="border-t border-gray-200 dark:border-gray-800">
										<div className="grid items-center justify-center p-6">
											<span className="text-2xl font-semibold text-center">
												$10
											</span>
											<span className=" ml-2 text-sm text-gray-500 dark:text-gray-400">
												per month
											</span>
										</div>
									</div>
									<ul className="divide-y divide-gray-200 dark:divide-gray-800">
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Unlimited
											</span>
											Uploads
										</li>
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Unlimited
											</span>
											Apps
										</li>
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												Unlimited
											</span>
											Storage Configurations
										</li>
										<li className="p-4 text-sm gap-2 flex">
											<span className="font-medium">
												AI
											</span>
											Feature
										</li>
									</ul>
									<div className="p-4">
										<Button
											className=" w-full"
											disabled={
												isPending || plan === "payed"
											}
											onClick={() => {
												mutate();
											}}
										>
											{plan === "payed"
												? "Current"
												: "Upgrade"}
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
