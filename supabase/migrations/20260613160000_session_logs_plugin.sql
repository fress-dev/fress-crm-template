-- plugin-session-log: セッション記録（実施後カルテ）

create table public.session_logs (
    id bigint generated always as identity not null,
    appointment_id bigint,
    contact_id bigint not null,
    sales_id bigint not null,
    store_id bigint,
    membership_ticket_id bigint,
    performed_at timestamp with time zone not null,
    weight_kg numeric(5, 2),
    body_fat_percent numeric(4, 1),
    visceral_fat_level integer,
    blood_pressure text,
    waist_cm numeric(5, 1),
    basal_metabolism_kcal integer,
    muscle_mass_kg numeric(5, 2),
    body_age integer,
    body_water_percent numeric(4, 1),
    comment text,
    del_flg boolean not null default false,
    created_at timestamp with time zone not null default now(),
    constraint session_logs_pkey primary key (id),
    constraint session_logs_appointment_id_fkey
        foreign key (appointment_id) references public.appointments (id) on delete set null,
    constraint session_logs_contact_id_fkey
        foreign key (contact_id) references public.contacts (id),
    constraint session_logs_sales_id_fkey
        foreign key (sales_id) references public.sales (id),
    constraint session_logs_store_id_fkey
        foreign key (store_id) references public.stores (id) on delete set null,
    constraint session_logs_membership_ticket_id_fkey
        foreign key (membership_ticket_id) references public.membership_tickets (id) on delete set null
);

create index session_logs_appointment_id_idx on public.session_logs (appointment_id);
create index session_logs_contact_id_idx on public.session_logs (contact_id);
create index session_logs_sales_id_idx on public.session_logs (sales_id);
create index session_logs_store_id_idx on public.session_logs (store_id);
create index session_logs_performed_at_idx on public.session_logs (performed_at desc);
create index session_logs_del_flg_idx on public.session_logs (del_flg);

alter table public.session_logs enable row level security;

grant insert on table public.session_logs to authenticated;
grant select on table public.session_logs to authenticated;
grant update on table public.session_logs to authenticated;

grant insert on table public.session_logs to service_role;
grant references on table public.session_logs to service_role;
grant select on table public.session_logs to service_role;
grant trigger on table public.session_logs to service_role;
grant truncate on table public.session_logs to service_role;
grant update on table public.session_logs to service_role;

create policy "Session logs read by store scope"
    on public.session_logs
    for select
    to authenticated
    using (
        store_id is null
        or public.can_access_store(store_id)
    );

create policy "Session logs insert by store scope"
    on public.session_logs
    for insert
    to authenticated
    with check (
        store_id is null
        or public.can_access_store(store_id)
    );

create policy "Session logs update by store scope"
    on public.session_logs
    for update
    to authenticated
    using (
        store_id is null
        or public.can_access_store(store_id)
    )
    with check (
        store_id is null
        or public.can_access_store(store_id)
    );
