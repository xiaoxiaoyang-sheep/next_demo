import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import copy from "copy-to-clipboard";
import { startTransition, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export function UrlMaker({ id }: { id: string }) {
	const [width, setWidth] = useState(250);

	const [rotate, setRotate] = useState(0);

	const [url, setUrl] = useState(
		`/image/${id}?width=${width}&rotate=${rotate}`
	);

	const imgRef = useRef<HTMLImageElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const containerHeight = useMemo(() => {
		if (imgRef.current) {
			const angle = Math.atan(
				imgRef.current.width / imgRef.current.height
			);
			const hypotenuse = Math.sqrt(
				imgRef.current.width ** 2 + imgRef.current.height ** 2
			);
			const absRotate = Math.abs(rotate);
			return (
				Math.cos(
					((absRotate <= 90 ? absRotate : 180 - absRotate) / 180) *
						Math.PI -
						angle
				) *
					hypotenuse +
				"px"
			);
		}
	}, [rotate, imgRef.current?.height, imgRef.current?.width]);

	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span>Rotate:</span>
					<Slider
						className="relative flex h-5 w-[200px] touch-none select-none items-center"
						value={[rotate]}
						onValueChange={(v) => {
                            startTransition(() => {
                                if (v[0] !== undefined)
                                    setRotate(v[0] ?? 0);
                            })
						}}
						max={180}
						min={-180}
						step={5}
					></Slider>
				</div>
				<div>
					<label htmlFor="widthInput" className="mr-2">
						{`Width:`}
					</label>
					<input
						id="widthInput"
						type="number"
						value={width}
						max={2000}
						min={100}
						className="input input-bordered input-sm"
						onChange={(e) => setWidth(Number(e.target.value))}
					/>
				</div>
				<Button
					onClick={() =>
						setUrl(`/image/${id}?width=${width}&rotate=${rotate}`)
					}
				>
					Make
				</Button>
			</div>
			<div className=" p-2">
				<div
					className="flex justify-center items-center"
					ref={containerRef}
					style={{ height: containerHeight }}
				>
					<img
						ref={imgRef}
						src={`/image/${id}?width=${250}&rotate=${0}`}
						alt="generate url"
						className=" max-w-full max-h-[60vh]"
						style={{ transform: `rotate(${rotate}deg)` }}
					></img>
				</div>
			</div>
			<div className="flex justify-between items-center gap-2">
				<Input
					value={`${process.env.NEXT_PUBLIC_SITE_URL}${url}`}
					readOnly
				></Input>
				<Button
					onClick={() => {
						copy(`${process.env.NEXT_PUBLIC_SITE_URL}${url}`);
						toast("Copy Succeed!");
					}}
				>
					Copy
				</Button>
			</div>
		</div>
	);
}
