import * as dns from "./dns";
import * as experimental from "./experimental";
import * as inbound from "./inbound";
import * as log from "./log";
import * as outbound from "./outbound";
import * as route from "./route_";

export interface Config {
  log: log.Log;
  dns: dns.DNS;
  inbounds: inbound.Inbound[];
  outbounds: outbound.Outbound[];
  route: route.Route;
  experimental: experimental.Experimental;
}

export function template(config: { tun: boolean } = { tun: false }): Config {
  return {
    log: log.template(),
    dns: dns.template(),
    inbounds: inbound.template({ tun: config.tun }),
    outbounds: outbound.template(),
    route: route.template(),
    experimental: experimental.template(),
  };
}
