import { trpcClientReact } from "@/utils/api";
import { Button } from "../ui/Button";
import { Copy, Trash2 } from "lucide-react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import type { MouseEventHandler } from "react";

export function DeleteFile({
	fileId,
	onDeleteSuccess,
}: {
	fileId: string;
	onDeleteSuccess: (fileId: string) => void;
}) {
	const { mutate: deleteFile, isPending } =
		trpcClientReact.file.deleteFile.useMutation({
			onSuccess() {
				onDeleteSuccess(fileId);
			},
		});

	const handleRemoveFile = () => {
		deleteFile(fileId);
		toast("Delete Successed!");
	};

	return (
		<Button variant="ghost" onClick={handleRemoveFile} disabled={isPending}>
			<Trash2 />
		</Button>
	);
}

export function CopyUrl({
	url,
	onClick,
}: {
	url: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<Button variant="ghost" onClick={onClick}>
			<Copy />
		</Button>
	);
}
