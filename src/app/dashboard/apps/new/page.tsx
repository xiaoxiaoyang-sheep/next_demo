import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getServerSession } from "@/server/auth";
import { createAppSchema } from "@/server/db/validate-schema";
import { serverCaller } from "@/server/router";
import { trpcClient, trpcClientReact} from "@/utils/api";
import {redirect} from "next/navigation"

export default function Page() {

    async function createApp(formData: FormData) {
        "use server"

        const name = formData.get("name");
        const description = formData.get("description");

        const input = createAppSchema.pick({name: true, description: true}).safeParse({
            name, description
        })

        if(input.success) {
            const session = getServerSession();
            const newApp = await serverCaller({session}).apps.createApp(input.data);
            redirect(`/dashboard/apps/${newApp.id}`)
        }
    }

	return (
		<div className="h-screen flex justify-center items-center">
			<form action={createApp} className="w-full max-w-md flex flex-col gap-4">
				<h1 className="text-center text-2xl font-bold">Create App</h1>
				<Input name="name" placeholder="App Name" />
				<Textarea name="descript" placeholder="Descpipt" />
				<Button type="submit">Submit</Button>
			</form>
		</div>
	);
}
