CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL CHECK (length(trim(title)) > 0),
  description VARCHAR(1000) NOT NULL CHECK (length(trim(description)) > 0),
  category VARCHAR(80) NOT NULL CHECK (length(trim(category)) > 0),
  item_type VARCHAR(10) NOT NULL CHECK (item_type IN ('lost', 'found')),
  location VARCHAR(120) NOT NULL CHECK (length(trim(location)) > 0),
  date_reported TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contact_name VARCHAR(120) NOT NULL CHECK (length(trim(contact_name)) > 0),
  contact_email VARCHAR(254) NOT NULL CHECK (length(trim(contact_email)) > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'claimed', 'returned', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE items ADD COLUMN IF NOT EXISTS date_reported TIMESTAMPTZ;
ALTER TABLE items ADD COLUMN IF NOT EXISTS contact_name VARCHAR(120);
ALTER TABLE items ADD COLUMN IF NOT EXISTS contact_email VARCHAR(254);
ALTER TABLE items ADD COLUMN IF NOT EXISTS status VARCHAR(20);
ALTER TABLE items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;
ALTER TABLE items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'items' AND column_name = 'reported_at'
  ) THEN
    EXECUTE 'UPDATE items SET date_reported = COALESCE(date_reported, reported_at)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'items' AND column_name = 'contact_info'
  ) THEN
    EXECUTE 'UPDATE items SET contact_email = COALESCE(NULLIF(contact_email, ''''), NULLIF(contact_info, '''')) WHERE contact_email IS NULL OR contact_email = ''''';
  END IF;
END
$$;

UPDATE items
SET date_reported = COALESCE(date_reported, NOW()),
    contact_name = COALESCE(NULLIF(contact_name, ''), 'Campus member'),
    contact_email = COALESCE(NULLIF(contact_email, ''), 'unknown@invalid.local'),
    status = COALESCE(NULLIF(status, ''), 'open'),
    created_at = COALESCE(created_at, date_reported, NOW()),
    updated_at = COALESCE(updated_at, created_at, date_reported, NOW());

ALTER TABLE items ALTER COLUMN date_reported SET DEFAULT NOW();
ALTER TABLE items ALTER COLUMN date_reported SET NOT NULL;
ALTER TABLE items ALTER COLUMN contact_name SET NOT NULL;
ALTER TABLE items ALTER COLUMN contact_email SET NOT NULL;
ALTER TABLE items ALTER COLUMN status SET DEFAULT 'open';
ALTER TABLE items ALTER COLUMN status SET NOT NULL;
ALTER TABLE items ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE items ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE items ALTER COLUMN updated_at SET DEFAULT NOW();
ALTER TABLE items ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'items'::regclass AND conname = 'items_item_type_check'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT items_item_type_check CHECK (item_type IN ('lost', 'found'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'items'::regclass AND conname = 'items_status_check'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT items_status_check
      CHECK (status IN ('open', 'claimed', 'returned', 'closed'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS items_item_type_idx ON items (item_type);
CREATE INDEX IF NOT EXISTS items_category_idx ON items (category);
CREATE INDEX IF NOT EXISTS items_date_reported_idx ON items (date_reported DESC);
CREATE INDEX IF NOT EXISTS items_status_idx ON items (status);
CREATE INDEX IF NOT EXISTS items_contact_email_idx ON items (contact_email);

CREATE OR REPLACE FUNCTION set_items_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS items_set_updated_at ON items;
CREATE TRIGGER items_set_updated_at
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION set_items_updated_at();
