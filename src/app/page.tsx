"use client"

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { trpcClient, trpcClientReact} from "@/utils/api"


export default function Home() {
  const {data, isLoading, isError} = trpcClientReact.hello.useQuery(void 0, {
    refetchOnWindowFocus: false, // 打开页面重新加载数据
  });

	return (
		<div className="h-screen flex justify-center items-center">
			<form action="" className="w-full max-w-md flex flex-col gap-4">
				<h1 className="text-center text-2xl font-bold">Create App</h1>
				<Input name="name" placeholder="App Name" />
				<Textarea name="descript" placeholder="Descpipt" />
				<Button type="submit">Submit</Button>
			</form>
      {data?.hello}
      {isLoading && "loading..."}
      {isError && "error..."}
		</div>
	);
}
