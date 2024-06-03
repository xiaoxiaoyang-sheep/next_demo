"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRedirect({ delay, path }: { delay: number; path: string }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(path);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [delay, path, router]);

    return null;
}