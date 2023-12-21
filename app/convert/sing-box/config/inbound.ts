export type Inbound = IInbound | Mixed | TUN;

interface IInbound {
  tag: string;
  type: string;
}

interface Mixed extends IInbound, ListenFields {
  type: "mixed";
}

interface TUN extends IInbound, ListenFields {
  type: "tun";
  inet4_address: string;
  auto_route?: boolean;
  strict_route?: boolean;
  stack?: "system" | "gvisor" | "mixed";
}

interface ListenFields {
  listen?: string;
  listen_port?: number;
  sniff?: boolean;
}

export function template(): Inbound[] {
  return [
    {
      type: "mixed",
      tag: "in-mixed",
      listen: "127.0.0.1",
      listen_port: 2080,
    },
  ];
}
