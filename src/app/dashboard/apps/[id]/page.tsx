import ClientPage from "./ClientPage";

export function generateStaticParams() {
	return [{id: "e304aec7-9ec9-4b97-b9ae-59568b7fb27c"}]
}

export default function AppPage({
	params: { id: appId },
}: {
	params: { id: string };
}) {
	return <>
		<ClientPage params={{id: appId}}></ClientPage>
	</>
}
