import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 如果不是基于vercel的项目，可能会出现问题

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	if (true) {
		return NextResponse.redirect(new URL("/api/auth/signin", request.url));
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: "/dashboard/:path*",
};
