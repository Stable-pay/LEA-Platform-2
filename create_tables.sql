
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'law_enforcement',
  full_name TEXT NOT NULL,
  organization TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  case_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reported_by TEXT NOT NULL,
  estimated_loss INTEGER,
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_department TEXT,
  initiator_department TEXT NOT NULL,
  confirmer_department TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  risk_score INTEGER,
  risk_level TEXT,
  scam_patterns JSONB,
  case_ids JSONB,
  exchanges JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  tx_hash TEXT NOT NULL UNIQUE,
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  amount REAL,
  currency TEXT NOT NULL DEFAULT 'INR',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  case_id INTEGER REFERENCES cases(id),
  suspicious BOOLEAN DEFAULT false,
  pattern_id INTEGER REFERENCES suspicious_patterns(id)
);

-- Suspicious patterns table
CREATE TABLE IF NOT EXISTS suspicious_patterns (
  id SERIAL PRIMARY KEY,
  pattern_id TEXT NOT NULL UNIQUE,
  pattern TEXT NOT NULL,
  description TEXT,
  risk_level TEXT NOT NULL,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  wallet_address TEXT REFERENCES wallets(address),
  transaction_count INTEGER DEFAULT 0,
  volume TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STR reports table
CREATE TABLE IF NOT EXISTS str_reports (
  id SERIAL PRIMARY KEY,
  str_id TEXT NOT NULL UNIQUE,
  case_reference TEXT REFERENCES cases(case_id),
  report_type TEXT NOT NULL,
  primary_wallet TEXT REFERENCES wallets(address),
  description TEXT NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount INTEGER,
  include_blockchain BOOLEAN DEFAULT true,
  include_kyc BOOLEAN DEFAULT true,
  include_pattern BOOLEAN DEFAULT true,
  include_exchange BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Case timeline table
CREATE TABLE IF NOT EXISTS case_timeline (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id)
);

-- State fraud stats table
CREATE TABLE IF NOT EXISTS state_fraud_stats (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL UNIQUE,
  case_count INTEGER DEFAULT 0,
  estimated_loss INTEGER DEFAULT 0,
  risk_level TEXT,
  date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain nodes table
CREATE TABLE IF NOT EXISTS blockchain_nodes (
  id SERIAL PRIMARY KEY,
  node_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  node_type TEXT NOT NULL,
  organization TEXT NOT NULL,
  ip_address TEXT,
  port INTEGER,
  public_key TEXT,
  access_level TEXT NOT NULL DEFAULT 'full',
  status TEXT NOT NULL DEFAULT 'active',
  last_sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain transactions table
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  tx_hash TEXT NOT NULL PRIMARY KEY,
  block_hash TEXT NOT NULL,
  source_node_id TEXT REFERENCES blockchain_nodes(node_id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'confirmed',
  signature_hash TEXT,
  previous_tx_hash TEXT,
  stakeholder_id TEXT,
  stakeholder_type TEXT
);

-- KYC information table 
CREATE TABLE IF NOT EXISTS kyc_information (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id),
  exchange_node_id TEXT REFERENCES blockchain_nodes(node_id),
  kyc_hash TEXT NOT NULL,
  data_encrypted BOOLEAN DEFAULT true,
  encrypted_data TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  last_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Court exports table
CREATE TABLE IF NOT EXISTS court_exports (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  export_type TEXT NOT NULL,
  file_name TEXT,
  file_hash TEXT NOT NULL,
  signer_node_id TEXT REFERENCES blockchain_nodes(node_id),
  signer_public_key TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending',
  exported_by INTEGER REFERENCES users(id),
  document_hash TEXT,
  format TEXT DEFAULT 'pdf',
  blockchain_tx_hash TEXT REFERENCES blockchain_transactions(tx_hash)
);
