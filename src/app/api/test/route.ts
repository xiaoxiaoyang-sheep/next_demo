import { insertUserSchema } from "@/server/db/validate-schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// export const dynamic = "force-dynamic"; // 规避默认的Cache

const inputSchema = z.object({
	name: z.string().min(3).max(6),
	email: z.string().email(),
});

export function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams;

    const name = query.get("name");
    const email = query.get("email");

    const result = insertUserSchema.safeParse({
        name,
        email
    })

    if(result.success) {
        return NextResponse.json(result.data);
    } else {
        return NextResponse.json({error: result.error});
    }
	
}
