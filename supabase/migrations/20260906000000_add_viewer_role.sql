-- A third role: a viewer reads the whole portfolio and writes nothing.
--
-- The value lands in its own migration on purpose: Postgres refuses to use a
-- freshly added enum label inside the transaction that added it, and the
-- policies in the next migration compare against it.
alter type user_role add value if not exists 'viewer';
