import { proxy } from "@/lib/urls";

export type Route = {
  geoip?: GeoIP;
  geosite?: GeoSite;
  rules?: RouteRule[];
  rule_set?: RuleSet[];
  final?: string;
};

type GeoIP = {
  download_url?: string;
  download_detour?: string;
};

type GeoSite = {
  download_url?: string;
  download_detour?: string;
};

// (domain || domain_suffix || domain_keyword || domain_regex || geosite || geoip || ip_cidr || ip_is_private) &&
// (port || port_range) &&
// (source_geoip || source_ip_cidr || source_ip_is_private) &&
// (source_port || source_port_range) &&
// other fields
type RouteRule = {
  protocol?: string[];
  domain_suffix?: string[];
  ip_is_private?: boolean;
  clash_mode?: string;
  rule_set?: string[];
  outbound: string;
};

type RuleSet = RuleSetLocal | RuleSetRemote;

type RuleSetBase = {
  type: "local" | "remote";
  tag: string;
  format: "source" | "binary";
};

type RuleSetLocal = RuleSetBase & {
  type: "local";
  path: string;
};

type RuleSetRemote = RuleSetBase & {
  type: "remote";
  url: string;
  download_detour?: string;
};

export function template(): Route {
  return {
    rules: [
      {
        protocol: ["dns"],
        outbound: "out-dns",
      },
      {
        rule_set: ["geosite-category-ads-all"],
        outbound: "BLOCK",
      },
      {
        domain_suffix: ["byr.pt", "gfw.liblaf.me"],
        ip_is_private: true,
        rule_set: ["geoip-cn", "geosite-cn", "geosite-private"],
        outbound: "DIRECT",
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
        rule_set: ["geosite-bing", "geosite-openai"],
        outbound: "💬 OpenAI",
      },
    ],
    rule_set: [
      {
        type: "remote",
        tag: "geoip-cn",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        ),
        download_detour: "DIRECT",
      },
      {
        type: "remote",
        tag: "geosite-bing",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-bing.srs",
        ),
        download_detour: "DIRECT",
      },
      {
        type: "remote",
        tag: "geosite-category-ads-all",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        ),
        download_detour: "DIRECT",
      },
      {
        type: "remote",
        tag: "geosite-cn",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        ),
        download_detour: "DIRECT",
      },
      {
        type: "remote",
        tag: "geosite-openai",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-openai.srs",
        ),
        download_detour: "DIRECT",
      },
      {
        type: "remote",
        tag: "geosite-private",
        format: "binary",
        url: proxy(
          "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-private.srs",
        ),
        download_detour: "DIRECT",
      },
    ],
    final: "PROXY",
  };
}
