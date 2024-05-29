import { useEffect, useRef, useState } from "preact/hooks";
import type { HTMLAttributes, ReactNode } from "preact/compat";

type CommonPreactComponentProps = {
	setChildrenContainer: (ele: HTMLElement | null) => void;
};

export type DropzoneProps = {
	onDragingChange?: (draging: boolean) => void;
	onFileChosed: (files: File[]) => void;
	children: ReactNode | ((draging: boolean) => ReactNode);
} & Omit<HTMLAttributes<HTMLDivElement>, "children"> &
	CommonPreactComponentProps;

export function Dropzone({
	children,
	onDragingChange,
	onFileChosed,
	setChildrenContainer,
	...divProps
}: DropzoneProps) {
	const [draging, setDraging] = useState<boolean>(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		onDragingChange?.(draging);
	}, [onDragingChange, draging]);

	return (
		// @ts-ignore
		<div
			ref={(e) => {
				setChildrenContainer(e);
			}}
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
				const files = e.dataTransfer.files
					? Array.from(e.dataTransfer.files)
					: [];
				onFileChosed(files);
				setDraging(false);
			}}
		></div>
	);
}
