"use client"

import { Dialog} from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";

export function BackableDialog({children}: {children: React.ReactNode}) {
    const router = useRouter()

    return <Dialog open onOpenChange={() => {router.back()}}>
        {children}
    </Dialog>
}