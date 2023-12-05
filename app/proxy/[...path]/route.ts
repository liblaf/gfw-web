import { NextRequest } from "next/server";

export const runtime: string = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
): Promise<Response> {
  if (!params.path[0].endsWith(":")) {
    params.path.unshift("https:");
  }
  const url: URL = new URL(
    params.path[0] + "//" + params.path.slice(1).join("/"),
  );
  const response: Response = await fetch(url);
  return response;
}
