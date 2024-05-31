import { Button } from "@/components/ui/Button";
import { trpcClientReact } from "@/utils/api";
import copy from "copy-to-clipboard";
import { Copy, RefreshCcw, Eye } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

export function SecretKey({
	id,
	havenShown,
}: {
	id: number;
	havenShown: boolean;
}) {
	const {
		mutate: getSecretKey,
		isPending,
		data: secretKey,
	} = trpcClientReact.apiKey.requestKey.useMutation();

	let content: ReactNode;
	if (!havenShown || secretKey) {
		if (secretKey) {
			content = (
				<>
					<span>{secretKey}</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							copy(secretKey);
							toast("secret key copied!");
						}}
					>
						<Copy size={20} />
					</Button>
				</>
			);
		} else {
			content = (
				<>
					<span>
						Click to view the secret key, you can only view it once,
						please backup it in time
					</span>
					<Button
						variant="ghost"
						size="icon"
						disabled={isPending}
						onClick={() => {
							getSecretKey({ apiKeyId: id });
						}}
					>
						<Eye size={20} />
					</Button>
				</>
			);
		}
	} else {
		content = (
			<>
				<span>Click to refresh the secret key</span>
				<Button
					variant="ghost"
					size="icon"
					disabled={isPending}
					onClick={() => {
						getSecretKey({ apiKeyId: id, refresh: true });
					}}
				>
					<RefreshCcw size={20} />
				</Button>
			</>
		);
	}

	return (
		<div className=" flex justify-between w-full items-center">
			<span>Secret Key</span>
			<div className=" flex items-center">{content}</div>
		</div>
	);
}
