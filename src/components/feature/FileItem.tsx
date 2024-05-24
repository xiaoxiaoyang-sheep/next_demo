import Image from "next/image";
import { useMemo } from "react";


export function FileItem({
	url,
	name,
	isImage,
}: {
	url: string;
	name: string;
	isImage: boolean;
}) {
	return isImage ? (
		<img className=" max-h-[13.9rem] max-w-[13.9rem]" src={url} alt={name} />
	) : (
		<Image
			src="/unknown-file-types.png"
			alt="unknow file type"
			width={100}
			height={100}
		></Image>
	);
}


export function LocalFileItem({file}: {file: File}) {
    const isImage = file.type.startsWith("image");
    const url = useMemo(() => {
        if(isImage) {
            return URL.createObjectURL(file);
        }
        return "";
    }, [isImage, file])
    return  <FileItem url={url} name={file.name} isImage={isImage}></FileItem>
}

export function RemoteFileItem({contentType, name, url}: {contentType: string; name: string; url: string}) {
    const isImage = contentType.startsWith("image");

    return <FileItem isImage={isImage} name={name} url={url}></FileItem>
}