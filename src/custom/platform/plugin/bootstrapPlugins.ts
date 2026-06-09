import { registerPlugin } from "./registry";
import { storesPlugin } from "@/custom/plugins/stores/plugin";

/**
 * プラグインの静的登録エントリポイント。
 * 新規プラグインはここで registerPlugin() を呼ぶ。
 */
export const bootstrapPlugins = (): void => {
  registerPlugin(storesPlugin);
};
