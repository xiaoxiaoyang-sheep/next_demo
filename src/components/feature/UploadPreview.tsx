import Uppy from "@uppy/core";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/Dialog";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocalFileItem } from "./FileItem";

export function UploadPreview({ uppy }: { uppy: Uppy }) {
	// const open = useUppyState(uppy, (s) => Object.keys(s.files).length > 0);

	const files = useUppyState(uppy, (s) => Object.values(s.files));
	const [index, setIndex] = useState(0);

	const open = files.length > 0;
	const file = files[index];
	const isImage = file?.data.type.startsWith("image");

	const clear = () => {
		files.map((file) => {
			uppy.removeFile(file.id);
		});
		setIndex(0);
	};

	return file ? (
		<Dialog
			open={open}
			onOpenChange={(flag) => {
				if (flag === false) {
					clear();
				}
			}}
		>
			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogTitle>Upload Preview</DialogTitle>
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => {
							if (index === 0) {
								setIndex(files.length - 1);
							} else {
								setIndex(index - 1);
							}
						}}
					>
						<ChevronLeft />
					</Button>
					<div
						key={file.id}
						className=" w-56 h-56 flex justify-center items-center"
					>
						<LocalFileItem file={file.data as File}></LocalFileItem>
					</div>
					<Button
						variant="ghost"
						onClick={() => {
							if (index === files.length - 1) {
								setIndex(0);
							} else {
								setIndex(index + 1);
							}
						}}
					>
						<ChevronRight />
					</Button>
				</div>
				<DialogFooter>
					<Button
						variant="destructive"
						onClick={() => {
							uppy.removeFile(file.id);
							if (index === files.length - 1 && index !== 0) {
								setIndex(files.length - 2);
							}
						}}
					>
						Delete This
					</Button>
					<Button
						onClick={() => {
							uppy.upload().then(() => {
								clear();
							});
						}}
					>
						Upload All
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : null;
}
