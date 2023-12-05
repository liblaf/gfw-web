import { proxy } from "@/app/convert/urls";

export interface Route {
  geoip?: GeoIP;
  geosite?: GeoSite;
  rules: RouteRule[];
  final?: string;
}

interface GeoIP {
  download_url?: string;
  download_detour?: string;
}

interface GeoSite {
  download_url?: string;
  download_detour?: string;
}

interface RouteRule {
  protocol?: string[];
  domain?: string[];
  domain_suffix?: string[];
  geosite?: string[];
  geoip?: string[];
  clash_mode?: string;
  outbound: string;
}

export function template(): Route {
  return {
    geoip: {
      download_url: proxy(
        "https://github.com/SagerNet/sing-geoip/releases/latest/download/geoip.db",
      ),
      download_detour: "DIRECT",
    },
    geosite: {
      download_url: proxy(
        "https://github.com/SagerNet/sing-geosite/releases/latest/download/geosite.db",
      ),
      download_detour: "DIRECT",
    },
    rules: [
      {
        geosite: ["category-ads-all"],
        outbound: "BLOCK",
      },
      {
        protocol: ["dns"],
        outbound: "out-dns",
      },
      {
        clash_mode: "global",
        outbound: "PROXY",
      },
      {
        clash_mode: "direct",
        outbound: "DIRECT",
      },
      {
        domain: ["chat.liblaf.me"],
        outbound: "PROXY",
      },
      {
        domain_suffix: ["byr.pt", "liblaf.me"],
        geoip: ["cn", "private"],
        geosite: ["cn"],
        outbound: "DIRECT",
      },
    ],
    final: "PROXY",
  };
}
