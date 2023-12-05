import { NextResponse, NextRequest } from "next/server";

export const runtime: string = "edge";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 });
}
