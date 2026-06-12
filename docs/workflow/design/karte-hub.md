# karte-hub — 会員カルテハブ

> **status:** approved  
> **層:** カスタム層  
> **ブランチ（予定）:** `feat/platform-karte-hub`  
> **最終更新:** 2026-06-13

## 概要

Salus の「カルテ詳細」に相当する **会員ハブ** を Contact Show に追加する。契約・予約・セッション記録など各プラグインへの入口を1画面に集約し、未実装プラグインはプレースホルダで縦切りの見通しを確保する。

## 背景・目的

- Salus ログイン後のホームは `/karte` で、会員詳細から契約・予約・セッションへ遷移する
- 現状 CRM の Contact Show はメモ・タスク中心で、ジム業務の入口が分散している
- `plugin-appointments` / `plugin-courses` は PR レビュー中。マージ前でもハブ UI を先に置けるとシナリオ A/B の導線が見える
- 依存 `plugin-stores-master` は完了済み（在籍店舗の表示が可能）

## スコープ

### やること

1. **Contact Show 拡張:** デスクトップはメモカード下にハブパネル、モバイルは「カルテ」タブを追加
2. **セクション（入口）:**
   - 在籍店舗（`stores` 有効時）— `contact.store_id` 参照
   - 入会管理（`deals` 非 hidden 時）— 関連 Deal 一覧 + 新規リンク
   - 契約・チケット — プレースホルダ（`plugin-memberships` 待ち）
   - 予約 — プレースホルダ（`plugin-appointments` マージ後に差し替え）
   - セッション記録 — プレースホルダ（`plugin-session-log` 待ち）
3. **プラグイン検知:** `isPluginEnabled(id)` でテナント `plugins` + レジストリを参照
4. **i18n:** 日本語ラベル（`custom.karte.*`）
5. **e2e:** 会員詳細でハブ見出しとプレースホルダが表示されること

### やらないこと

- 各プラグイン本体の CRUD（appointments / memberships / session-log）
- スケジュールコピー（LINE 用テキスト出力）→ `custom-schedule-copy`
- 身体グラフ → `plugin-body-graph`
- カルテ専用ルート `/karte`（Contact Show 拡張で足りる）
- DB migration（表示のみ、新規テーブルなし）

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| Contact Show 差し替え | カスタム層 | 複数プラグインへの横断 UI。1 プラグインに属さない |
| 各セクションの実データ | プラグイン / コア | ハブは入口のみ。本体は各 PR |
| テナント labels | テナント設定 | 会員・入会管理の表記は既存 |

## データ・画面（概要）

- **新規 migration:** なし
- **画面:** 既存 `/contacts/:id/show` を拡張（`FressCRM` で `show` コンポーネント差し替え）
- **プラグイン停止時:** 該当セクションはプレースホルダまたは非表示（stores 無効時は店舗セクション非表示）
- **強制削除時:** 不要（DB 変更なし）

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | なし（読み取りのみ。deals / stores は既存 API） |
| 一覧 / 検索 / 作成 / 更新 / 削除 | ハブから各リソースへリンクするのみ |
| レイアウト | Show は既存 `flex gap-8` + Aside を維持。ハブはメイン `flex-1` 内の第 2 カード |

## テナント設定

- 変更なし（`noexcuse.json` の `plugins: ["stores"]` のまま）
- 将来: `plugin-appointments` マージ後 `plugins` に `"appointments"` を追加すると予約セクションが有効化

## カスタム層・連携

- `FressCRM` の contacts Resource で `show={ContactShowWithKarte}` を注入
- 各プラグイン PR マージ時にハブ内セクションを `isPluginEnabled` + 既存リソース参照へ差し替え

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 縫い目（`FressCRM.tsx` / `src/custom/karte/**`）で実現する

## テスト方針

- `make pre-pr`
- `e2e/karteHub.spec.ts` — 会員詳細でハブ見出し・プレースホルダ表示

## 未決事項・リスク

- Contact Show を custom で複製するため、上流 Contact Show 変更時は手動マージが必要（ContactInputs と同様の縫い目トレードオフ）
- appointments マージ後、ハブの予約セクションを ReferenceManyField 実装に差し替える follow-up が必要

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-13 | ユーザー依頼 | ロードマップ次候補として着手 |
