PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT NOT NULL,
  career TEXT NOT NULL DEFAULT '',
  niche TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  avatar_asset_id TEXT,
  cover_asset_id TEXT,
  premium_enabled INTEGER NOT NULL DEFAULT 0 CHECK (premium_enabled IN (0, 1)),
  premium_until TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON profiles(premium_enabled, premium_until);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('portfolio', 'downloadable', 'video', 'lesson')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assets_owner ON media_assets(owner_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_public ON media_assets(visibility, asset_type, created_at DESC);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  creator_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL UNIQUE REFERENCES media_assets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_aoa INTEGER NOT NULL CHECK (price_aoa >= 0),
  currency TEXT NOT NULL DEFAULT 'AOA',
  product_type TEXT NOT NULL CHECK (product_type IN ('download', 'course', 'video', 'template')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_creator ON products(creator_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  buyer_user_id TEXT NOT NULL REFERENCES users(id),
  total_aoa INTEGER NOT NULL CHECK (total_aoa >= 0),
  currency TEXT NOT NULL DEFAULT 'AOA',
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT NOT NULL DEFAULT 'multicaixa_reference',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  creator_user_id TEXT NOT NULL REFERENCES users(id),
  title_snapshot TEXT NOT NULL,
  price_aoa INTEGER NOT NULL CHECK (price_aoa >= 0),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount_aoa INTEGER NOT NULL CHECK (amount_aoa >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'cancelled', 'refunded')),
  due_date TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'multicaixa_reference',
  provider TEXT,
  provider_reference_id TEXT,
  provider_transaction_id TEXT,
  multicaixa_entity_id TEXT,
  multicaixa_reference_number TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status, due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_provider_reference ON invoices(provider_reference_id);
CREATE INDEX IF NOT EXISTS idx_invoices_provider_transaction ON invoices(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_invoices_mc_reference ON invoices(multicaixa_entity_id, multicaixa_reference_number);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  amount_aoa INTEGER NOT NULL,
  event_payload TEXT NOT NULL DEFAULT '{}',
  received_at TEXT NOT NULL,
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  budget TEXT NOT NULL DEFAULT 'A combinar',
  location TEXT NOT NULL DEFAULT 'A definir',
  deadline TEXT NOT NULL DEFAULT 'A definir',
  brief TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'closed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_opportunities_public ON opportunities(status, category, created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  source TEXT NOT NULL DEFAULT 'website',
  consent_at TEXT NOT NULL,
  unsubscribed_at TEXT,
  latest_issue_sent_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(unsubscribed_at);
