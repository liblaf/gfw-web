export const SUB_API = process.env.SUB_API || "https://api.v1.mk";
export const TEST_URL = process.env.TEST_URL || "https://gfw.liblaf.me";

const PROXY_URL = process.env.PROXY_URL || "https://gfw.liblaf.me/proxy";

export function proxy(url: string): string {
  url = url.replace(/^https?:\/\//, "");
  return `${PROXY_URL}/${url}`;
}
