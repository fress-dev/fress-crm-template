import { registerPlugin } from "./registry";
import { coursesPlugin } from "@/custom/plugins/courses/plugin";
import { membershipsPlugin } from "@/custom/plugins/memberships/plugin";
import { storesPlugin } from "@/custom/plugins/stores/plugin";

/**
 * プラグインの静的登録エントリポイント。
 * 新規プラグインはここで registerPlugin() を呼ぶ。
 */
export const bootstrapPlugins = (): void => {
  registerPlugin(storesPlugin);
  registerPlugin(coursesPlugin);
  registerPlugin(membershipsPlugin);
};
