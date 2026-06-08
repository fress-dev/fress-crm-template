# プラグインレジストリと Extension 契約

> **status:** draft  
> **層:** コア（platform）  
> **ブランチ（予定）:** `feat/platform-plugin-registry`  
> **最終更新:** 2026-06-07  
> **前提:** [platform-tenant-config.md](./platform-tenant-config.md) がマージ済み

## 概要

プラグインを登録・列挙するレジストリと、カスタム層が実装する Extension 契約（型）を `src/custom/platform/` に追加する。テナント JSON の `plugins` 配列と連動し、**プラグイン0本でも起動する** 組み立てを `App.tsx` に実装する。

## 背景・目的

- ジムの予約・契約・セッション記録はコアに無く、これから `feat/plugin-*` で追加する
- 業務コードを `src/custom/` に直書きすると業界差が混ざり、保守が難しくなる（[05-gap-analysis.md](../research/05-gap-analysis.md)）
- **先にレールを敷く** ことで、最初の `plugin-appointments` を「登録するだけ」の形に近づける
- 本 PR では **プラグインの業務実装は含めない**（空のレジストリで動作確認）

## スコープ

### やること

- `PluginDefinition` 型（id, 説明, 依存, 将来の routes/resources スロット）
- `PluginRegistry`（`register`, `get`, `getEnabled(tenant)`）
- `TenantExtension` 契約型（カスタム層の差し込み口・**実装は空でよい**）
- `App.tsx` で `tenant.plugins` に基づく有効プラグイン一覧を解決（ログ or dev 表示のみでも可）
- `resolveAppAssembly(tenant)` のような組み立て関数に集約
- プラグイン開発者向けコメント（`src/custom/platform/plugin/README.md` 短文）
- 単体テスト（レジストリ・有効化フィルタ）

### やらないこと

- `plugin-appointments` 等の業務実装
- コア `CRM.tsx` への Resource / CustomRoutes 追加（コア非変更のため本 PR では不可）
- DB マイグレーション
- npm パッケージ化された動的 import プラグイン（将来検討）

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `PluginRegistry` | コア（platform） | 全テナント共通 |
| `PluginDefinition` | コア（platform） | プラグインの契約 |
| `TenantExtension` 型 | コア（platform） | カスタム層の差し込み口 |
| 各プラグイン実装 | プラグイン | 次 PR 以降 |
| 店舗固有ロジック | カスタム層 | `tenant.extensions` で参照 |

## データ・画面（概要）

### ファイル構成

```
src/custom/platform/plugin/
  types.ts           # PluginDefinition, PluginContext, TenantExtension
  registry.ts        # registerPlugin, getEnabledPlugins
  resolveAssembly.ts # tenant + registry → App に渡す props 一式
  README.md          # プラグイン追加手順（短文）
src/App.tsx          # resolveAssembly 利用
```

### `PluginDefinition` 型（案）

```ts
type PluginDefinition = {
  id: string;                    // 例: "appointments"
  description?: string;
  dependsOn?: string[];            // 他プラグイン ID
  // 以下は将来 PR で実装。本 PR では型のみ定義可
  routes?: unknown;
  resources?: unknown;
  migrations?: string[];
};
```

### `TenantExtension` 型（案）

```ts
/** テナント固有の差し込み。プラグインが定義するフックを実装する */
type TenantExtension = {
  id: string;
  /** 例: 予約作成後のフック（将来） */
  onAppointmentCreated?: (payload: unknown) => Promise<void>;
};
```

`tenant.extensions` はモジュールパス文字列の配列（例: `["./extensions/salus-gym/index.ts"]`）。本 PR では **読み込まない**（型と空配列のパースのみ）。最初のカスタム層が必要になった PR で dynamic import を実装する。

### レジストリの動作

```
起動時:
  1. 全プラグイン定義を registry に静的登録（現時点は register 呼び出し0件でよい）
  2. loadTenantConfig() で tenant.plugins を取得
  3. getEnabledPlugins(tenant.plugins) でフィルタ
  4. 未知の plugin id があれば console.warn（ビルドは通す）
```

### `tenants/salus-gym.json` への追記（案）

```json
{
  "plugins": [],
  "extensions": []
}
```

## プラグインの画面・ルートを載せる問題（重要）

現行の `<CRM>` は `src/components/atomic-crm/root/CRM.tsx` 内で Resource と CustomRoutes が **固定** されている。コア非変更の原則下、本 PR では **新しい画面をプラグインからマウントできない**。

### 本 PR の立場

- レジストリと型で **契約を先に固定** する
- 実際の route / Resource マウントは **次のいずれか** で対応（別設計書・人間承認後）:

| 案 | 層 | メリット | デメリット |
|----|-----|---------|-----------|
| A. コアに `additionalRoutes` props を追加（人間承認） | コア変更 | 最小の縫い目 | upstream マージ時の衝突 |
| B. `src/custom/root/FressCRM.tsx` で CRM をラップし Admin を再構成 | カスタム層 | コア不変 | CRM 内部の複製・追従コスト |
| C. 最初のプラグイン PR で A or B を決める | — | 本 PR を小さく保てる | 1本目のプラグインまで route 不可 |

**推奨:** 本 PR はレジストリまで。**`plugin-appointments` の設計書作成時** に案 A を優先検討（`CRM` の props 拡張が可能か upstream / 縫い目を調査）。

## テナント設定

| キー | 用途 |
|------|------|
| `plugins` | 有効化するプラグイン ID の配列 |
| `extensions` | カスタム層モジュール参照（将来） |

## カスタム層・連携

- `extensions/` ディレクトリは本 PR では作らない
- 連携プラグインは対象外

## コア保護

- [x] `src/components/**` に手を入れない
- [x] プラグイン業務ロジックを書かない
- [x] `App.tsx` は組み立ての呼び出しのみ追加

## テスト方針

- **単体:** `registry.test.ts` — register / getEnabled / 未知 ID の warn
- **`make pre-pr`:** 必須
- **e2e:** プラグイン0本のため既存 spec の regression のみ

## 未決事項・リスク

| 項目 | 内容 |
|------|------|
| プラグインのマウント方法 | 上記 A/B/C。`plugin-appointments` 設計時に決定 |
| 静的 vs 動的登録 | 初版は静的 `registerPlugin()` 呼び出しで十分 |
| `src/plugins/**` 移行 | platform 移行 PR まで `src/custom/platform/plugin/` に置く |

## 実装順序（本 PR 内）

1. `types.ts`
2. `registry.ts` + テスト
3. `resolveAssembly.ts`
4. `App.tsx` 統合
5. `platform/plugin/README.md`
6. `tenants/*.json` に `plugins` / `extensions` 追記

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | |

## 関連

- 先行 PR: [platform-tenant-config.md](./platform-tenant-config.md)
- [plugin-architecture.md](../../architecture/plugin-architecture.md)
- 将来: `plugin-appointments.md`（未作成）
