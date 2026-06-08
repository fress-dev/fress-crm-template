# Salus プロジェクト概要

> **調査元:** `/Users/kinu/workspace/salus`  
> **最終更新:** 2026-06-08

## 何のシステムか

**パーソナルジム向けの社内管理システム**です。会員（顧客）のカルテ・契約・チケット（回数券）・予約・セッション記録を、トレーナー／スタッフがブラウザから操作します。

- 会員向けログイン・マイページは **ない**
- 決済・請求機能は **ない**（契約は「利用枠の手動登録」）
- 公式 README は Laravel デフォルトのまま（独自ドキュメントなし）

## 技術スタック

| 層 | 技術 |
|----|------|
| バックエンド | PHP 7.3+/8.0、Laravel 8.54 |
| 認証 | Laravel Breeze（**トレーナー**向け） |
| DB | MySQL 8（Laravel Sail / Docker） |
| フロント | Blade + SB Admin 2 風 UI、jQuery、FullCalendar、C3.js |
| ビルド | Laravel Mix |

## 認証モデル

| 主体 | モデル | ログイン |
|------|--------|----------|
| スタッフ | `Trainer` | あり（`web` ガードのデフォルト） |
| 会員 | `User` | **なし**（パスワード列も削除済み） |

ログイン後のホームは `/karte`（カルテ検索）。

## 主要ドメイン（6領域）

```
会員（User / カルテ）
  ├── 契約（Contract）→ チケット（Ticket）
  ├── 予約（Schedule / Session）
  └── 身体データ・種目記録（Session / TrainingContent）

スタッフ（Trainer）
店舗・部屋（Store / Room）
商品（Course）
マスタ（TrainingType / TrainingGroup）
```

## サイドバー構成（実装されている業務）

`resources/views/layouts/sidebar.blade.php` より:

1. **カルテ管理** — 会員検索・登録
2. **トレーナー管理** — スタッフ CRUD
3. **スケジュール管理** — 店舗カレンダー（FullCalendar）
4. **マスタ管理** — 種目・コース・店舗

## 設定ファイル（ビジネスルール）

`config/salus.php`:

- コース別チケット枚数オプション（通常 8/16/24/32 等）
- 都道府県リスト
- スケジュール種別:
  - 1–3: セッション（トレーニング / ストレッチ / 両方）
  - 4–5: カウンセリング / カウンセリング＋体験
  - 6: その他

## 主要ファイルパス

| 種別 | パス |
|------|------|
| ルート | `routes/web.php`, `routes/auth.php` |
| 設定 | `config/salus.php`, `config/auth.php` |
| コントローラ | `app/Http/Controllers/` |
| サービス | `app/Services/SessionService.php`, `ScheduleService.php` |
| モデル | `app/Models/`（12ファイル） |
| マイグレーション | `database/migrations/` |
| 画面 | `resources/views/karte/`, `schedule/`, `session/` 等 |

## 次のドキュメント

- [02-salus-features.md](./02-salus-features.md) — 機能詳細
- [03-salus-data-model.md](./03-salus-data-model.md) — データモデル
