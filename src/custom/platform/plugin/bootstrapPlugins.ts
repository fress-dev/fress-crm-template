import { registerPlugin } from "./registry";
import { appointmentsPlugin } from "@/custom/plugins/appointments/plugin";
import { coursesPlugin } from "@/custom/plugins/courses/plugin";
import { membershipsPlugin } from "@/custom/plugins/memberships/plugin";
import { roomsPlugin } from "@/custom/plugins/rooms/plugin";
import { sessionLogPlugin } from "@/custom/plugins/sessionLog/plugin";
import { storesPlugin } from "@/custom/plugins/stores/plugin";
import { trainingContentPlugin } from "@/custom/plugins/trainingContent/plugin";

/**
 * プラグインの静的登録エントリポイント。
 * 新規プラグインはここで registerPlugin() を呼ぶ。
 */
export const bootstrapPlugins = (): void => {
  registerPlugin(storesPlugin);
  registerPlugin(coursesPlugin);
  registerPlugin(membershipsPlugin);
  registerPlugin(roomsPlugin);
  registerPlugin(appointmentsPlugin);
  registerPlugin(sessionLogPlugin);
  registerPlugin(trainingContentPlugin);
};
