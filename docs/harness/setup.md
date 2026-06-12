# ローカル環境・テンプレート

## 初回セットアップ

```sh
make install
make start-supabase          # または make start
./scripts/sync-local-env.sh  # 実キーを .env に反映
make start-app               # Supabase 起動済みなら
```

## 主な URL

| サービス | URL |
|----------|-----|
| アプリ | http://localhost:5173/ |
| 初回サインアップ | http://localhost:5173/#/sign-up |
| Supabase Studio | http://127.0.0.1:54323/ |

## `.env` の扱い

- リポジトリ内の `.env*` は **プレースホルダー**
- `sync-local-env.sh` が `npx supabase status -o env` から実キーを書き込む
- **実キー入り `.env` は commit しない**

## テナント切り替え

`VITE_TENANT_ID` で `tenants/<id>.json` を選択する。未指定時は `default`。

```sh
VITE_TENANT_ID=noexcuse make start
```

## よく使うコマンド

| コマンド | 用途 |
|----------|------|
| `make start` / `make dev` | Supabase 起動 → 未適用マイグレーション適用 → Vite |
| `make test` | ユニットテスト |
| `make pre-pr` | PR 前チェック |
| `make supabase-migrate-database` | マイグレーションのみ適用（Supabase 起動済みのとき） |

## テンプレートから新規プロジェクト

1. GitHub で [fress-crm-template](https://github.com/fress-dev/fress-crm-template) を **Use this template**
2. `origin` を自分のリポジトリに設定
3. `upstream` を `marmelab/atomic-crm` に追加
4. 上記セットアップを実行

## Git リモート

| リモート | 用途 |
|----------|------|
| `origin` | テンプレート／自社リポジトリ |
| `upstream` | 上流 atomic-crm の fetch |

上流取り込みで unrelated histories が必要な場合: `git merge upstream/main --allow-unrelated-histories`
