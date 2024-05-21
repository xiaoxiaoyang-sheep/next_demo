import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 规避默认的Cache

export function GET(request: NextRequest) {
    return NextResponse.json({
        a: "hello world"
    })
}