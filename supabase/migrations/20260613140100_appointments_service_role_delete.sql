-- e2e の resetDb が appointments を削除できるよう service_role に DELETE を付与する
grant delete on table public.appointments to service_role;
