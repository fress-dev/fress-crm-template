-- e2e の resetDb が session_logs を削除できるよう service_role に DELETE を付与する
grant delete on table public.session_logs to service_role;
