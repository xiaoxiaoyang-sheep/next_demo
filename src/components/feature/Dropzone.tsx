import Uppy from "@uppy/core";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";

export function Dropzone({
	uppy,
	children,
	...divProps
}: {
	uppy: Uppy;
	children: ReactNode | ((draging: boolean) => ReactNode);
} & Omit<HTMLAttributes<HTMLDivElement>, "children">) {
	const [draging, setDraging] = useState<boolean>(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return (
		<div
			{...divProps}
			onDragEnter={(e) => {
				e.preventDefault();
				setDraging(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = null;
				}
				timerRef.current = setTimeout(() => {
					setDraging(false);
				}, 50);
			}}
			onDragOver={(e) => {
				e.preventDefault();
				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = null;
				}
			}}
			onDrop={(e) => {
				e.preventDefault();
				const files = e.dataTransfer.files;
				Array.from(files).forEach((file) => {
					uppy.addFile({
						data: file,
					});
				});
				setDraging(false);
			}}
		>
			{typeof children === "function" ? children(draging) : children}
		</div>
	);
}
