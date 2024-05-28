import { type HTMLAttributes } from "preact/compat";
import { useRef } from "preact/hooks";

export function UploadButton({onClick, ...props}: HTMLAttributes<HTMLButtonElement>) {
	const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = (e: MouseEvent) => {
        if(inputRef.current) {
            inputRef.current.click();
        }
        if(onClick) {
            onClick(e as any)
        }
    }

	return (
		<>
			<button {...props} onClick={handleClick}>Click Me</button>
			<input
				ref={inputRef}
				tabIndex={-1}
				type="file"
				style={{ opacity: 0, position: "fixed", left: -10000 }}
			/>
		</>
	);
}
