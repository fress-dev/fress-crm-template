-- plugin-memberships: 契約と回数券

create table public.memberships (
    id bigint generated always as identity not null,
    contact_id bigint not null,
    course_id bigint not null,
    store_id bigint,
    ticket_count integer not null,
    status text not null default 'active',
    started_at date,
    ended_at date,
    notes text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint memberships_pkey primary key (id),
    constraint memberships_contact_id_fkey
        foreign key (contact_id) references public.contacts (id),
    constraint memberships_course_id_fkey
        foreign key (course_id) references public.courses (id),
    constraint memberships_store_id_fkey
        foreign key (store_id) references public.stores (id) on delete set null,
    constraint memberships_ticket_count_positive check (ticket_count > 0),
    constraint memberships_status_check
        check (status in ('active', 'completed', 'cancelled'))
);

create index memberships_contact_id_idx on public.memberships (contact_id);
create index memberships_course_id_idx on public.memberships (course_id);
create index memberships_status_idx on public.memberships (status);

create table public.membership_tickets (
    id bigint generated always as identity not null,
    membership_id bigint not null,
    contact_id bigint not null,
    ticket_number integer not null,
    status text not null default 'available',
    used_at timestamp with time zone,
    created_at timestamp with time zone not null default now(),
    constraint membership_tickets_pkey primary key (id),
    constraint membership_tickets_membership_id_fkey
        foreign key (membership_id) references public.memberships (id) on delete cascade,
    constraint membership_tickets_contact_id_fkey
        foreign key (contact_id) references public.contacts (id),
    constraint membership_tickets_membership_id_ticket_number_key
        unique (membership_id, ticket_number),
    constraint membership_tickets_status_check
        check (status in ('available', 'reserved', 'used', 'cancelled'))
);

create index membership_tickets_membership_id_idx
    on public.membership_tickets (membership_id);
create index membership_tickets_contact_id_idx
    on public.membership_tickets (contact_id);

create or replace function public.update_memberships_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger update_memberships_updated_at
    before update on public.memberships
    for each row
    execute function public.update_memberships_updated_at();

alter table public.memberships enable row level security;
alter table public.membership_tickets enable row level security;

grant delete, insert, select, update on table public.memberships to authenticated;
grant delete, insert, references, select, trigger, truncate, update
    on table public.memberships to service_role;
grant delete, insert, select, update on table public.membership_tickets to authenticated;
grant delete, insert, references, select, trigger, truncate, update
    on table public.membership_tickets to service_role;

create policy "Enable read access for authenticated users"
    on public.memberships for select to authenticated using (true);
create policy "Enable insert for authenticated users only"
    on public.memberships for insert to authenticated with check (true);
create policy "Enable update for authenticated users only"
    on public.memberships for update to authenticated using (true) with check (true);
create policy "Membership Delete Policy"
    on public.memberships for delete to authenticated using (true);

create policy "Enable read access for authenticated users"
    on public.membership_tickets for select to authenticated using (true);
create policy "Enable insert for authenticated users only"
    on public.membership_tickets for insert to authenticated with check (true);
create policy "Enable update for authenticated users only"
    on public.membership_tickets for update to authenticated using (true) with check (true);
create policy "Membership Ticket Delete Policy"
    on public.membership_tickets for delete to authenticated using (true);
