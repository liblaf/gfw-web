export const SUB_API: string = process.env.SUB_API || "https://api.v1.mk";
export const TEST_URL: string =
  process.env.TEST_URL || "https://cp.cloudflare.com";

const PROXY_URL: string =
  process.env.PROXY_URL || "https://gfw.liblaf.me/proxy";

export function proxy(url: string): string {
  url = url.replace(/^https?:\/\//, "");
  return `${PROXY_URL}/${url}`;
}
