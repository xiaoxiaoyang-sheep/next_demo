import Uppy from "@uppy/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

export function UploadButton({ uppy }: { uppy: Uppy }) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<Button
				variant="ghost"
				onClick={() => {
					if (inputRef.current) {
						inputRef.current.click();
					}
				}}
			>
				<Plus />
			</Button>
			<input
				className="fixed left-[-10000px]"
				ref={inputRef}
				type="file"
				onChange={(e) => {
					if (e.target.files) {
						Array.from(e.target.files).forEach((file) => {
							uppy.addFile({
								data: file,
							});
						});
					}
				}}
				multiple
			></input>
		</>
	);
}
