"use client";

import Link from "next/link";
import { trpcClientReact } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function DashboardAppList() {
    const getAppsResult = trpcClientReact.apps.listApps.useQuery(void 0, {
        gcTime: Infinity,
        staleTime: Infinity,
    });

    const { data: apps, isLoading } = getAppsResult;

    const router = useRouter();

    return (
        <div className=" w-fit mx-auto pt-10">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className=" flex w-full max-w-md flex-col gap-4 rounded-md border p-4">
                    {apps?.map((app) => (
                        <div
                            key={app.id}
                            className="flex items-center justify-between gap-16"
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
                                router.push("/dashboard/apps/new");
                            }}
                        >
                            Create App
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}