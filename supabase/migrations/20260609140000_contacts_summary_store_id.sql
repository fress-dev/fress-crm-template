-- contacts に store_id 追加後、contacts_summary を再作成して列を反映する

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
