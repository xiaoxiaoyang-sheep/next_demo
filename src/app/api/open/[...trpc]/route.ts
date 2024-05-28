import { openRouter } from "@/server/open-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const handler = async (request: NextRequest) => {
	const res = await fetchRequestHandler({
		endpoint: "/api/open",
		req: request,
		router: openRouter,
		createContext: () => ({}),
	}); 
	res.headers.append("Access-Control-Allow-Origin", "*");

	return res;
};

export function OPTIONS() {
	const res = new Response("", {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "*",
			"Access-Control-Allow-Headers": "*"
		}
	})
	return res
}

export { handler as GET, handler as POST };
