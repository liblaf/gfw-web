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

interface Rule {
  geosite?: string[];
  clash_mode?: string;
  outbound?: string[];
  server: string;
  disable_cache?: boolean;
}

export function template(): DNS {
  return {
    servers: [
      {
        tag: "Cloudflare",
        address: "https://cloudflare-dns.com/dns-query",
        address_resolver: "TUNA",
        detour: "PROXY",
      },
      { tag: "TUNA", address: "https://101.6.6.6/dns-query", detour: "DIRECT" },
      {
        tag: "AliDNS",
        address: "https://dns.alidns.com/dns-query",
        address_resolver: "dns-local",
        detour: "DIRECT",
      },
      { tag: "dns-local", address: "local", detour: "DIRECT" },
      { tag: "dns-block", address: "rcode://success" },
    ],
    rules: [
      { outbound: ["any"], server: "TUNA" },
      {
        geosite: ["category-ads-all"],
        server: "dns-block",
        disable_cache: true,
      },
      { geosite: ["cn"], server: "TUNA" },
      { clash_mode: "global", server: "Cloudflare" },
      { clash_mode: "direct", server: "dns-local" },
    ],
    final: "Cloudflare",
  };
}
