# ブランチ命名規則

> **最終更新:** 2026-06-07  
> プラグイン設計: [architecture/plugin-architecture.md](../architecture/plugin-architecture.md)。  
> ハーネス（`.cursor/hooks/workflow-gate-shell.sh`）で commit / push / PR 作成時に検証します。

## 恒久ブランチ

| ブランチ | 役割 |
|----------|------|
| `main` | 本番相当。**直接コミット・push 禁止** |
| `develop` | 開発統合。日常の PR マージ先 |

## 作業ブランチ（必須パターン）

いずれも **`develop` から作成**し、PR のマージ先は **`develop`**。

| プレフィックス | 用途 | 例 |
|----------------|------|-----|
| `feat/platform-<内容>` | コア（レジストリ・テナント設定・組み立て） | `feat/platform-plugin-registry` |
| `feat/plugin-<機能名>-<内容>` | プラグイン（業界名を付けない） | `feat/plugin-appointments-form` |
| `feat/plugin-realestate-<内容>` | 不動産にしかないドメイン（詰め合わせではない） | `feat/plugin-realestate-property-list` |
| `feat/plugin-beauty-<内容>` | 美容にしかないドメイン（詰め合わせではない） | `feat/plugin-beauty-treatment-history` |
| `fix/<内容>` | バグ修正 | `fix/e2e-locale-ja` |

層の名称は [architecture/plugin-architecture.md](../architecture/plugin-architecture.md) を参照。機能単位で切れるものは `feat/plugin-<機能名>-*` を優先する（例: 物件は `plugin-properties`）。

### 編集範囲の目安

> **現状:** [AGENTS.md](../../AGENTS.md) に従い、新規コードは `src/custom/**`・`App.tsx`・新規 migration のみ。以下は platform 移行後の目安。

| プレフィックス | 主に触る場所（将来の目安） |
|----------------|---------------------------|
| `feat/platform-*` | `src/platform/**`（現状は `src/custom/` の共通部分）、`App.tsx`、共通 e2e/i18n |
| `feat/plugin-<機能名>-*` | `src/plugins/<機能名>/**`（現状は `src/custom/` 内の機能単位サブフォルダ） |
| `feat/plugin-realestate-*` | 不動産専用ドメイン（現状は `src/custom/`） |
| `feat/plugin-beauty-*` | 美容専用ドメイン（現状は `src/custom/`） |
| `fix/*` | 縫い目内の修正（コア非変更の原則は同じ） |

**1ブランチ = 1つのレビュー可能な単位。** ベース改修と業界プラグインを同じブランチに混ぜない。

## 作成例

```sh
git checkout develop && git pull

# ベース
git checkout -b feat/platform-dashboard-widget-slot

# 不動産
git checkout -b feat/plugin-realestate-viewing-form

# 美容
git checkout -b feat/plugin-beauty-treatment-history

# バグ修正
git checkout -b fix/contact-list-filter-reset
```

## 並行開発

- `feat/platform-*` と `feat/plugin-*` は **別ブランチで並行**してよい。
- 土台（registry 等）が先に必要なら、platform PR を先に `develop` へマージしてから plugin ブランチを切る。
- 長命の plugin ブランチは **こまめに `develop` を merge** して追従する。

## 旧命名からの移行

`feat/xxx` など旧形式のブランチで作業中の場合:

```sh
git branch -m feat/old-name feat/platform-old-name
# 例: feat/i18n-phase-1 → feat/platform-i18n-phase-1
git push -u origin feat/platform-i18n-phase-1
```

## 関連

- [architecture/plugin-architecture.md](../architecture/plugin-architecture.md) — プラグイン設計方針
- [development.md](./development.md) — 調査〜マージの手順
- [harness/README.md](../harness/README.md) — ハーネス全体像
