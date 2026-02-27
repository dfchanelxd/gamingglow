-- ============================================
-- GAMINGGLOW - Database Schema
-- PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMINS & AUTHENTICATION
-- ============================================

CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'editor', 'moderator', 'uploader')),
    tfa_secret VARCHAR(255),
    tfa_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);

-- Admin Sessions for JWT refresh token rotation
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- ============================================
-- PRODUCTS (GAMES & SOFTWARE)
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('game', 'software')),
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(255),
    developer VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'staging', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    staff_pick BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- SEO fields
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    -- JSON fields for flexibility
    tags JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    system_requirements JSONB
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_created_at ON products(created_at);

-- Full-text search
ALTER TABLE products ADD COLUMN search_vector tsvector 
    GENERATED ALWAYS AS (
        setweight(to_tsvector('indonesian', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('indonesian', COALESCE(tagline, '')), 'B') ||
        setweight(to_tsvector('indonesian', COALESCE(description, '')), 'C')
    ) STORED;

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- ============================================
-- RELEASES (VERSIONS)
-- ============================================

CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    changelog TEXT,
    file_key VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    checksum_sha256 VARCHAR(64),
    scan_status VARCHAR(20) DEFAULT 'pending' CHECK (scan_status IN ('pending', 'scanning', 'clean', 'infected', 'error')),
    scan_result TEXT,
    download_count INTEGER DEFAULT 0,
    is_latest BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    uploaded_by UUID REFERENCES admins(id),
    UNIQUE(product_id, version)
);

CREATE INDEX idx_releases_product_id ON releases(product_id);
CREATE INDEX idx_releases_version ON releases(version);
CREATE INDEX idx_releases_is_latest ON releases(is_latest) WHERE is_latest = TRUE;
CREATE INDEX idx_releases_scan_status ON releases(scan_status);

-- ============================================
-- PRODUCT IMAGES
-- ============================================

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('cover', 'screenshot', 'thumbnail', 'banner')),
    path VARCHAR(500) NOT NULL,
    width INTEGER,
    height INTEGER,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_product_id ON images(product_id);
CREATE INDEX idx_images_type ON images(type);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- DMCA CLAIMS
-- ============================================

CREATE TABLE dmca_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    claimant_name VARCHAR(255) NOT NULL,
    claimant_email VARCHAR(255) NOT NULL,
    claimant_address TEXT NOT NULL,
    infringing_material TEXT NOT NULL,
    original_material TEXT NOT NULL,
    good_faith_statement BOOLEAN NOT NULL,
    accuracy_statement BOOLEAN NOT NULL,
    signature VARCHAR(255) NOT NULL,
    evidence_links JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'resolved')),
    admin_notes TEXT,
    action_taken TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES admins(id)
);

CREATE INDEX idx_dmca_claims_status ON dmca_claims(status);
CREATE INDEX idx_dmca_claims_product_id ON dmca_claims(product_id);
CREATE INDEX idx_dmca_claims_submitted_at ON dmca_claims(submitted_at);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Partition audit_logs by month for performance
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ============================================
-- DOWNLOAD STATS
-- ============================================

CREATE TABLE download_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(32) NOT NULL,
    bytes_transferred BIGINT DEFAULT 0,
    user_agent TEXT
);

CREATE INDEX idx_download_stats_product_id ON download_stats(product_id);
CREATE INDEX idx_download_stats_timestamp ON download_stats(timestamp);
CREATE INDEX idx_download_stats_ip_hash ON download_stats(ip_hash);

-- ============================================
-- RATE LIMITING (can also use Redis)
-- ============================================

CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ip_address, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- ============================================
-- EMAIL SUBSCRIPTIONS
-- ============================================

CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_product ON email_subscriptions(product_id);

-- ============================================
-- SETTINGS
-- ============================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES admins(id)
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update product count in categories
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
        UPDATE categories SET product_count = product_count + 1 WHERE slug = NEW.category;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'published' AND NEW.status = 'published' THEN
        UPDATE categories SET product_count = product_count + 1 WHERE slug = NEW.category;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'published' AND NEW.status != 'published' THEN
        UPDATE categories SET product_count = product_count - 1 WHERE slug = NEW.category;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
        UPDATE categories SET product_count = product_count - 1 WHERE slug = OLD.category;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_count AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- Set is_latest flag
CREATE OR REPLACE FUNCTION set_latest_release()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_latest = TRUE THEN
        UPDATE releases SET is_latest = FALSE 
        WHERE product_id = NEW.product_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_latest_release_trigger BEFORE INSERT OR UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION set_latest_release();
