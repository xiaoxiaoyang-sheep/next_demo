import { AuthOptions, getServerSession as nextAuthGetServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db/db";
import { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
	adapter: DrizzleAdapter(db) as Adapter,
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: "Ov23liFsu69KzzDl8wE8",
			clientSecret: "03164e9d6fbfe42373445a7e1d36db802b8f823c",
		}),
		// CredentialsProvider({
		// 	// The name to display on the sign in form (e.g. "Sign in with...")
		// 	name: "Credentials",
		// 	// `credentials` is used to generate a form on the sign in page.
		// 	// You can specify which fields should be submitted, by adding keys to the `credentials` object.
		// 	// e.g. domain, username, password, 2FA token, etc.
		// 	// You can pass any HTML attribute to the <input> tag through the object.
		// 	credentials: {
		// 		username: {
		// 			label: "Username",
		// 			type: "text",
		// 			placeholder: "username",
		// 		},
		// 		password: { label: "Password", type: "password" },
		// 	},
		// 	async authorize(credentials, req) {
		// 		if(!credentials) {
		//             return null;
		//         }

		//         const {username, password} = credentials;

		//         if(username !== "sheep" || password !== "123456") {
		//             return null;
		//         }

		//         return {
		//             id: "1",
		//             ...credentials
		//         }
		// 	},
		// }),
		// ...add more providers here
	],
};


export function getServerSession() {
    return nextAuthGetServerSession(authOptions);
}