# Salus データモデル

> **調査元:** `/Users/kinu/workspace/salus/database/migrations/`, `app/Models/`  
> **最終更新:** 2026-06-08

## ER 概要（論理関係）

```
users（会員）
  ├── contracts ── courses
  │     └── tickets
  ├── sessions ── training_content ── training_group ── training_type
  └── schedules

trainers（スタッフ）── sessions / schedules
stores ── rooms
stores ── users.store_id / sessions.store_id / schedules.store_id
```

※ Eloquent の `belongsTo` / `hasMany` は **ほぼ未定義**。JOIN はコントローラ・サービス層で Raw Query。

---

## 主要エンティティ

### users（会員）

| カラム群 | 例 |
|----------|-----|
| 識別 | id, email |
| 氏名 | last_name, first_name, last_name_kana, first_name_kana |
| 属性 | sex, birthday, height |
| 住所 | zip_code, addr1–3, building |
| 所属 | store_id |

**CRM マッピング候補:** Contact（担当者）

---

### trainers（トレーナー）

| カラム群 | 例 |
|----------|-----|
| 認証 | email, password |
| プロフィール | 氏名、住所、性別、生年月日 |

**CRM マッピング候補:** sales（利用者）— コアのスタッフアカウント

---

### courses（コース商品）

| カラム | 値 |
|--------|-----|
| course_name | 名称 |
| course_type | 0:通常, 1:延長, 2:無料 |
| course_time | 時間 |
| training_type | 0:トレーニング, 1:ストレッチ |

**CRM マッピング候補:** 専用 Product テーブル（プラグイン）— コアの商談「種類」では不足

---

### contracts（契約）

| カラム | 説明 |
|--------|------|
| user_id, course_id | 会員とコース |
| course_limit | 発行チケット枚数 |
| course_count | 同一コースの N 週目 |
| contracts_status | 0:契約中, 1:完了, 2:取消 |

**CRM マッピング候補:** Deal（商談）の拡張 or 専用 Contract エンティティ（プラグイン）

---

### tickets（チケット / 利用枠）

| カラム | 説明 |
|--------|------|
| user_id, contract_id | 所有者 |
| session_id | 使用したセッション（nullable） |
| schedule_id | 予約中（nullable） |
| complete_flg | 0:未完了, 1:完了 |
| ticket_name | 表示名 |

**CRM マッピング候補:** 専用エンティティ（プラグイン）— コアに相当なし

---

### sessions（セッション = 予約 + 実施記録）

身体測定と予約属性を **1テーブル** に持つ。

| グループ | カラム例 |
|----------|----------|
| 身体 | weight, body_fat, visceral_fat_level, blood_pressure, waist_size, basal_metabolism, muscle_mass, body_age, body_water_content, comment |
| 予約 | target_date, target_end_date, type, title, store_id, room_id, schedule_description |
| 関連 | user_id, trainer_id, del_flg |

**CRM マッピング候補:** Appointment + Activity の複合（プラグイン）

---

### schedules（非セッション予定）

カウンセリング・体験・その他。

| カラム | 説明 |
|--------|------|
| start_date, end_date | 期間 |
| type, title | 種別・タイトル |
| trainer_id, user_id | 担当・会員（任意） |
| store_id, room_id | 場所 |
| del_flg | 論理削除 |

---

### training_type / training_group / training_content

| テーブル | 役割 |
|----------|------|
| training_type | 部位・カテゴリ |
| training_group | 種目名 |
| training_content | セッション内の weight / count / set_count |

---

### stores / rooms

| テーブル | 役割 |
|----------|------|
| stores | 店舗（name, area_code, 住所, del_flg） |
| rooms | 店舗配下のルーム（store_id, name, del_flg） |

**CRM マッピング候補:** Location / Resource（プラグイン or カスタム層）

---

## ビジネスワークフロー（データの流れ）

### 会員登録 → 契約 → 予約 → 実施

```
1. users 作成（スタッフが登録）
2. contracts 作成 → tickets 一括 insert
3. schedule 画面で sessions または schedules 作成
   └── セッション系は tickets.session_id / schedule_id に紐付け
4. session 編集で身体データ + training_content 記録
   └── チケット complete_flg 更新
5. 全チケット消化 → contract contracts_status=1
```

### 一括予約

```
schedulebulk: 曜日×期間×チケット配列
  → 重複・時間検証
  → sessions 複数 insert
```

---

## マイグレーション（起点ファイル）

| テーブル | マイグレーション例 |
|----------|-------------------|
| users | `2014_10_12_000000_create_users_table.php` |
| sessions | `2021_10_27_150158_create_table_session.php` |
| training | `2021_11_17_130634_create_training_item_table.php` |
| contracts | `2022_04_02_134030_create_contracts_table.php` |
| courses | `2022_04_02_134144_create_courses_table.php` |
| tickets | `2022_05_31_215009_create_tickets_table.php` |
| stores | `2022_06_11_175040_add_stores_table_del.php` |

---

## 次のドキュメント

- [04-crm-capabilities.md](./04-crm-capabilities.md) — CRM 側の現状
- [05-gap-analysis.md](./05-gap-analysis.md) — ギャップと切り分け論点
