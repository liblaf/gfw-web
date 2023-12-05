export interface Inbound {
  tag: string;
  type: string;
  listen: string;
  listen_port: number;
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
