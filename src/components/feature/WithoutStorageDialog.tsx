import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Plan } from "./Plan";
import { Button } from "../ui/Button";
import Link from "next/link";

export function WithoutStorageDialog({
	open,
	id,
	onOpenChange,
}: {
	open: boolean;
	id: string;
	onOpenChange: (f: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Storage Not Found</DialogTitle>
					<DialogDescription className="py-2">
						You need to specify a storage or create a new storage
					</DialogDescription>
				</DialogHeader>
				<DialogFooter><Button asChild><Link href={`/dashboard/apps/${id}/setting/storage`}>Go to Storage</Link></Button></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
