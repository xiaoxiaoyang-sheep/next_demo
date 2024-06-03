import { db } from "../db/db";
import { orders, users } from "../db/schema";
import { Stripe } from "stripe";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouters = router({
	/**
	 * 获取plan
	 */
	getPlan: protectedProcedure.query(async ({ ctx }) => {
		const result = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, ctx.session.user.id),
			columns: {
				plan: true,
			},
		});
		return result?.plan;
	}),

	/**
	 * 升级plan
	 */
	upgrade: protectedProcedure.mutation(async ({ ctx }) => {
		const stripe = new Stripe(
			"sk_test_51PNPziLoZ2iHb2cuhNj3JKN1YAuMhjtVO5CGIiEU8qUk0KVX6c6T38BnBPBTvvwk1OOd1uwmThCozBl2OR1SxVvf006dauLWQr"
		);

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
					price: "price_1PNQ1aLoZ2iHb2cuXFVf863H",
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `http://localhost:3000/pay/callback/success`,
			cancel_url: `http://localhost:3000/pay/callback/cancel`,
		});

		if (!session.url) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
			});
		}

		await db.insert(orders).values({
			sessionId: session.id,
			userId: ctx.session.user.id,
			status: "created",
		});

		return {
			url: session.url,
		};
	}),
});
