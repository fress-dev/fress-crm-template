# 機能ロードマップ（Salus → パーソナルジム CRM）

> **最終更新:** 2026-06-10  
> **読者:** 次に何を開発するか選ぶ人間  
> **機械可読:** [features.yaml](./features.yaml)（AI・スクリプト向け。こちらを正とする）

## ローカル Kanban UI

ドラッグ&ドロップで `features.yaml` を更新する画面（CRM とは別）:

```sh
make start-backlog
```

→ http://localhost:3457（詳細: [tools/backlog/README.md](../../tools/backlog/README.md)）

---

## このディレクトリで開発するのか？

**いいえ。`docs/product/` はバックログ（計画）だけです。**

| 場所 | 役割 |
|------|------|
| **`docs/product/roadmap.md`** | 人間が次機能を選ぶ一覧（本ファイル） |
| **`docs/product/features.yaml`** | 同上を構造化（AI が読む） |
| **`docs/workflow/design/*.md`** | 選んだ機能の**設計書**（承認前は draft） |
| **`src/custom/**`** | **実装コード**（プラグイン・platform・providers） |
| **`supabase/migrations/**`** | DB 変更（追加のみ） |
| **`tenants/*.json`** | テナント設定（表示名・plugins・段階名） |
| **`e2e/**`** | 機能単位の e2e（顧客ごとではない） |

```
選ぶ          設計する           実装する              完了後
─────────    ─────────────    ───────────────    ─────────────
roadmap  →   workflow/design  →  src/custom/    →  archive 設計書
features.yaml   (approved)         migrations         + roadmap 更新
```

調査の土台は引き続き [workflow/research/](../workflow/research/README.md)。ロードマップは **research の結論を「今の状態」に落としたもの** です。

---

## 選び方（3ステップ）

1. 下の **「いま選べる候補」** を見る（`status: next` かつ依存が `done`）
2. **縦切りシナリオ**（A/B/C）で「今やりたい業務」を1つ決める
3. 候補が2〜3個に絞れたら、チャットで **「`<id>` で設計書を書いて」** と依頼する

AI は依頼時に `features.yaml` を読み、`docs/workflow/design/_template.md` から設計書 draft を作成します。`approved` まで実装しません。

---

## 縦切りシナリオ

| ID | 業務の流れ | 向いている判断 |
|----|-----------|---------------|
| **A** 新規入会 | 体験予約 → 体験 → 契約 → 初回予約 | 入会フローを先に通したい |
| **B** 日常セッション | カルテ → 予約 → 実施記録 → チケット消費 | Salus の `/schedule` 中心業務を先に |
| **C** マスタ整備 | 店舗 → コース → スタッフ権限 | データの土台を固めたい |

---

## いま選べる候補（2026-06-10 時点）

依存が満たされていて、すぐ設計に入れるものです。

| id | Salus 相当 | 優先度 | シナリオ | メモ |
|----|-----------|--------|---------|------|
| **plugin-appointments** | 予約・カレンダー | P0 | A, B | 店舗済み。日常業務の中心 |
| **plugin-courses** | コースマスタ | P1 | A, C | memberships の前提 |
| **plugin-stores-soft-delete** | 店舗 del_flg | P2 | C | 任意。followups §3 |
| **karte-hub** | カルテ（会員ハブ） | P1 | A, B | Contact Show 拡張。他プラグインの入口 |

**ブロック中（先に上記か依存の完了が必要）**

| id | 待ち |
|----|------|
| plugin-memberships | plugin-courses |
| plugin-session-log | appointments + memberships |
| plugin-rooms | appointments と同時設計推奨 |
| plugin-stores-rls | Phase 2（データ蓄積後） |

**進行中**

| id | PR / ブランチ |
|----|--------------|
| （なし） | — |

※ [PR #11](https://github.com/fress-dev/fress-crm-template/pull/11) tenant smoke e2e はロードマップ未登録（e2e 整備のみ）

---

## 未決の判断（features.yaml `decisions`）

設計に進む前に決めたいもの。✓ を付けたら `features.yaml` の `status: decided` に更新する。

| 判断 | 状態 | 提案 |
|------|------|------|
| Phase 1 は P0 のみか、Salus 全再現か | 未決 | **P0 + P1 まで** を Phase 1 とする案が現実的 |
| Deal ＝ 入会パイプライン（金額未使用） | 未決 | noexcuse は既に段階名適用済み → **確定でよい** |
| 店舗の次の1本 | 未決 | **A なら appointments** / **契約先行なら courses → memberships** |
| 決済連携を将来要件に残すか | 未決 | **skip 扱いでロードマップに残す**（Salus にも無し） |

---

## 全機能一覧

`status` の意味: `done` 完了 / `in-progress` PR 中 / `next` 着手候補 / `blocked` 依存待ち / `skip` 当面やらない

### コア・テナント（完了済みが多い）

| status | id | Salus | CRM |
|--------|-----|-------|-----|
| done | core-contacts-member | 会員 | contacts |
| done | core-sales-trainer | トレーナー | sales |
| done | platform-tenant-config | 事業設定 | tenants/*.json |
| done | core-deal-pipeline | 体験〜入会 | deals + 段階名 |
| done | core-tasks-followup | フォロー | tasks |
| done | core-notes-simple | 簡易メモ | contact_notes |

### プラットフォーム

| status | id | 内容 | 設計書 |
|--------|-----|------|--------|
| done | platform-plugin-registry | プラグイン載せ台 | [archive](../workflow/design/archive/platform-plugin-registry.md) |
| done | platform-implementation-patterns | 実装パターン | [archive](../workflow/design/archive/platform-implementation-patterns.md) |

### plugin-stores

| status | id | 内容 | 設計書 |
|--------|-----|------|--------|
| done | plugin-stores-master | 店舗 CRUD・会員紐づけ | [archive](../workflow/design/archive/plugin-stores.md) |
| done | plugin-stores-validation | バリデーション | [archive followups §1](../workflow/design/archive/plugin-stores-followups.md) |
| done | plugin-stores-ui | Show・Empty・削除 | [archive followups §2](../workflow/design/archive/plugin-stores-followups.md) |
| done | plugin-stores-search-layout | 検索・レイアウト・runbook | [PR #10](https://github.com/fress-dev/fress-crm-template/pull/10) |
| next | plugin-stores-soft-delete | del_flg | followups §3 |
| blocked | plugin-stores-rls | 店舗権限 RLS | plugin-stores Phase 2 |

### これから（Salus 中核）

| status | id | Salus | プラグイン案 | P |
|--------|-----|-------|-------------|---|
| next | plugin-appointments | Schedule | 予約・カレンダー | P0 |
| next | plugin-courses | Course | コースマスタ | P1 |
| blocked | plugin-memberships | Contract / Ticket | 契約・回数券 | P0 |
| blocked | plugin-session-log | Session | 身体データ・実施記録 | P1 |
| blocked | plugin-rooms | Room | 部屋 | P2 |
| blocked | plugin-training-content | 種目 | TrainingContent | P2 |
| next | karte-hub | Karte | Contact Show ハブ | P1 |
| skip | plugin-schedule-bulk | ScheduleBulk | 一括予約 | P3 |
| skip | plugin-body-graph | Graph | 身体グラフ | P3 |
| skip | plugin-payments | — | 決済（将来） | — |

---

## 更新ルール

1. **設計承認時** — 対象 `id` を `next` のまま、`design` に draft パスを入れる
2. **PR マージ時** — `status: done`、`pr`・`branch` を記録。設計書は `workflow/design/archive/` へ（既存フロー）
3. **スコープ変更** — `skip` / `blocked` / `decisions` を更新。大きな論点は本ファイルの「未決」にも1行追記
4. **AI 依頼時** — 「ロードマップを見て次を提案して」→ `features.yaml` を読む

---

## 関連

- [features.yaml](./features.yaml) — 正本（AI 向け）
- [crm-features.md](./crm-features.md) — いま動いている CRM 機能（利用者向け）
- [05-gap-analysis.md](../workflow/research/05-gap-analysis.md) — 調査時のギャップ分析（ロードマップへ集約済み）
- [workflow/design/README.md](../workflow/design/README.md) — 設計書フロー
- [architecture/plugin-architecture.md](../architecture/plugin-architecture.md) — 層の方針
