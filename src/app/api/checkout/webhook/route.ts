import { db } from "@/server/db/db";
import { orders, users } from "@/server/db/schema";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
	"sk_test_51PNPziLoZ2iHb2cuhNj3JKN1YAuMhjtVO5CGIiEU8qUk0KVX6c6T38BnBPBTvvwk1OOd1uwmThCozBl2OR1SxVvf006dauLWQr"
);

export async function POST(request: NextRequest) {
	const payload = await request.text();
	const sig = request.headers.get("stripe-signature");

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			payload,
			sig ?? "",
			"whsec_a382d1fdc41d4139e250f35c8e0cb3e48017ae8d82297b49b205356d06cfa150"
		);
	} catch (err) {
		return new Response("", { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			event.data.object.id,
			{
				expand: ["line_items"],
			}
		);
		const lineItems = sessionWithLineItems.line_items;

		const order = await db.query.orders.findFirst({
			where: (orders, { eq }) =>
				eq(orders.sessionId, event.data.object.id),
		});

		if (!order || order.status !== "created") {
			return new Response("", { status: 400 });
		}

		await db.update(orders).set({
			status: "completed",
		});

		await db.update(users).set({
			plan: "payed",
		});
	}
    
    return new Response("", { status: 200 });
}
