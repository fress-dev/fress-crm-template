# AGENTS.md — Atomic CRM 拡張プロジェクト

> このリポジトリは marmelab/atomic-crm を土台にした、中小企業・個人事業主向け CRM の拡張実装です。
> 最優先方針：**コア（上流コード）を変更せず、縫い目（props / コンポーネント差し替え / 追加）で拡張する。**

## プロジェクト概要
- ベース: marmelab/atomic-crm（MIT, リファレンス実装）
- スタック: React + TypeScript + Shadcn UI + Tailwind CSS + shadcn-admin-kit + TanStack Query + Supabase / Postgres
- 注意: 一般的な「react-admin ベース」の解説は v1.5.0 以降は当てはまらない。shadcn-admin-kit の API を使うこと。

## コマンド（clone 後に Makefile / package.json で実際の定義を確認して更新すること）
- 開発起動: `make start`（Vite dev server + ローカル Supabase + Postgres/Docker, http://localhost:5173/）
- ユニットテスト: `make test`
- e2e テスト: `make test-e2e`
- 型チェック: `npx tsc --noEmit`
- DB マイグレーション適用: `make supabase-migrate-database`
- Lint: `npm run lint`（定義を確認）

## ディレクトリ規約（最重要）
- **エントリ**: `src/App.tsx`
- **設定ハブ**: `src/root/CRM.tsx`（ドメイン設定。原則ここは「読む」だけ。変更が必要なら props 注入で）
- **カスタム実装の置き場所**: `src/custom/`（無ければ作る）。新規コンポーネント・ページ・hooks・ロジックはすべてここ。
- **Supabase**: `supabase/migrations/` は **追加のみ**。

### 触ってはいけない（コア）
- `src/root/**`
- `src/components/**` および各既存リソースフォルダ（contacts / companies / deals / notes など）の既存ファイル
- 既存の `supabase/migrations/*`（過去のマイグレーションは絶対に編集しない）

### 触ってよい
- `src/custom/**`（新規追加するすべて）
- `src/App.tsx`（`<CRM>` への props 注入・カスタムコンポーネント登録のみ。コアロジックの書き換えは不可）
- `supabase/migrations/` への **新規** タイムスタンプ付きマイグレーション追加

## 拡張の優先順位（上から順に検討する）
1. `<CRM>` コンポーネントの props / 設定で実現できないか
2. コンポーネント差し替え（元ファイルを編集せず props で自前コンポーネントを注入）
3. カスタムフィールド / カスタムページの **追加**
4. Supabase 側は新規テーブル・ビュー・RLS ポリシー・Edge Function の **追加** で対応
5. 上記で不可能な場合のみ、コア変更を提案し **必ず人間の承認を得てから** 着手する

## 標準開発フロー

新機能・拡張は **調査 → 計画 → 承認 → 開発 → レビュー → テスト → PR → マージ** の順で進める。

`develop` から作業ブランチを手動で作成する。命名は次のいずれか:

- `feat/platform-<内容>` … ベース・全業界共通
- `feat/plugin-realestate-<内容>` … 不動産プラグイン
- `feat/plugin-beauty-<内容>` … 美容プラグイン
- `fix/<内容>` … バグ修正

**`main` は本番相当 — 直接コミットしない。** PR は作業ブランチ → `develop`。

詳細: [`docs/branch-strategy.md`](docs/branch-strategy.md)、[`docs/development-workflow.md`](docs/development-workflow.md)

## 上流追従
- 上流を `upstream` リモートとして保持する。
- カスタムは `src/custom/` と新規マイグレーションに隔離し、上流更新は rebase / merge で取り込める状態を維持する。

## テスト
- ローカルでは `npx tsc --noEmit` と `make test` を基本とする。
- e2e は触った画面の関連ファイルだけ単体で回す:
    `npx playwright test e2e/<対象>.spec.ts`
- 全 e2e・全ブラウザはローカルで回さない。PR 時に CI が実行する。

## 道具作成の方針
- 新しいスクリプト／CLI／管理ツールを勝手に作らない。
- コマンド一発で済むことはスクリプト化しない。
- 手順は原則 AGENTS.md に文章で書く。道具が必要と判断したら、作る前に理由を述べて人間の承認を得る。

## 完了の定義（Definition of Done）
作業を「完了」と宣言する前に、必ず以下を満たすこと:
1. `make test` が緑（コアのテストが落ちていない＝コア挙動を壊していない）
2. `npx tsc --noEmit` が通る
3. 触った画面に関連する e2e spec をローカルで実行した（フル e2e は CI に任せる）
4. コアパス（上記「触ってはいけない」）の `git diff` が空であることを確認する
5. 変更点と「なぜ縫い目側で実現できたか」を1〜2行で要約する

## 失敗時の学習（ハーネスの育て方）
- エージェントが同じミスを2回したら、その防止策を本ファイルか `.cursor/rules/` に恒久ルールとして追記する。
- ルールは短く具体的に。「決済まわりで使う」ではなく「Stripe Webhook を扱うとき」のように発火条件を明示する。

## 開発フロー

新機能・拡張は次の 8 フェーズで進める。フェーズの状態は **git ブランチと PR** で表現する（状態管理ファイルは使わない）。

| # | フェーズ | 担当 | 内容 |
|---|----------|------|------|
| 1 | 調査 | **@Explore**（ビルトイン） | 現状を調べる。実装はしない |
| 2 | 計画 | **@planner** | 縦切り単位にタスクを分解する |
| 3 | 承認 | **人間** | 計画を確認して OK を出す。**ここで必ず一度止まる** |
| 4 | 開発 | **メインエージェント** | `develop` から命名規則どおりのブランチを切り、縫い目内で実装する（platform / plugin で編集範囲を分ける） |
| 5 | レビュー | **@reviewer**（差分モード） | 検査後、結果を [`docs/review-log.md`](docs/review-log.md) 先頭に追記してコミットする |
| 6 | テスト | **メインエージェント** | `make pre-pr` + 関連 e2e spec のみ（上記「## テスト」参照）。フル e2e は CI |
| 7 | PR | **メインエージェント** | `gh pr create --base develop --body "$(./scripts/pr-body-with-review.sh)"` で PR を作成する（レビュー欄を含む） |
| 8 | マージ承認 | **人間** | PR を確認してマージする |

### 補足

- **`main` へ直接 commit / push しない。** 日常の開発は `develop` 経由（`feat/platform-*` / `feat/plugin-*` / `fix/*` → PR → `develop`）。
- **ベース改修と業界プラグインを同一ブランチに混ぜない。** 詳細は [`docs/branch-strategy.md`](docs/branch-strategy.md)。
- **サブエージェント（@Explore / @planner / @reviewer 等）は `.cursor/rules` を継承しない。** コア保護の要点は本ファイル（および各 `.cursor/agents/*.md`）に記載されている前提で動くこと。
- DB 変更が必要な場合は **@db-migrator** を開発フェーズで呼び出す（追加専用マイグレーションのみ）。

## 言語・表記規約

コミット・PR・カスタム側のソースコメントは **日本語** で書く。詳細は [`.cursor/rules/japanese-conventions.mdc`](.cursor/rules/japanese-conventions.mdc)。

### コミットメッセージ

- 件名・本文とも日本語（変更の理由を簡潔に）。
- 例:

```
見積もり一覧を custom 配下に追加

縫い目で List コンポーネントを差し替え、コアは未変更。
```

### PR

`gh pr create --base develop` ではタイトル・本文を日本語で書く。`.github/pull_request_template.md` をベースにする。

### ソースコメント

| 対象 | コメント言語 |
|------|-------------|
| `src/custom/**` | 日本語 |
| 新規 `supabase/migrations/*` | 日本語（SQL `--` 含む） |
| `src/App.tsx` の追記部分 | 日本語 |
| コア既存ファイル | **触らない**（英語コメントを日本語化しない） |

変数名・関数名・ファイル名は **英語** のまま（既存慣習に合わせる）。

### グローバル設定との関係

Cursor のユーザールールで英語コミットが指定されていても、**本リポジトリでは本節が優先**する。
