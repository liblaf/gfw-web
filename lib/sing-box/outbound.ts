import { TEST_URL } from "@/lib/urls";

export type Outbound =
  | OutBoundBase
  | Direct
  | Block
  | HTTP
  | DNS
  | Selector
  | URLTest;

type OutBoundBase = {
  type: string;
  tag: string;
};

type Direct = OutBoundBase & {
  type: "direct";
};

type Block = OutBoundBase & {
  type: "block";
};

type HTTP = OutBoundBase & {
  type: "http";
  server: string;
  server_port: number;
};

type DNS = OutBoundBase & {
  type: "dns";
};

export type Selector = OutBoundBase & {
  type: "selector";
  outbounds: string[];
  default?: string;
};

export type URLTest = OutBoundBase & {
  type: "urltest";
  outbounds: string[];
  url?: string;
  interval?: string;
};

export function template(): Outbound[] {
  return [
    {
      type: "selector",
      tag: "PROXY",
      outbounds: ["🚀 AUTO", "💬 OpenAI"],
      default: "🚀 AUTO",
    },
    {
      type: "urltest",
      tag: "🚀 AUTO",
      outbounds: [],
      url: TEST_URL,
    },
    {
      type: "urltest",
      tag: "💬 OpenAI",
      outbounds: [],
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
  ];
}
