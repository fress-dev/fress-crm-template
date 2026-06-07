# ブランチ命名規則（業界プラグイン対応）

> **最終更新:** 2026-06-07  
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
| `feat/platform-<内容>` | ベース・全業界共通 | `feat/platform-plugin-registry` |
| `feat/plugin-realestate-<内容>` | 不動産プラグインのみ | `feat/plugin-realestate-property-list` |
| `feat/plugin-beauty-<内容>` | 美容プラグインのみ | `feat/plugin-beauty-appointment-calendar` |
| `fix/<内容>` | バグ修正（業界問わず） | `fix/e2e-locale-ja` |

### 編集範囲の目安

| プレフィックス | 主に触る場所 |
|----------------|--------------|
| `feat/platform-*` | `src/platform/**`（移行中は `src/custom/` の共通部分）、`App.tsx` の組み立て、共通 e2e/i18n |
| `feat/plugin-realestate-*` | `src/plugins/realestate/**`、不動産用 migration |
| `feat/plugin-beauty-*` | `src/plugins/beauty/**`、美容用 migration |
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

- [development-workflow.md](./development-workflow.md) — 調査〜マージの手順
- [ai-development-harness.md](./ai-development-harness.md) — ハーネス全体
