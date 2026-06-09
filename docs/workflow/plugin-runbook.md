# プラグイン運用 Runbook

> **最終更新:** 2026-06-10  
> **方針:** [architecture/plugin-architecture.md](../architecture/plugin-architecture.md) の「プラグインの有効化・停止・削除」  
> **teardown テンプレ:** [design/_template-teardown.md](./design/_template-teardown.md)

人間が `tenants/<id>.json` でプラグインを有効化・停止・強制削除するときの手順。  
**現状は JSON 管理のみ**（ON/OFF 画面は将来）。

## 前提

| 項目 | 内容 |
|------|------|
| 設定ファイル | `tenants/<id>.json` の `plugins` 配列 |
| テナント選択 | `VITE_TENANT_ID`（未指定時 `default`） |
| JSON の反映 | **ビルド時にバンドル**される。本番は JSON 変更後に **再ビルド・再デプロイ** が必要 |
| migration | DB 全体に適用（テナントごとではない）。**追加のみ**（既存ファイルは編集しない） |
| コード登録 | `bootstrapPlugins()` で `registerPlugin` 済みであること |

---

## ① JSON 依存チェック（実施タイミング: 有効化・停止の前）

`PluginDefinition.dependsOn` と `plugins` 配列を突き合わせる。  
不一致でも起動はするが（DEV は warn のみ）、**機能欠落や実行時エラー**の原因になる。

### チェック手順

1. 対象プラグインの `src/custom/plugins/<id>/plugin.ts` を開き、`dependsOn` を確認する。
2. `tenants/<id>.json` の `plugins` に、**依存先 id がすべて含まれるか**を見る。
3. 停止するときは、**他の有効プラグインがこの id に dependsOn していないか**を見る。

### 例: `stores`（依存なし）

```json
{
  "id": "noexcuse",
  "plugins": ["stores"],
  "extensions": []
}
```

単体で有効化してよい。

### 例: 将来 `appointments` が `dependsOn: ["stores"]` のとき

**OK — 依存を満たす**

```json
{
  "plugins": ["stores", "appointments"]
}
```

```json
{
  "plugins": ["appointments", "stores"]
}
```

配列の順序は不問（レジストリが依存順にソートする）。

**NG — 依存不足（DEV で warn、予約側が店舗なしで動く／壊れる）**

```json
{
  "plugins": ["appointments"]
}
```

→ `"stores"` を追加するか、`"appointments"` を外す。

### 例: `stores` を停止したいが `appointments` が有効

**NG — 依存プラグインが先に残っている**

```json
{
  "plugins": ["stores", "appointments"]
}
```

`stores` だけ外す:

```json
{
  "plugins": ["appointments"]
}
```

→ **先に `appointments` を外す**か、予約プラグイン側で stores なしでも動く設計にしてから `stores` を停止する。

### チェックリスト

- [ ] 追加する id は `registerPlugin` 済みか（typo だと未知 id としてスキップされる）
- [ ] 各有効プラグインの `dependsOn` が `plugins` に含まれているか
- [ ] 停止する id に依存する別プラグインを同時に有効にしていないか

---

## 有効化（ON）

**目的:** 機能を使えるようにする。DB に未適用の migration があれば適用する。

### 手順

```sh
# 1. 依存チェック（上記）を実施

# 2. tenants/<id>.json の plugins に id を追加
#    例: "plugins": ["stores"]

# 3. プラグイン PR で追加された migration を適用（未適用の環境のみ）
make dev
# または対象環境で supabase db push 等

# 4. 再ビルド・再起動（本番はデプロイ）
VITE_TENANT_ID=noexcuse make start
# 本番: VITE_TENANT_ID=<id> で build → デプロイ

# 5. 動作確認
#    - ナビにプラグインの Resource が出るか
#    - 一覧・作成・検索が動くか
#    - コア画面（担当者など）が壊れていないか
```

### 注意

- migration は **JSON とは独立**して DB に残る。過去に一度適用済みなら、JSON を再度 ON にしただけでは migration は走らない（**データは残っていることが多い**）。
- 有効化用 migration は `PluginDefinition.migrations` に列挙されている（参照用）。

---

## 停止（通常の OFF）

**目的:** 機能だけ止める。**DB・データは残す**（再有効化可能）。

### 手順

```sh
# 1. 依存チェック — 他プラグインがこの id に dependsOn していないか

# 2. tenants/<id>.json の plugins から id を削除

# 3. 再ビルド・再起動（本番はデプロイ）
VITE_TENANT_ID=<id> make start

# 4. 動作確認
#    - プラグインのナビ・画面が消えているか
#    - コアの担当者 新規作成・編集・一覧がエラーなく動くか
#    - （stores の場合）在籍店舗フィールドが出ないか
```

### migration

**不要。** 実行時ガード（`isXxxPluginEnabled()`）でコアにフォールバックする。

### 停止後も DB に残るもの

- プラグイン用テーブル（例: `stores`）
- コアテーブルへの追加カラム（例: `contacts.store_id`）
- データ本体

コアはこれらを**無視して**動作する（カラムは nullable であること）。

---

## 強制削除（例外）

**目的:** 誤導入・完全撤去。**データ消失を承知**してスキーマを DROP する。

通常の停止では行わない。バックアップ後に実施する。

### 手順

```sh
# 1. まず「停止」と同様に plugins から id を外し、コア動作を確認

# 2. バックアップ（本番は必須）
#    pg_dump 等で対象 DB を取得

# 3. teardown 用 migration を新規作成（テンプレに従う）
#    docs/workflow/design/_template-teardown.md
#    feat/platform-<plugin>-teardown 等のブランチで PR

# 4. migration 適用
make dev
# または supabase db push

# 5. コード整理（別 PR でも可）
#    - bootstrapPlugins から registerPlugin を外す
#    - vite override・i18n・専用ラッパーを整理
#    - PluginDefinition.migrations から teardown ファイルを追記

# 6. 再ビルド・動作確認（コアのみで問題ないこと）
```

### stores の参考 SQL

実ファイルは PR 時に `supabase/migrations/<timestamp>_stores_teardown.sql` として追加する。  
内容の骨子は [design/_template-teardown.md](./design/_template-teardown.md) の「stores 具体例」を参照。

---

## 再有効化

停止後（teardown **未実施**）に `plugins` に id を戻す。

- **データ:** テーブル・`store_id` 等は残っているため、**そのまま復活**することが多い
- **手順:** 有効化と同様（JSON 追加 → 再ビルド）。migration は既適用なら不要
- **teardown 後:** スキーマが消えているため、有効化 migration 相当の状態が必要（通常は新環境扱い）

---

## トラブルシュート

| 症状 | よくある原因 | 対処 |
|------|-------------|------|
| JSON で OFF にしたのに画面が残る | 再ビルド・再起動していない | `make start` や本番デプロイ |
| 担当者の新規作成が失敗 | `store_id` NOT NULL 等（古い migration） | nullable 化 migration を適用済みか確認 |
| `plugins` に書いたのに効かない | id の typo / 未 register | DEV コンソールの `[plugin] 未知の plugin id` を確認 |
| 予約だけ有効にしたらおかしい | dependsOn 不足 | JSON に依存先を追加 |
| 強制削除後に再有効化できない | teardown 済み | 追加 migration からやり直し（データは復元不可） |

---

## 関連

- [architecture/plugin-architecture.md](../architecture/plugin-architecture.md)
- [design/_template-teardown.md](./design/_template-teardown.md)
- [`.cursor/rules/implementation-patterns.mdc`](../../.cursor/rules/implementation-patterns.mdc)
