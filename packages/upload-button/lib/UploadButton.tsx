import { type HTMLAttributes } from "preact/compat";
import { MutableRef, useRef } from "preact/hooks";

interface CommonPreactComponentProps {
	setChildrenContainer?: (ele: HTMLElement | null) => void;
}

export type UploadButtonProps =  HTMLAttributes<HTMLButtonElement> &
CommonPreactComponentProps & {
    onFileChosed: (files: File[]) => void;
    inputRef?: MutableRef<HTMLInputElement | null>
}

export function UploadButton({
	onClick,
	setChildrenContainer,
	children,
	onFileChosed,
    inputRef: inputRefFromProps,
	...props
}: UploadButtonProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleClick = (e: MouseEvent) => {
		if (inputRef.current) {
			inputRef.current.click();
		}
		if (onClick) {
			onClick(e as any);
		}
	};

	return (
		<>
			<button
				{...props}
				onClick={handleClick}
				ref={(e) => setChildrenContainer?.(e)}
			>
				{children}
			</button>
			<input
				ref={(e) => {
                    inputRef.current = e
                    if(inputRefFromProps) {
                        inputRefFromProps.current = e
                    }
                }}
				tabIndex={-1}
				type="file"
                multiple
				style={{ opacity: 0, position: "fixed", left: -10000 }}
				onChange={(e) => {
					const filesFromEvent = (e.target as HTMLInputElement).files;
                    
                    if(filesFromEvent) {
                        onFileChosed(Array.from(filesFromEvent))
                    }
				}}
			/>
		</>
	);
}
