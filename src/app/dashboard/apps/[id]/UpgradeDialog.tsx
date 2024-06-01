import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";

export function UpgradeDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (f: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent><DialogTitle>Upgrade</DialogTitle>xxx</DialogContent>
		</Dialog>
	);
}
