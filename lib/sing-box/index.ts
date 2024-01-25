import * as dns from "./dns";
import * as experimental from "./experimental";
import * as inbound from "./inbound";
import * as log from "./log";
import * as outbound from "./outbound";
import * as route from "./route";

export type Config = {
  log: log.Log;
  dns: dns.DNS;
  inbounds: inbound.Inbound[];
  outbounds: outbound.Outbound[];
  route: route.Route;
  experimental: experimental.Experimental;
};

export type Args = dns.Args & inbound.Args;

export function template(config: Args = { dns: "tuna", tun: false }): Config {
  return {
    log: log.template(),
    dns: dns.template(config),
    inbounds: inbound.template(config),
    outbounds: outbound.template(),
    route: route.template(),
    experimental: experimental.template(),
  };
}
