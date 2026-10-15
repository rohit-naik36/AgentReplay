-- create_all() does not alter existing tables. Run once on an existing database.
ALTER TABLE runs ADD COLUMN IF NOT EXISTS input_tokens INTEGER;
ALTER TABLE runs ADD COLUMN IF NOT EXISTS output_tokens INTEGER;
ALTER TABLE runs ADD COLUMN IF NOT EXISTS cache_read_tokens INTEGER;
ALTER TABLE runs ADD COLUMN IF NOT EXISTS cost_usd DOUBLE PRECISION;
