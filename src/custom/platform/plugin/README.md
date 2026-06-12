# プラグインレジストリ

## プラグインを追加する手順

1. `src/custom/plugins/<機能名>/` にプラグイン実装を置く（将来の目標レイアウト。現状は `src/custom/` 内の機能単位フォルダ）
2. `PluginDefinition` を定義する（`types.ts` 参照）
3. `bootstrapPlugins.ts` で `registerPlugin()` を呼ぶ
4. `tenants/<顧客>.json` の `plugins` 配列に id を追加する

## 例

```ts
// bootstrapPlugins.ts
import { registerPlugin } from "./registry";
import { storesPlugin } from "@/custom/plugins/stores";

export const bootstrapPlugins = (): void => {
  registerPlugin(storesPlugin);
};
```

```json
// tenants/noexcuse.json
{
  "plugins": ["stores"]
}
```

## 画面・ルートのマウント

現時点ではコア `CRM.tsx` が Resource を固定しているため、**route / Resource のマウントは未実装**。
`plugin-appointments` 設計時に `additionalRoutes` props 等を検討する。

## テスト

```sh
npm run test:unit:app -- src/custom/platform/plugin/registry.test.ts
```
