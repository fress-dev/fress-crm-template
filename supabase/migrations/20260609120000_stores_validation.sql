-- plugin-stores follow-up: バリデーション制約と contacts.store_id 必須化

-- 既存の空名・重複を正規化（trim）
update public.stores set name = trim(name) where name is not null;

-- 在籍店舗未設定の会員を先頭店舗へ（店舗が存在する場合のみ）
update public.contacts c
set store_id = (
    select s.id from public.stores s order by s.id limit 1
)
where c.store_id is null
  and exists (select 1 from public.stores);

create unique index if not exists stores_name_lower_unique
    on public.stores (lower(trim(name)));

alter table public.stores
    add constraint stores_name_not_blank
    check (length(trim(name)) > 0);

do $$
begin
    if not exists (select 1 from public.contacts where store_id is null) then
        alter table public.contacts alter column store_id set not null;
    end if;
end $$;
