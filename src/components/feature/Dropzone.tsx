import Uppy from "@uppy/core";
import { ReactNode, useRef, useState } from "react";

export function Dropzone({
	uppy,
	children,
}: {
	uppy: Uppy;
	children: ReactNode | ((draging: boolean) => ReactNode);
}) {
	const [draging, setDraging] = useState<boolean>(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return (
		<div 
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
            onDrag={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                Array.from(files).forEach((file) => {
                    uppy.addFile({
                        data: file
                    })
                })
                setDraging(false);
            }}
		>
            {typeof children === "function" ? children(draging) : children}
        </div>
	);
}
