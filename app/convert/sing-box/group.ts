import { tw2cn } from "cjk-conv";
import { SUB_API } from "../urls";
import { Config } from "./config";
import { Outbound } from "./config/outbound";

const FILTER_OUT_TYPES = new Set([
  "direct",
  "block",
  "dns",
  "selector",
  "urltest",
]);

const PROVIDERS: Record<string, string> = {
  "apiv2.lipulai.com": "FastLink",
  "www.sub-nthu.com": "NTHU.CC",
};

const GROUP_PATTERNS: Record<string, Record<string, RegExp>> = {
  default: {
    "🇦🇷 AR 阿根廷": /🇦🇷|\bAR\b|阿根廷/i,
    "🇦🇺 AU 澳大利亚": /🇦🇺|\bAU\b|澳大利亚/i,
    "🇧🇷 BR 巴西": /🇧🇷|\bBR\b|巴西/i,
    "🇨🇦 CA 加拿大": /🇨🇦|\bCA\b|加拿大/i,
    "🇨🇭 CH 瑞士": /🇨🇭|\bCH\b|瑞士/i,
    "🇩🇪 DE 德国": /🇩🇪|\bDE\b|德国/i,
    "🇪🇸 ES 西班牙": /🇪🇸|\bES\b|西班牙/i,
    "🇫🇷 FR 法国": /🇫🇷|\bFR\b|法国/i,
    "🇬🇧 UK 英国": /🇬🇧|\bUK\b|英国/i,
    "🇭🇰 HK 香港": /🇭🇰|\bHK\b|港/i,
    "🇮🇪 IE 爱尔兰": /🇮🇪|\bIE\b|爱尔兰/i,
    "🇮🇱 IL 以色列": /🇮🇱|\bIL\b|以色列/i,
    "🇮🇳 IN 印度": /🇮🇳|\bIN\b|印度/i,
    "🇯🇵 JP 日本": /🇯🇵|\bJP\b|日|东京/i,
    "🇰🇷 KR 韩国": /🇰🇷|\bKR\b|韩国/i,
    "🇳🇱 NL 荷兰": /🇳🇱|\bNL\b|荷兰/i,
    "🇳🇴 NO 挪威": /🇳🇴|\bNO\b|挪威/i,
    "🇷🇺 RU 俄罗斯": /🇷🇺|\bRU\b|俄罗斯/i,
    "🇷🇺 SG 新加坡": /🇷🇺|\bSG\b|新/i,
    "🇸🇪 SE 瑞典": /🇸🇪|\bSE\b|瑞典/i,
    "🇹🇭 TH 泰国": /🇹🇭|\bTH\b|泰国/i,
    "🇹🇷 TR 土耳其": /🇹🇷|\bTR\b|土耳其/i,
    "🇹🇼 TW 台湾": /🇹🇼|\bTW\b|台/i,
    "🇺🇦 UA 乌克兰": /🇺🇦|\bUA\b|乌克兰/i,
    "🇺🇸 US 美国": /🇺🇸|\bUS\b|美/i,
    "🇿🇦 ZA 南非": /🇿🇦|\bZA\b|南非/i,
  },
};

export async function fetchOutbounds(
  sub: URL,
): Promise<Record<string, Outbound[]>> {
  const url = new URL("/sub", SUB_API);
  url.searchParams.set("url", sub.href);
  url.searchParams.set("target", "singbox");
  const response = await fetch(url);
  const config: Config = await response.json();
  const outbounds = config.outbounds
    .filter((outbound: Outbound) => !FILTER_OUT_TYPES.has(outbound.type))
    .map((outbound: Outbound) => {
      outbound.tag = tw2cn(outbound.tag);
      return outbound;
    });
  const provider = PROVIDERS[sub.hostname] || sub.hostname;
  const group_pattern = GROUP_PATTERNS[provider] || GROUP_PATTERNS.default;
  return outbounds.reduce(
    (previous: Record<string, Outbound[]>, current: Outbound) => {
      const group =
        Object.keys(group_pattern).find((key) => {
          return group_pattern[key].test(current.tag);
        }) || "🏳️‍🌈 OT 其他";
      if (!previous[group]) previous[group] = [];
      current.tag += ` [${provider}]`;
      previous[group].push(current);
      return previous;
    },
    {},
  );
}
