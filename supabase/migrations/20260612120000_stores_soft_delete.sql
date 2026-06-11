-- plugin-stores-soft-delete: 論理削除 del_flg と有効店舗のみ名前一意

alter table public.stores
    add column del_flg boolean not null default false;

drop index if exists public.stores_name_lower_unique;

create unique index stores_name_lower_active_unique
    on public.stores (lower(trim(name)))
    where not del_flg;
