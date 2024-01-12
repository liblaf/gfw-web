import { TEST_URL } from "@/app/convert/urls";

export type Outbound =
  | IOutBound
  | Direct
  | Block
  | HTTP
  | DNS
  | Selector
  | URLTest;

interface IOutBound {
  type: string;
  tag: string;
}

interface Direct extends IOutBound {
  type: "direct";
}

interface Block extends IOutBound {
  type: "block";
}

interface HTTP extends IOutBound {
  type: "http";
  server: string;
  server_port: number;
}

interface DNS extends IOutBound {
  type: "dns";
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
      outbounds: ["🚀 AUTO", "💬 OpenAI", "☁️ WARP"],
      default: "🚀 AUTO",
    },
    {
      type: "urltest",
      tag: "🚀 AUTO",
      outbounds: ["☁️ WARP"],
      url: TEST_URL,
    },
    {
      type: "urltest",
      tag: "💬 OpenAI",
      outbounds: [],
      url: TEST_URL,
    },
    {
      type: "http",
      tag: "☁️ WARP",
      server: "127.0.0.1",
      server_port: 40000,
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
  ];
}
