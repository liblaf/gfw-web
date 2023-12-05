import { NextRequest, NextResponse } from "next/server";
import { Config, template } from "./_config";
import { Outbound, Selector, URLTest } from "./_config/outbound";
import { fetchOutbounds } from "./group";

export const runtime: string = "edge";

export async function GET(request: NextRequest) {
  const sub: string[] =
    request.nextUrl.searchParams.get("sub")?.split("|") || [];
  const outbounds: Record<string, Outbound[]> = (
    await Promise.all(
      sub.map(
        (sub: string): Promise<Record<string, Outbound[]>> =>
          fetchOutbounds(new URL(sub)),
      ),
    )
  ).reduce(
    (
      previous: Record<string, Outbound[]>,
      current: Record<string, Outbound[]>,
    ) => {
      for (const group in current) {
        if (!previous[group]) previous[group] = [];
        previous[group].push(...current[group]);
      }
      return previous;
    },
    {},
  );
  const config: Config = template();
  for (const group in outbounds) {
    (config.outbounds[0] as Selector).outbounds.push(group);
    (config.outbounds[1] as URLTest).outbounds.push(group);
    if (group == "🏳️‍🌈 OT 其他") {
      config.outbounds.push({
        type: "selector",
        tag: group,
        outbounds: outbounds[group].map(
          (outbound: Outbound): string => outbound.tag,
        ),
      });
    } else {
      config.outbounds.push({
        type: "urltest",
        tag: group,
        outbounds: outbounds[group].map(
          (outbound: Outbound): string => outbound.tag,
        ),
        url: process.env.TEST_URL,
      });
    }
  }
  config.outbounds.push(...Object.values(outbounds).flat());
  return new NextResponse(JSON.stringify(config));
}
