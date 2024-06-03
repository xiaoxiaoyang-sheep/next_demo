import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Plan } from "./Plan";

export function UpgradeDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (f: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upgrade</DialogTitle>
					<DialogDescription>
						You are now a free user and cannot upload more files,
						please upgrade
					</DialogDescription>
				</DialogHeader>
				<Plan></Plan>
			</DialogContent>
		</Dialog>
	);
}
