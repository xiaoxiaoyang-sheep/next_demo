"use client";

import { Dialog } from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function BackableDialog({ children }: { children: React.ReactNode}) {
	const router = useRouter();
    
	return (
		<div>
			<Dialog
				open={true}
				onOpenChange={() => {
					router.back();
                    router.refresh()
				}}
			>
				{children}
			</Dialog>
		</div>
	);
}
