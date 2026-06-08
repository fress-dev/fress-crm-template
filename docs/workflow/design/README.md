# 機能設計書

> **最終更新:** 2026-06-07

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
5. レビュー・テスト・PR・マージ
6. 設計書を docs/workflow/design/archive/<名前>.md へ移動
7. 以降の改修 → コード優先。大きい変更だけ新しい design（draft）から
```

**`approved` になるまで実装しない。**  
**`archive/` は AI が参照しない。**

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

マージ後は `archive/` へ移動。

## 一覧（進行中）

| 設計書 | 層 | status | 備考 |
|--------|-----|--------|------|
| [platform-tenant-config.md](./platform-tenant-config.md) | コア（platform） | **draft** | **noexcuse CRM** 表示・テナント JSON。先に承認 |
| [platform-plugin-registry.md](./platform-plugin-registry.md) | コア（platform） | **draft** | レジストリ・Extension 契約。tenant-config マージ後 |
| [plugin-stores.md](./plugin-stores.md) | プラグイン | **draft** | 船橋店・千葉店等。Phase 2 で店舗権限 |

## 関連

- [architecture/plugin-architecture.md](../../architecture/plugin-architecture.md)
- [development.md](../development.md)
- [_template.md](./_template.md)
