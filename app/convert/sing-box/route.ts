import { NextRequest, NextResponse } from "next/server";
import { TEST_URL } from "@/lib/urls";
import { Config, template } from "@/lib/sing-box";
import { Outbound, Selector, URLTest } from "@/lib/sing-box/outbound";
import { fetchOutbounds } from "@/lib/sing-box/group";

export const runtime = "edge";

const OPEN_AI_INCLUDE = new Set(["🇺🇸 US 美国"]);

export async function GET(request: NextRequest): Promise<NextResponse> {
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
    ): Record<string, Outbound[]> => {
      for (const group in current) {
        if (!previous[group]) previous[group] = [];
        previous[group].push(...current[group]);
      }
      return previous;
    },
    {},
  );
  const dns: string = request.nextUrl.searchParams.get("dns") || "tuna";
  const tun: boolean = request.nextUrl.searchParams.get("tun") == "true";
  const config: Config = template({ dns: dns, tun: tun });
  const proxy: Selector = config.outbounds.find(
    (outbound: Outbound): boolean => outbound.tag == "PROXY",
  ) as Selector;
  const auto: URLTest = config.outbounds.find(
    (outbound: Outbound): boolean => outbound.tag == "🚀 AUTO",
  ) as URLTest;
  const open_ai: URLTest = config.outbounds.find(
    (outbound: Outbound): boolean => outbound.tag == "💬 OpenAI",
  ) as URLTest;
  for (const group in outbounds) {
    if (group == "🏳️‍🌈 OT 其他") {
      proxy.outbounds.push(group);
      config.outbounds.push({
        type: "selector",
        tag: group,
        outbounds: outbounds[group].map(
          (outbound: Outbound): string => outbound.tag,
        ),
      });
    } else if (group == "💬 OpenAI") {
      open_ai.outbounds.push(
        ...outbounds[group].map((outbound: Outbound): string => outbound.tag),
      );
    } else {
      proxy.outbounds.push(group);
      auto.outbounds.push(group);
      if (OPEN_AI_INCLUDE.has(group)) open_ai.outbounds.push(group);
      config.outbounds.push({
        type: "urltest",
        tag: group,
        outbounds: outbounds[group].map(
          (outbound: Outbound): string => outbound.tag,
        ),
        url: TEST_URL,
      });
    }
  }
  config.outbounds.push(...Object.values(outbounds).flat());
  return new NextResponse(JSON.stringify(config));
}
