import { useEffect } from "react"


export function usePasteFile({onFilePaste}: {
    onFilePaste: (files: File[]) => void
}) {
    useEffect(() => {
        const pasteHandler = (e: ClipboardEvent) => {
            const files: File[] = [];
            if(!e.clipboardData) {
                return;
            }
            Array.from(e.clipboardData.items).forEach((item) => {
                const f = item.getAsFile();
                if(f) {
                    files.push(f);
                } 
            })
            
            if(files.length > 0) {
                onFilePaste(files);
            }
            
        }
        
        document.body.addEventListener("paste", pasteHandler);
        return () => {
            document.body.removeEventListener("paste", pasteHandler);
        }
    }, [onFilePaste])
}