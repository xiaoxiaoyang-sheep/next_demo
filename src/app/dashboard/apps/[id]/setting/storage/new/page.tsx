"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { type S3StorageConfiguration } from "@/server/db/schema";
import { trpcClientReact } from "@/utils/api";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

export default function NewStoragePage({params: {id}}: {params: {id: string}}) {
	const { register, handleSubmit, formState: {errors}} = useForm<S3StorageConfiguration & { name: string }>();
    const {mutate, isPending} = trpcClientReact.storage.createStorage.useMutation({
        onSuccess: () => {
            router.back()
        }
    })
    const router = useRouter()

    const onSubmit: SubmitHandler<S3StorageConfiguration & {name: string}> = (data) => {
        mutate(data)
    }

	return (
		<div className=" container pt-10">
			<h1 className=" text-3xl  mb-6 max-w-md mx-auto">Create Storage</h1>
			<form className=" flex flex-col gap-4 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit) }>
				<div>
					<Label>Name</Label>
					<Input
						{...register("name", { required: "Name is required" })}
					></Input>
                    <span className=" text-red-500">{errors.name?.message}</span>
				</div>
				<div>
					<Label>Bucket</Label>
					<Input
						{...register("bucket", {
							required: "Bucket is required",
						})}
					></Input>
                     <span className=" text-red-500">{errors.bucket?.message}</span>
				</div>
				<div>
					<Label>Region</Label>
					<Input
						{...register("region", {
							required: "Region is required",
						})}
					></Input>
                     <span className=" text-red-500">{errors.region?.message}</span>
				</div>
				<div>
					<Label>ApiEndpoint</Label>
					<Input {...register("apiEndpoint")}></Input>
				</div>
				<div>
					<Label>AccessKeyId</Label>
					<Input
						{...register("accessKeyId", {
							required: "AccessKeyId is required",
						})}
					></Input>
                     <span className=" text-red-500">{errors.accessKeyId?.message}</span>
				</div>
				<div>
					<Label>SecretAccessKey</Label>
					<Input
						type="password"
						{...register("secretAccessKey", {
							required: "SecretAccessKey is required",
						})}
						autoComplete="off"
					></Input>
                     <span className=" text-red-500">{errors.secretAccessKey?.message}</span>
				</div>

				<Button type="submit" disabled={isPending}>Submit</Button>
			</form>
		</div>
	);
}
