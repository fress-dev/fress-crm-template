# Salus 機能一覧

> **調査元:** `/Users/kinu/workspace/salus`  
> **最終更新:** 2026-06-08

## 機能マップ

| # | 機能群 | 主な画面・URL | コントローラ | 概要 |
|---|--------|--------------|-------------|------|
| 1 | カルテ検索・詳細 | `/karte`, `/karte/{id}` | `KarteController` | 会員ハブ（契約・予定・セッション一覧） |
| 2 | 会員 CRUD | `/user/*` | `UserController` | 氏名・連絡先・身体属性・所属店舗 |
| 3 | 契約・チケット | `/contract/{user_id}/edit` | `ContractController` | コース契約と回数券一括発行 |
| 4 | スケジュール | `/schedule` | `ScheduleController` | FullCalendar、予約作成・更新・削除 |
| 5 | 一括予約 | `/schedulebulk` | `ScheduleBulkController` | 曜日・隔週・期間で繰り返しセッション |
| 6 | セッション記録 | `/session/{id}`, `/session/{id}/edit` | `SessionController` | 身体データ・種目・チケット消費 |
| 7 | 身体グラフ | `/graph/{user_id}` | `GraphController` | 体重・体脂肪の時系列 |
| 8 | コースマスタ | `/course/*` | `CourseController` | 商品定義（種別・時間） |
| 9 | トレーナー | `/trainer/*` | `TrainerController` | スタッフ CRUD・ログインアカウント |
| 10 | 店舗・部屋 | `/store/*`, `PUT /room/{id}` | `StoreController`, `RoomController` | マルチ店舗・ルーム |
| 11 | 種目マスタ | `/trainingtype/*`, `/traininggroup/*` | `TrainingTypeController`, `TrainingGroupController` | カテゴリ・種目名 |

---

## 1. カルテ管理（Karte）

**役割:** 会員の業務ハブ。検索から詳細へ遷移し、契約・スケジュール・セッションへリンクする。

| 操作 | 内容 |
|------|------|
| 検索 | ID・氏名・かな |
| 詳細 | 契約情報、身体情報、スケジュール、セッション一覧 |
| テキスト出力 | スケジュールをクリップボード用にコピー（全件 / 直近5回 / 身体情報付き） |

**ビュー:** `resources/views/karte/{index,show}.blade.php`

---

## 2. 会員管理（User）

| 項目 | 内容 |
|------|------|
| 登録項目 | 氏名（漢字・かな）、メール、性別、生年月日、身長、住所、所属店舗 |
| 認証 | パスワードなし（スタッフが代理登録） |
| 削除 | 論理削除あり |

登録後は `/karte` へリダイレクト。

---

## 3. 契約・チケット（Contract / Ticket）

**Salus の「売上」に相当するが、金額・決済はない。** 回数券型の利用枠管理。

### 契約フロー

1. カルテ詳細から契約画面へ
2. コース選択 + チケット枚数選択（コース種別で選択肢が変わる）
3. `contracts` レコード作成 + `course_limit` 枚の `tickets` を一括 insert
4. チケット名は `TicketUtil` で自動生成（例: 「コース名 2週目 1/8」）

### 契約ステータス

| status | 意味 |
|--------|------|
| 0 | 契約中 |
| 1 | 完了（全チケット消化） |
| 2 | 取消 |

### 制約

- 同一コースで未使用チケットがある状態では新規契約不可

---

## 4. スケジュール（Schedule / Session 予約）

**FullCalendar** ベース。店舗・部屋・トレーナー・期間を指定してカレンダー表示。

### 予約種別（`config/salus.php`）

| type | 内容 | 作成先テーブル |
|------|------|---------------|
| 1 | セッション（トレーニング） | `sessions` |
| 2 | セッション（ストレッチ） | `sessions` |
| 3 | 両方 | `sessions` |
| 4 | カウンセリング | `schedules` |
| 5 | カウンセリング＋体験 | `schedules` |
| 6 | その他 | `schedules` |

セッション系はチケットを `session_id` に紐付け。削除は論理削除（`del_flg=1`）。

**画面:** `resources/views/schedule/index.blade.php`（約1280行、JS 内蔵）

---

## 5. 一括予約（ScheduleBulk）

| 指定項目 | 内容 |
|----------|------|
| 曜日・隔週 | 繰り返しパターン |
| 期間 | 開始〜終了日 |
| チケット配列 | 各回に割り当てるチケット |
| 時間検証 | トレーニング60分 / ストレッチ40分 / 両方100分 |

重複・チケット有効性を検証後、複数 `sessions` を自動作成。

---

## 6. セッション記録（Session）

実施後（または当日）のカルテ入力。

| 記録種別 | 項目例 |
|----------|--------|
| 身体データ | 体重、体脂肪、内臓脂肪、血圧、ウエスト、基礎代謝、筋肉量、体年齢、体水分、コメント |
| 種目記録 | `TrainingContent` — 種目ごとの重量・回数・セット数 |
| チケット | トレーニング/ストレッチ別の再割当・消費 |

詳細画面で BMI 計算（`Util::calcBMI`）。

---

## 7. 身体グラフ（Graph）

- 体重・体脂肪率の時系列（C3.js）
- 会員単位 `/graph/{user_id}`

---

## 8. マスタ管理

### コース（Course）

| 属性 | 値 |
|------|-----|
| course_type | 0:通常, 1:延長, 2:無料 |
| training_type | 0:トレーニング, 1:ストレッチ |
| course_time | 時間（分） |

### 店舗（Store）・部屋（Room）

- 店舗: 名称、都道府県、住所
- 部屋: 店舗配下、店舗画面から一括更新

### 種目（TrainingType / TrainingGroup）

- 部位・カテゴリ（Type）→ 種目名（Group）
- セッション編集時に `TrainingContent` として記録

---

## 9. トレーナー（Trainer）

- ログイン可能なスタッフアカウント
- 氏名・連絡先・住所・性別・生年月日
- セッション・スケジュールの担当者として紐付け

---

## 10. 未実装・弱い領域

| 領域 | 状態 |
|------|------|
| 決済・請求 | なし |
| 会員ポータル | なし |
| メール通知（業務） | パスワードリセット等のみ |
| API | `/api/karte` スタブのみ |
| 契約一覧画面 | `ContractController@index` は空（カルテ経由のみ） |

## セキュリティメモ（移行時の参考）

一部コントローラ（`ContractController`, `ScheduleController` 等）に `auth` ミドルウェアが無い。本番運用では要確認。

---

## 次のドキュメント

- [03-salus-data-model.md](./03-salus-data-model.md) — ER・テーブル詳細
- [05-gap-analysis.md](./05-gap-analysis.md) — CRM との対応表
