export interface DNS {
  servers?: Server[];
  rules?: Rule[];
  final?: string;
}

interface Server {
  tag?: string;
  address: string;
  address_resolver?: string;
  detour?: string;
}

// (domain || domain_suffix || domain_keyword || domain_regex || geosite) &&
// (port || port_range) &&
// (source_geoip || source_ip_cidr || source_ip_is_private) &&
// (source_port || source_port_range) &&
// other fields
interface Rule {
  geosite?: string[];
  clash_mode?: string;
  rule_set?: string[];
  outbound?: string[];
  server: string;
  disable_cache?: boolean;
}

export function template(): DNS {
  return {
    servers: [
      {
        tag: "dns-cloudflare",
        address: "https://cloudflare-dns.com/dns-query",
        address_resolver: "dns-tuna",
        detour: "PROXY",
      },
      {
        tag: "dns-tuna",
        address: "https://101.6.6.6/dns-query",
        detour: "DIRECT",
      },
      {
        tag: "dns-alidns",
        address: "https://dns.alidns.com/dns-query",
        address_resolver: "dns-local",
        detour: "DIRECT",
      },
      { tag: "dns-local", address: "local", detour: "DIRECT" },
      { tag: "dns-block", address: "rcode://success" },
    ],
    rules: [
      { outbound: ["any"], server: "dns-tuna" },
      {
        rule_set: ["geosite-category-ads-all"],
        server: "dns-block",
        disable_cache: true,
      },
      { rule_set: ["geoip-cn", "geosite-cn"], server: "dns-tuna" },
      { clash_mode: "Global", server: "dns-cloudflare" },
      { clash_mode: "Direct", server: "dns-local" },
    ],
    final: "dns-cloudflare",
  };
}
