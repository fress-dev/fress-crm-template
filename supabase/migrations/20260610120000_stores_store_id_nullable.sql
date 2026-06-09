-- stores プラグイン無効時も会員 CRUD が動くよう store_id は nullable を維持する
-- （必須化は UI バリデーションで行い、DB NOT NULL は付けない）

alter table public.contacts alter column store_id drop not null;
