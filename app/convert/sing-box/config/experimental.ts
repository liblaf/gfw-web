import { proxy } from "@/app/convert/urls";

export interface Experimental {
  cache_file?: CacheFile;
  clash_api?: ClashAPI;
}

interface CacheFile {
  enabled?: boolean;
}

interface ClashAPI {
  external_controller?: string;
  external_ui?: string;
  external_ui_download_url?: string;
  external_ui_download_detour?: string;
  secret?: string;
  default_mode?: string;
}

export function template(): Experimental {
  return {
    cache_file: {
      enabled: true,
    },
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_detour: proxy(
        "https://github.com/MetaCubeX/Yacd-meta/archive/gh-pages.zip"
      ),
      external_ui_download_url: "DIRECT",
    },
  };
}
