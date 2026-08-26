-- Audit trail for statistics_entries create/update/delete.

create table audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_table_name on audit_logs(table_name);
create index idx_audit_logs_record_id on audit_logs(record_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);

create or replace function audit_statistics_entries()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_logs (actor_id, action, table_name, record_id, new_data)
    values (auth.uid(), 'INSERT', 'statistics_entries', new.id, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into audit_logs (actor_id, action, table_name, record_id, old_data, new_data)
    values (auth.uid(), 'UPDATE', 'statistics_entries', new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    insert into audit_logs (actor_id, action, table_name, record_id, old_data)
    values (auth.uid(), 'DELETE', 'statistics_entries', old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

create trigger statistics_entries_audit
  after insert or update or delete on statistics_entries
  for each row
  execute function audit_statistics_entries();
