import {
	type UppyFile,
	type Uppy,
	type UploadSuccessCallback,
	type UploadCompleteCallback,
} from "@uppy/core";
import { Dropzone, type DropzoneProps } from "./Dropzone";
import { useEffect, useRef } from "preact/hooks";

export function DropzoneWithUploader({
	uploader,
	onFileUploaded,
	...dropzoneProps
}: {
	uploader: Uppy;
	onFileUploaded?: (url: string, file: UppyFile) => void;
} & DropzoneProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const successCallback: UploadSuccessCallback<{}> = (file, resp) => {
			onFileUploaded?.(resp.uploadURL!, file!);
		};
		const completeCallback: UploadCompleteCallback<{}> = () => {

			if (inputRef.current) {
				inputRef.current.value = "";
			}
		};

		uploader.on("upload-success", successCallback);
		uploader.on("complete", completeCallback);

		return () => {
			uploader.off("upload-success", successCallback);
			uploader.off("complete", completeCallback);
		};
	}, []);

	function onFiles(files: File[]) {
		uploader.addFiles(
			files.map((file) => ({
				data: file,
			}))
		);
		uploader.upload();
	}

	return (
		<Dropzone
			{...dropzoneProps}
			onFileChosed={onFiles}
		></Dropzone>
	);
}
