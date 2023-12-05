import { TEST_URL } from "../../urls";

export type Outbound = IOutBound | HTTP | Selector | URLTest;

interface IOutBound {
  tag: string;
  type: string;
}

interface HTTP extends IOutBound {
  type: "http";
  server: string;
  server_port: number;
}

export interface Selector extends IOutBound {
  type: "selector";
  outbounds: string[];
  default?: string;
}

export interface URLTest extends IOutBound {
  type: "urltest";
  outbounds: string[];
  url?: string;
  interval?: string;
}

export function template(): Outbound[] {
  return [
    {
      type: "selector",
      tag: "PROXY",
      outbounds: ["AUTO", "WARP"],
      default: "AUTO",
    },
    {
      type: "urltest",
      tag: "AUTO",
      outbounds: ["WARP"],
      url: TEST_URL,
    },
    {
      type: "direct",
      tag: "DIRECT",
    },
    {
      type: "block",
      tag: "BLOCK",
    },
    {
      type: "dns",
      tag: "out-dns",
    },
    {
      type: "http",
      tag: "WARP",
      server: "127.0.0.1",
      server_port: 40000,
    },
  ];
}
