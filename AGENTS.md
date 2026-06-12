# AGENTS.md — Atomic CRM 拡張プロジェクト

> このリポジトリは marmelab/atomic-crm を土台にした、中小企業・個人事業主向け CRM の拡張実装です。
> 最優先方針：**コア（上流コード）を変更せず、縫い目（props / コンポーネント差し替え / 追加）で拡張する。**

## プロジェクト概要
- ベース: marmelab/atomic-crm（MIT, リファレンス実装）
- スタック: React + TypeScript + Shadcn UI + Tailwind CSS + shadcn-admin-kit + TanStack Query + Supabase / Postgres
- 注意: 一般的な「react-admin ベース」の解説は v1.5.0 以降は当てはまらない。shadcn-admin-kit の API を使うこと。

## コマンド（clone 後に Makefile / package.json で実際の定義を確認して更新すること）
- 開発起動: `make start` / `make dev`（Supabase 起動 + 未適用マイグレーション適用 + Vite, http://localhost:5173/）
- ユニットテスト: `make test`
- e2e テスト: `make test-e2e`
- 型チェック: `npm run typecheck`（PR 前は `make pre-pr` に含まれる）
- DB マイグレーション適用: `make supabase-migrate-database`
- Lint: `npm run lint`（定義を確認）

## ディレクトリ規約（最重要）

**現状のルールが常に優先。** [`docs/architecture/plugin-architecture.md`](docs/architecture/plugin-architecture.md) の `src/platform/**`・`src/plugins/**`・`tenants/**` は将来の目標レイアウト。platform 移行 PR がマージされるまで、新規コードは `src/custom/**` に置く。

- **エントリ**: `src/App.tsx`
- **設定ハブ**: `src/root/CRM.tsx`（ドメイン設定。原則ここは「読む」だけ。変更が必要なら props 注入で）
- **カスタム実装の置き場所（現状）**: `src/custom/`（無ければ作る）。新規コンポーネント・ページ・hooks・ロジックはすべてここ。
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

プラグイン・テナント設定・カスタム層の設計判断に迷ったら [`docs/architecture/plugin-architecture.md`](docs/architecture/plugin-architecture.md) を先に読む。

マスタ管理・CRUD・検索・削除・dataProvider を触る場合は [`.cursor/rules/implementation-patterns.mdc`](.cursor/rules/implementation-patterns.mdc) の実装パターンに従う。

機能実装の依頼を受けたら、**先に [`docs/workflow/design/`](docs/workflow/design/) に設計書を書く**（[_template.md`](docs/workflow/design/_template.md) を使用）。**1 設計書 = 1 PR**。大きな依頼は分割案を提示してから各設計書を draft で作成する。`status: approved` になるまで**実装しない**。**実装完了〜PR 作成時**に設計書を `docs/workflow/design/archive/` へ移動し、以降**参照しない**（改修はコード優先。設計書に書いたが未実装の範囲は、必要になったら別の設計書を新規作成）。`docs/workflow/design/archive/` は読まない。`fix/*` の単純修正は除外可。

## 標準開発フロー

新機能・拡張は **調査 → 設計書 → 承認 → 開発 → レビュー → テスト → PR → マージ** の順で進める。

`develop` から作業ブランチを手動で作成する。命名は次のいずれか:

- `feat/platform-<内容>` … コア（レジストリ・テナント設定・組み立て）
- `feat/plugin-<機能名>-<内容>` … プラグイン（**優先**。例: `feat/plugin-appointments-form`）
- `feat/plugin-realestate-<内容>` / `feat/plugin-beauty-<内容>` … 機能名で切れない業界専用ドメインのみ
- `fix/<内容>` … バグ修正

**`main` は本番相当 — 直接コミットしない。** PR は作業ブランチ → `develop`。

詳細: [`docs/harness/README.md`](docs/harness/README.md)、[`docs/workflow/branch-strategy.md`](docs/workflow/branch-strategy.md)、[`docs/workflow/development.md`](docs/workflow/development.md)

## 上流追従
- 上流を `upstream` リモートとして保持する。
- カスタムは `src/custom/` と新規マイグレーションに隔離し、上流更新は rebase / merge で取り込める状態を維持する。

## テスト
- PR 前のローカルゲート: `make pre-pr`（Prettier / lint / `npm run typecheck` / unit / build）
- e2e は触った画面の関連 spec だけ単体で回す:
    `npx playwright test e2e/<対象>.spec.ts`
- **フル e2e（`make test-e2e`）はローカル必須にしない。** PR 時に CI（`make test-e2e-ci`）が実行する。

## 道具作成の方針
- 新しいスクリプト／CLI／管理ツールを勝手に作らない。
- コマンド一発で済むことはスクリプト化しない。
- 手順は原則 AGENTS.md に文章で書く。道具が必要と判断したら、作る前に理由を述べて人間の承認を得る。

## 完了の定義（Definition of Done）
作業を「完了」と宣言する前に、必ず以下を満たすこと:
1. `make pre-pr` が緑（または同等: `make test` + `npm run typecheck` + lint）
2. 触った画面に関連する e2e spec をローカルで実行した（フル e2e は CI に任せる）
3. コアパス（上記「触ってはいけない」）の `git diff` が空であることを確認する
4. 変更点と「なぜ縫い目側で実現できたか」を1〜2行で要約する

## 失敗時の学習（ハーネスの育て方）
- エージェントが同じミスを2回したら、その防止策を本ファイルか `.cursor/rules/` に恒久ルールとして追記する。
- ルールは短く具体的に。「決済まわりで使う」ではなく「Stripe Webhook を扱うとき」のように発火条件を明示する。

## 開発フロー

新機能・拡張は次の 8 フェーズで進める。フェーズの状態は **git ブランチと PR** で表現する（状態管理ファイルは使わない）。

| # | フェーズ | 担当 | 内容 |
|---|----------|------|------|
| 1 | 調査 | **@Explore**（ビルトイン） | 現状を調べる。実装はしない |
| 2 | 設計書 | **メインエージェント** | [`docs/workflow/design/<機能名>.md`](docs/workflow/design/) を `draft` で作成（必要なら @planner の分解を反映） |
| 3 | 設計承認 | **人間** | 設計書を確認して OK。**ここで必ず一度止まる**。OK 後に `approved` に更新 |
| 4 | 開発 | **メインエージェント** | `develop` から命名規則どおりのブランチを切り、縫い目内で実装する |
| 5 | レビュー | **@reviewer** → **メインエージェント** | @reviewer は検査結果のみ返す（readonly）。メインが [`docs/logs/review-log.md`](docs/logs/review-log.md) 先頭に追記。設計書と実装の差があれば設計書も更新 |
| 6 | テスト | **メインエージェント** | `make pre-pr` + 関連 e2e spec のみ（上記「## テスト」参照）。フル e2e は CI |
| 7 | PR | **メインエージェント** | 設計書を `docs/workflow/design/archive/` へ移動 → `git push` → `gh pr create --base develop --body "$(./scripts/pr-body-with-review.sh)"`（設計書パスを本文に含める。**push / PR 前の人間確認は不要**） |
| 8 | マージ承認 | **人間** | PR を確認してマージ |

### 補足

- **push / PR 作成:** DoD 達成後は人間の push 前確認を待たず、コミット → push → PR 作成まで進めてよい（MAIN / sub 全セッション共通）。詳細は [`.cursor/rules/agent-autonomy.mdc`](.cursor/rules/agent-autonomy.mdc)。
- **`main` へ直接 commit / push しない。** 日常の開発は `develop` 経由（`feat/platform-*` / `feat/plugin-*` / `fix/*` → PR → `develop`）。
- **ベース改修と業界プラグインを同一ブランチに混ぜない。** 詳細は [`docs/workflow/branch-strategy.md`](docs/workflow/branch-strategy.md)。
- **`feat/plugin-*` の PR では platform（ベース）とハーネス設定（`AGENTS.md`、`.cursor/`、`docs/harness/`、`scripts/workflow-gate*` 等）を一緒に変更しない。** 必要なら `feat/platform-*` / `feat/platform-harness-*` で別 PR。platform を先にマージしてから plugin を着手する。
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
