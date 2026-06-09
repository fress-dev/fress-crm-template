# 機能設計書

> **最終更新:** 2026-06-09

**主目的:** 実装前に人間が内容を確認・承認するため。  
層の方針は [architecture/plugin-architecture.md](../../architecture/plugin-architecture.md)、レビュー結果は [logs/review-log.md](../../logs/review-log.md)。

## いつ書くか

| 対象 | 設計書 |
|------|--------|
| `feat/platform-*` / `feat/plugin-*` の新機能・拡張 | **必須**（1 PR = 1 設計書） |
| `fix/*` の単純なバグ修正 | 不要 |
| ドキュメント誤字・表記のみ | 不要 |

## フロー

```
1. 依頼
2. 設計書作成（docs/workflow/design/<名前>.md、status: draft）
3. 人間が確認・OK → approved
4. AI が設計書を見ながら実装（この間だけ参照）
5. レビュー・テスト
6. PR 作成と同時に設計書を docs/workflow/design/archive/<名前>.md へ移動
7. マージ（人間）
8. 以降の改修 → コード優先。未実装分・大きい変更は新しい design（draft）から
```

**`approved` になるまで実装しない。**  
**`archive/` は AI が参照しない。**  
**アーカイブはマージ後ではなく、実装完了〜PR 作成時。** 設計書に書いたが実装しなかった範囲は、必要になったら別の設計書を新規作成する。

## 大きな依頼の分け方

**1 設計書 = 1 PR = 1 縦切り**。大きな依頼は AI が分割案を提示する。

| 切り方 | 例 |
|--------|-----|
| 依存順 | コア（レジストリ）→ プラグイン1本目 |
| 層 | コアとプラグインを同一 PR にしない |
| サイズ | 1 PR でレビューできる量 |

## ファイル命名

- `docs/workflow/design/<名前>.md`（kebab-case）
- 新規は [_template.md](./_template.md) をコピー

## ステータス

| status | 意味 |
|--------|------|
| `draft` | レビュー待ち |
| `approved` | 実装してよい |

実装完了〜PR 作成時に `archive/` へ移動。

## 一覧（進行中）

| 設計書 | 層 | status | 備考 |
|--------|-----|--------|------|

## 関連

- [architecture/plugin-architecture.md](../../architecture/plugin-architecture.md)
- [development.md](../development.md)
- [_template.md](./_template.md)
- [_template-teardown.md](./_template-teardown.md) — プラグイン強制削除用 teardown
- [plugin-runbook.md](../plugin-runbook.md) — 有効化・停止・強制削除の手順
- [archive/](./archive/) — 実装済み設計書（AI は参照しない）
