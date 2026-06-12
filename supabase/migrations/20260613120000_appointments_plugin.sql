-- plugin-appointments: 予約マスタ

create table public.appointments (
    id bigint generated always as identity not null,
    contact_id bigint,
    sales_id bigint not null,
    store_id bigint,
    start_at timestamp with time zone not null,
    end_at timestamp with time zone not null,
    type text not null default 'session',
    title text,
    del_flg boolean not null default false,
    created_at timestamp with time zone not null default now(),
    constraint appointments_pkey primary key (id),
    constraint appointments_contact_id_fkey
        foreign key (contact_id) references public.contacts (id) on delete set null,
    constraint appointments_sales_id_fkey
        foreign key (sales_id) references public.sales (id),
    constraint appointments_store_id_fkey
        foreign key (store_id) references public.stores (id) on delete set null
);

alter table public.appointments enable row level security;

grant insert on table public.appointments to authenticated;
grant select on table public.appointments to authenticated;
grant update on table public.appointments to authenticated;

grant insert on table public.appointments to service_role;
grant references on table public.appointments to service_role;
grant select on table public.appointments to service_role;
grant trigger on table public.appointments to service_role;
grant truncate on table public.appointments to service_role;
grant update on table public.appointments to service_role;

create policy "Enable read access for authenticated users"
    on public.appointments
    for select
    to authenticated
    using (true);

create policy "Enable insert for authenticated users only"
    on public.appointments
    for insert
    to authenticated
    with check (true);

create policy "Enable update for authenticated users only"
    on public.appointments
    for update
    to authenticated
    using (true)
    with check (true);
