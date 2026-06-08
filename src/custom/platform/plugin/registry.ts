import type { PluginDefinition } from "./types";

const definitions = new Map<string, PluginDefinition>();

/** プラグインをレジストリに登録する（起動時に静的呼び出し） */
export const registerPlugin = (definition: PluginDefinition): void => {
  if (definitions.has(definition.id)) {
    if (import.meta.env.DEV) {
      console.warn(`[plugin] 重複登録をスキップ: ${definition.id}`);
    }
    return;
  }
  definitions.set(definition.id, definition);
};

export const getPlugin = (id: string): PluginDefinition | undefined =>
  definitions.get(id);

export const getAllPlugins = (): PluginDefinition[] =>
  Array.from(definitions.values());

export type ResolvePluginsOptions = {
  warnUnknown?: boolean;
};

const sortByDependencies = (
  plugins: PluginDefinition[],
): PluginDefinition[] => {
  const byId = new Map(plugins.map((p) => [p.id, p]));
  const sorted: PluginDefinition[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (plugin: PluginDefinition): void => {
    if (visited.has(plugin.id)) return;
    if (visiting.has(plugin.id)) {
      if (import.meta.env.DEV) {
        console.warn(`[plugin] 循環依存を検出: ${plugin.id}`);
      }
      return;
    }
    visiting.add(plugin.id);
    for (const depId of plugin.dependsOn ?? []) {
      const dep = byId.get(depId);
      if (dep) visit(dep);
    }
    visiting.delete(plugin.id);
    visited.add(plugin.id);
    sorted.push(plugin);
  };

  for (const plugin of plugins) {
    visit(plugin);
  }
  return sorted;
};

/**
 * テナントの plugins 配列に基づき有効なプラグイン一覧を返す。
 * 未知の id は warn してスキップする（ビルドは通す）。
 */
export const getEnabledPlugins = (
  pluginIds: string[],
  options: ResolvePluginsOptions = {},
): PluginDefinition[] => {
  const warnUnknown = options.warnUnknown ?? true;
  const enabled: PluginDefinition[] = [];
  const enabledIdSet = new Set<string>();

  for (const id of pluginIds) {
    const def = definitions.get(id);
    if (!def) {
      if (warnUnknown && import.meta.env.DEV) {
        console.warn(
          `[plugin] 未知の plugin id: "${id}"（registerPlugin されていません）`,
        );
      }
      continue;
    }
    enabled.push(def);
    enabledIdSet.add(id);
  }

  for (const def of enabled) {
    for (const depId of def.dependsOn ?? []) {
      if (!enabledIdSet.has(depId) && import.meta.env.DEV) {
        console.warn(
          `[plugin] "${def.id}" は "${depId}" に依存しますが、テナントの plugins に含まれていません`,
        );
      }
    }
  }

  return sortByDependencies(enabled);
};

/** 単体テスト用 — 本番コードからは呼ばない */
export const clearPluginRegistryForTesting = (): void => {
  definitions.clear();
};
