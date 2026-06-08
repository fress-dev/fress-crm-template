# 現行 Fress CRM の提供機能

> **調査元:** 本リポジトリ `fress-crm-template`  
> **最終更新:** 2026-06-08  
> 詳細一覧: [product/crm-features.md](../../product/crm-features.md)

## スタック・拡張方針

| 項目 | 内容 |
|------|------|
| ベース | marmelab/atomic-crm（React + TypeScript + Supabase） |
| 現状の差分 | `src/custom/**` に日本語化・JST・設定マージ |
| コア | `src/components/atomic-crm/**` — **編集禁止** |
| 新規コード | 現状は `src/custom/**` のみ（将来 `src/plugins/**`） |

## コアリソース一覧

`src/components/atomic-crm/root/CRM.tsx` で登録されているリソース:

| リソース | 日本語名 | Salus との対応イメージ |
|----------|----------|----------------------|
| `contacts` | 担当者 | **会員**（User） |
| `companies` | 取引先企業 | 個人ジムではほぼ不要 |
| `deals` | 商談 | 体験〜入会パイプライン（金額中心） |
| `contact_notes` | メモ | セッション簡易メモ程度 |
| `deal_notes` | 商談メモ | 入会商談メモ |
| `tasks` | タスク | フォロー ToDo |
| `tags` | ラベル | 会員区分（月4回等） |
| `sales` | 利用者 | **トレーナー**（Trainer） |

## コアが提供する能力（ジム文脈）

### そのまま使える

| 能力 | 説明 |
|------|------|
| 会員マスタ | Contact の氏名・メール・電話・会社紐づけ・ラベル |
| スタッフ | sales テーブル＝CRM ログインユーザー |
| 営業パイプライン | Deal カンバン（段階・金額・予定日）— 段階名は設定で変更可 |
| メモ | 担当者／商談への記録・添付・見込み |
| タスク | 期限付き ToDo・延期 |
| 検索・CSV | 担当者の検索・入出力 |
| ダッシュボード | 有力顧客・売上予定・最近の動き・タスク |
| 認証 | メール＋パスワード、Google（任意） |
| モバイル PWA | 閲覧中心（商談カンバンは PC のみ） |

### 管理画面でカスタマイズ可能（コード変更なし）

`configuration` テーブル / 管理画面より:

- 商談段階・種類
- タスク種類
- 見込みステータス
- 業種リスト

現状の日本語既定値: `src/custom/configuration/plainJapaneseDefaults.ts`

## src/custom/ の現状（15ファイル）

**ジム固有ロジックは未実装。** すべて日本語化・JST:

| 領域 | パス |
|------|------|
| エントリ | `src/App.tsx` |
| 日本語設定 | `src/custom/configuration/plainJapaneseDefaults.ts` |
| i18n | `src/custom/i18n/` |
| メモ JST | `src/custom/notes/` |
| レイアウト | `src/custom/layout/PlainJapaneseLayout.tsx` |

## プラグインアーキテクチャ（未実装の将来）

[architecture/plugin-architecture.md](../../architecture/plugin-architecture.md) より:

| 層 | ジムで必要になりうるもの | 状態 |
|----|------------------------|------|
| コア | レジストリ・組み立て | **未実装** |
| テナント設定 | `tenants/<店舗>.json` — 段階名・有効プラグイン | **未作成** |
| プラグイン | appointments、会員プラン等 | **未作成** |
| カスタム層 | 店舗固有の例外 | 必要時のみ |

## コアにないもの（Salus と比較して）

| Salus にある | CRM コア |
|-------------|----------|
| カレンダー予約 | なし |
| 回数券（チケット） | なし |
| コース商品マスタ | なし |
| 契約（利用枠） | 商談はあるが回数券モデルではない |
| セッション身体データ | なし（メモのみ） |
| 種目記録（セット・重量） | なし |
| 店舗・部屋 | なし |
| 身体グラフ | なし |
| 一括予約 | なし |
| スケジュール種別（カウンセリング等） | なし |

## 次のドキュメント

- [05-gap-analysis.md](./05-gap-analysis.md) — 切り分け論点（ご確認用）
