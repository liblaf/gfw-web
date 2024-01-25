export type Inbound = InboundBase | Mixed | TUN;

type ListenFields = {
  listen?: string;
  listen_port?: number;
  sniff?: boolean;
};

type InboundBase = {
  type: string;
  tag: string;
};

type Mixed = InboundBase &
  ListenFields & {
    type: "mixed";
  };

type TUN = InboundBase &
  ListenFields & {
    type: "tun";
    inet4_address: string;
    inet6_address?: string;
    auto_route?: boolean;
    strict_route?: boolean;
    stack?: "system" | "gvisor" | "mixed";
  };

export type Args = {
  tun: boolean;
};

export function template({ tun }: Args = { tun: false }): Inbound[] {
  return [
    {
      type: "mixed",
      tag: "in-mixed",
      listen: "127.0.0.1",
      listen_port: 2080,
    },
    ...(tun
      ? [
          {
            type: "tun",
            tag: "in-tun",
            inet4_address: "172.19.0.1/30",
            inet6_address: "fdfe:dcba:9876::1/126",
            auto_route: true,
            strict_route: true,
            stack: "mixed",
            sniff: true,
          } as TUN,
        ]
      : []),
  ];
}
