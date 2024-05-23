import Uppy from "@uppy/core";

export function UploadButton({ uppy }: { uppy: Uppy }) {
	return (
		<input
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
	);
}
