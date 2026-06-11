# Fress Backlog（ローカル Kanban）

Atomic CRM とは**完全に分離**した開発用バックログ UI です。  
`docs/product/features.yaml` を Kanban 表示し、ドラッグ&ドロップで `status` を更新します。

## 起動

リポジトリルートから:

```sh
make start-backlog
```

または:

```sh
cd tools/backlog
npm install
npm run dev
```

- UI: http://localhost:3457
- API: http://127.0.0.1:3456（localhost のみ）

## できること

| 操作 | 反映先 |
|------|--------|
| カードを列間にドラッグ | `features[].status` |
| 担当者を選択 | `features[].assignee`（任意フィールド） |
| 「依頼をコピー」 | クリップボードに設計書依頼プロンプト |

## CRM への影響

- `src/`・`package.json`（ルート）・Supabase・ビルドパイプラインは**変更なし**
- 本ツール専用の `tools/backlog/package.json` のみ
- 本番デプロイ対象外

## 注意

- API はローカル専用（`127.0.0.1`）。外部公開しないこと
- `features.yaml` を直接書き換えるため、起動中は他エディタでの同時編集に注意
