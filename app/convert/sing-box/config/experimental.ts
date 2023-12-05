import { proxy } from "@/app/convert/urls";

export interface Experimental {
  clash_api?: {
    external_controller?: string;
    external_ui?: string;
    external_ui_download_url?: string;
    external_ui_download_detour?: string;
  };
}

export function template(): Experimental {
  return {
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_detour: proxy(
        "https://github.com/liblaf/Yacd-meta/archive/gh-pages.zip",
      ),
      external_ui_download_url: "DIRECT",
    },
  };
}
