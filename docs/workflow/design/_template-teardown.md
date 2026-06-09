# プラグイン強制削除 — teardown migration テンプレート

> **用途:** 誤導入・完全撤去のときだけ。通常の停止では使わない。  
> **Runbook:** [../plugin-runbook.md](../plugin-runbook.md)

## 実施前の確認

- [ ] 通常の **停止**（JSON から id を外す）では足りないと判断した
- [ ] **バックアップ**を取得した（本番必須）
- [ ] 依存プラグインを先に停止・削除した（`dependsOn` 確認）
- [ ] データ消失を関係者が承知している

## ファイル

- パス: `supabase/migrations/<YYYYMMDDHHMMSS>_<plugin-id>_teardown.sql`
- **既存 migration は編集しない。** 新規ファイルとして追加のみ
- `PluginDefinition.migrations` にファイル名を追記（参照用）

## SQL の順序（一般）

1. **コアテーブルへの FK を外す** — `alter table ... drop constraint`
2. **コアテーブルの追加カラムを DROP** — `alter table ... drop column`
3. **依存 view を DROP → 再作成** — 追加カラムを参照している view をコア向けに戻す
4. **プラグイン専用テーブルを DROP** — `drop table`（policy・index はテーブルに従属）

`CASCADE` は最終手段。明示的な DROP を優先する。

## テンプレート（プレースホルダ）

```sql
-- plugin-<PLUGIN_ID> teardown: 強制削除のみ。データ消失を承知すること。

-- 1. コアテーブル FK
alter table public.<CORE_TABLE>
    drop constraint if exists <FK_NAME>;

-- 2. コアテーブル列
alter table public.<CORE_TABLE>
    drop column if exists <COLUMN_NAME>;

-- 3. view 再作成（<COLUMN_NAME> を含まない定義に戻す）
drop view if exists public.<SUMMARY_VIEW>;

create view public.<SUMMARY_VIEW>
    with (security_invoker = on)
    as
    -- コア migration / schemas の定義をベースに、プラグイン列なしで再定義
    select ...;

grant all on table public.<SUMMARY_VIEW> to anon;
grant all on table public.<SUMMARY_VIEW> to authenticated;
grant all on table public.<SUMMARY_VIEW> to service_role;

-- 4. プラグイン専用テーブル
drop table if exists public.<PLUGIN_TABLE>;
```

## stores 具体例（参考）

`stores` プラグインを強制削除するときの骨子。PR 時にタイムスタンプ付きファイルへコピーして使う。

```sql
-- plugin-stores teardown: 強制削除のみ。データ消失を承知すること。

alter table public.contacts
    drop constraint if exists contacts_store_id_fkey;

alter table public.contacts
    drop column if exists store_id;

drop view if exists public.contacts_summary;

create view public.contacts_summary
    with (security_invoker = on)
    as
select
    co.*,
    jsonb_path_query_array(co.email_jsonb, '$[*].email')::text as email_fts,
    jsonb_path_query_array(co.phone_jsonb, '$[*].number')::text as phone_fts,
    c.name as company_name,
    count(distinct t.id) filter (where t.done_date is null) as nb_tasks
from public.contacts co
    left join public.tasks t on co.id = t.contact_id
    left join public.companies c on co.company_id = c.id
group by
    co.id, c.name;

grant all on table public.contacts_summary to anon;
grant all on table public.contacts_summary to authenticated;
grant all on table public.contacts_summary to service_role;

drop table if exists public.stores;
```

### stores teardown 後のコード整理（別 PR 可）

- [ ] `tenants/*.json` から `"stores"` を削除（停止済みであること）
- [ ] `bootstrapPlugins()` の `registerPlugin(storesPlugin)` を外す
- [ ] `customModuleOverrides.ts` の ContactInputs / ContactListFilter 差し替えを外す
- [ ] `withPluginDataProvider` の stores ラップを外す
- [ ] `storesPluginI18n` の merge を外す
- [ ] `FressHeader` / モバイルナビの stores 分岐を整理
- [ ] e2e の stores 関連 spec を無効化または削除

## テスト方針

- [ ] migration 適用後、`make pre-pr` が緑
- [ ] 担当者の新規作成・編集・一覧が動く（`store_id` なし）
- [ ] `/stores` にアクセスできない（Resource 未登録）
- [ ] 本番適用前にステージングで同手順を実施

## 関連

- 有効化 migration 一覧: `src/custom/plugins/<id>/plugin.ts` の `migrations`
- [plugin-runbook.md](../plugin-runbook.md)
