-- plugin-stores-rls: スタッフの担当店舗と contacts / stores の RLS

create table public.sales_stores (
    sales_id bigint not null,
    store_id bigint not null,
    created_at timestamp with time zone not null default now(),
    constraint sales_stores_pkey primary key (sales_id, store_id),
    constraint sales_stores_sales_id_fkey
        foreign key (sales_id) references public.sales (id)
        on update cascade
        on delete cascade,
    constraint sales_stores_store_id_fkey
        foreign key (store_id) references public.stores (id)
        on update cascade
        on delete cascade
);

alter table public.sales_stores enable row level security;

grant select on table public.sales_stores to authenticated;
grant insert on table public.sales_stores to authenticated;
grant update on table public.sales_stores to authenticated;
grant delete on table public.sales_stores to authenticated;

grant all on table public.sales_stores to service_role;

-- ログインユーザーの sales.id を返す
create or replace function public.current_sales_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
    select id
    from public.sales
    where user_id = auth.uid()
    limit 1;
$$;

-- ログインユーザーに担当店舗が割り当て済みか
create or replace function public.has_store_restrictions()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.sales_stores
        where sales_id = public.current_sales_id()
    );
$$;

-- 指定店舗へのアクセス可否（管理者・未割当スタッフは全店舗可）
create or replace function public.can_access_store(p_store_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select
        public.is_admin()
        or not public.has_store_restrictions()
        or p_store_id is null
        or exists (
            select 1
            from public.sales_stores
            where sales_id = public.current_sales_id()
              and store_id = p_store_id
        );
$$;

grant execute on function public.current_sales_id() to authenticated;
grant execute on function public.has_store_restrictions() to authenticated;
grant execute on function public.can_access_store(bigint) to authenticated;

grant execute on function public.current_sales_id() to service_role;
grant execute on function public.has_store_restrictions() to service_role;
grant execute on function public.can_access_store(bigint) to service_role;

-- sales_stores: 自分の行は閲覧可、変更は管理者のみ
create policy "Sales stores read own or admin"
    on public.sales_stores
    for select
    to authenticated
    using (
        public.is_admin()
        or sales_id = public.current_sales_id()
    );

create policy "Sales stores insert admin only"
    on public.sales_stores
    for insert
    to authenticated
    with check (public.is_admin());

create policy "Sales stores update admin only"
    on public.sales_stores
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "Sales stores delete admin only"
    on public.sales_stores
    for delete
    to authenticated
    using (public.is_admin());

-- contacts: 担当店舗の会員のみ
drop policy if exists "Enable read access for authenticated users" on public.contacts;
drop policy if exists "Enable insert for authenticated users only" on public.contacts;
drop policy if exists "Enable update for authenticated users only" on public.contacts;
drop policy if exists "Contact Delete Policy" on public.contacts;

create policy "Contacts read by store scope"
    on public.contacts
    for select
    to authenticated
    using (public.can_access_store(store_id));

create policy "Contacts insert by store scope"
    on public.contacts
    for insert
    to authenticated
    with check (public.can_access_store(store_id));

create policy "Contacts update by store scope"
    on public.contacts
    for update
    to authenticated
    using (public.can_access_store(store_id))
    with check (public.can_access_store(store_id));

create policy "Contacts delete by store scope"
    on public.contacts
    for delete
    to authenticated
    using (public.can_access_store(store_id));

-- stores: 担当店舗のみ参照（CRUD ポリシーは Phase 1 のまま）
drop policy if exists "Enable read access for authenticated users" on public.stores;

create policy "Stores read by store scope"
    on public.stores
    for select
    to authenticated
    using (public.can_access_store(id));
