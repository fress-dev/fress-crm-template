-- plugin-rooms: 部屋マスタ（店舗配下）

create table public.rooms (
    id bigint generated always as identity not null,
    store_id bigint not null,
    name text not null,
    del_flg boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint rooms_pkey primary key (id),
    constraint rooms_store_id_fkey
        foreign key (store_id) references public.stores (id)
        on update cascade
        on delete restrict,
    constraint rooms_name_not_blank
        check (length(trim(name)) > 0)
);

create unique index rooms_store_name_lower_active_unique
    on public.rooms (store_id, lower(trim(name)))
    where not del_flg;

alter table public.rooms enable row level security;

grant delete on table public.rooms to authenticated;
grant insert on table public.rooms to authenticated;
grant select on table public.rooms to authenticated;
grant update on table public.rooms to authenticated;

grant delete on table public.rooms to service_role;
grant insert on table public.rooms to service_role;
grant references on table public.rooms to service_role;
grant select on table public.rooms to service_role;
grant trigger on table public.rooms to service_role;
grant truncate on table public.rooms to service_role;
grant update on table public.rooms to service_role;

create policy "Enable read access for authenticated users"
    on public.rooms
    for select
    to authenticated
    using (true);

create policy "Enable insert for authenticated users only"
    on public.rooms
    for insert
    to authenticated
    with check (true);

create policy "Enable update for authenticated users only"
    on public.rooms
    for update
    to authenticated
    using (true)
    with check (true);

create policy "Room Delete Policy"
    on public.rooms
    for delete
    to authenticated
    using (true);
