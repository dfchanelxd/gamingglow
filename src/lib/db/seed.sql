-- ============================================
-- GAMINGGLOW - Seed Data
-- ============================================

-- NOTE: This seed data is for staging/development only!
-- CHANGE PASSWORDS BEFORE PRODUCTION DEPLOYMENT!

-- ============================================
-- ADMIN USERS
-- ============================================

-- Password: Admin123!Staging (bcrypt hashed)
-- Use https://bcrypt-generator.com/ to generate new hashes

INSERT INTO admins (id, email, password_hash, role, tfa_enabled, disabled, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@gamingglow.local', '$2b$10$YourHashHere', 'superadmin', FALSE, FALSE, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440001', 'editor@gamingglow.local', '$2b$10$YourHashHere', 'editor', FALSE, FALSE, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'moderator@gamingglow.local', '$2b$10$YourHashHere', 'moderator', FALSE, FALSE, CURRENT_TIMESTAMP);

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO categories (slug, name, description, icon, product_count) VALUES
('action', 'Action', 'Game aksi penuh adrenaline dengan pertarungan intens', 'Sword', 0),
('adventure', 'Adventure', 'Petualangan epik dengan cerita mendalam', 'Map', 0),
('rpg', 'RPG', 'Role-playing game dengan karakter yang dapat dikembangkan', 'User', 0),
('strategy', 'Strategy', 'Game strategi yang menguji kecerdasan taktis', 'Brain', 0),
('simulation', 'Simulation', 'Simulasi realistis untuk pengalaman imersif', 'Cog', 0),
('sports', 'Sports', 'Game olahraga dengan fisik realistis', 'Trophy', 0),
('racing', 'Racing', 'Balapan cepat dengan kendaraan various', 'Car', 0),
('productivity', 'Productivity', 'Software untuk meningkatkan produktivitas', 'Zap', 0),
('multimedia', 'Multimedia', 'Software untuk editing dan kreasi konten', 'Film', 0),
('utility', 'Utility', 'Tools utilitas untuk optimasi sistem', 'Wrench', 0),
('security', 'Security', 'Software keamanan dan proteksi sistem', 'Shield', 0),
('development', 'Development', 'Tools untuk pengembangan software', 'Code', 0);

-- ============================================
-- PRODUCTS - GAMES
-- ============================================

INSERT INTO products (id, slug, title, tagline, description, type, category, publisher, developer, status, featured, staff_pick, published_at, created_by, created_at, tags, languages, system_requirements) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'cyber-odyssey-2077',
    'Cyber Odyssey 2077',
    'Petualangan cyberpunk di masa depan yang gelap',
    'Cyber Odyssey 2077 adalah game action RPG yang membawa Anda ke dunia dystopian Neo-Tokyo tahun 2077. Jelajahi kota megapolis yang penuh neon, hack sistem keamanan korporasi, dan bentuk aliansi dengan faksi-faksi underground. Dengan grafis ray-tracing yang memukau dan gameplay stealth-action yang mendalam, setiap keputusan Anda akan membentuk nasib kota.',
    'game',
    'action',
    'Neon Forge Studios',
    'Neon Forge Studios',
    'published',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP,
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    '["cyberpunk", "open-world", "rpg", "stealth", "hacking"]',
    '["Indonesia", "English", "Japanese", "Chinese"]',
    '{
        "minimum": {
            "os": "Windows 10 64-bit",
            "processor": "Intel Core i5-8400 / AMD Ryzen 3 3300X",
            "memory": "12 GB RAM",
            "graphics": "NVIDIA GTX 1060 6GB / AMD RX 580 8GB",
            "storage": "70 GB SSD",
            "directX": "Version 12"
        },
        "recommended": {
            "os": "Windows 11 64-bit",
            "processor": "Intel Core i7-12700K / AMD Ryzen 7 5800X",
            "memory": "16 GB RAM",
            "graphics": "NVIDIA RTX 3070 / AMD RX 6800 XT",
            "storage": "70 GB NVMe SSD",
            "directX": "Version 12",
            "additionalNotes": "SSD required for optimal performance. Ray tracing requires RTX 30 series or above."
        }
    }'::jsonb
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    'stellar-commander',
    'Stellar Commander',
    'Komandan armada luar angkasa dalam perang galaksi',
    'Stellar Commander adalah game strategi ruang angkasa epik di mana Anda memimpin armada intergalaksi melawan ancaman alien. Bangun kapal perang kustom, kelola sumber daya planet, dan rekrut komandan berbakat. Dengan pertempuran taktis real-time dan kampanye cerita yang branching, setiap keputusan taktis berdampak pada nasib galaksi.',
    'game',
    'strategy',
    'Cosmos Interactive',
    'Cosmos Interactive',
    'published',
    TRUE,
    FALSE,
    CURRENT_TIMESTAMP,
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    '["space", "strategy", "rts", "sci-fi", "fleet-combat"]',
    '["Indonesia", "English", "German", "French", "Russian"]',
    '{
        "minimum": {
            "os": "Windows 10 64-bit",
            "processor": "Intel Core i5-6600 / AMD FX-8350",
            "memory": "8 GB RAM",
            "graphics": "NVIDIA GTX 960 / AMD R9 280",
            "storage": "35 GB HDD",
            "directX": "Version 11"
        },
        "recommended": {
            "os": "Windows 11 64-bit",
            "processor": "Intel Core i7-10700 / AMD Ryzen 5 5600X",
            "memory": "16 GB RAM",
            "graphics": "NVIDIA RTX 2060 / AMD RX 5700",
            "storage": "35 GB SSD",
            "directX": "Version 12"
        }
    }'::jsonb
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    'shadow-blade-chronicles',
    'Shadow Blade Chronicles',
    'Petualangan ninja dengan kombat cepat dan fluid',
    'Shadow Blade Chronicles menghadirkan pengalaman ninja autentik dengan sistem kombat yang cepat dan memuaskan. Gunakan berbagai senjata tradisional Jepang, mastered teknik stealth, dan ungkap konspirasi yang mengancam keseluruhan klan. Dengan art style yang terinspirasi dari ukiyo-e dan gameplay yang challenging, game ini adalah wajib untuk fans action-platformer.',
    'game',
    'action',
    'Cherry Blossom Games',
    'Cherry Blossom Games',
    'published',
    FALSE,
    TRUE,
    CURRENT_TIMESTAMP,
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    '["ninja", "action", "platformer", "japanese", "stealth"]',
    '["Indonesia", "English", "Japanese"]',
    '{
        "minimum": {
            "os": "Windows 10 64-bit",
            "processor": "Intel Core i3-8100 / AMD Ryzen 3 1200",
            "memory": "8 GB RAM",
            "graphics": "NVIDIA GTX 1050 Ti / AMD RX 560",
            "storage": "25 GB SSD",
            "directX": "Version 11"
        },
        "recommended": {
            "os": "Windows 11 64-bit",
            "processor": "Intel Core i5-10400 / AMD Ryzen 5 3600",
            "memory": "12 GB RAM",
            "graphics": "NVIDIA GTX 1660 Super / AMD RX 5600 XT",
            "storage": "25 GB NVMe SSD",
            "directX": "Version 12"
        }
    }'::jsonb
);

-- ============================================
-- PRODUCTS - SOFTWARE
-- ============================================

INSERT INTO products (id, slug, title, tagline, description, type, category, publisher, developer, status, featured, staff_pick, published_at, created_by, created_at, tags, languages, system_requirements) VALUES
(
    '770e8400-e29b-41d4-a716-446655440000',
    'glow-edit-pro',
    'GlowEdit Pro',
    'Software editing video profesional dengan AI-powered tools',
    'GlowEdit Pro adalah solusi editing video all-in-one untuk kreator konten dan profesional. Dengan AI-powered color grading, motion tracking otomatis, dan library efek yang luas, produksi video Anda akan lebih cepat dan berkualitas tinggi. Dukungan untuk format 8K dan HDR memastikan konten Anda siap untuk masa depan.',
    'software',
    'multimedia',
    'GLOW Software',
    'GLOW Software',
    'published',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP,
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    '["video-editing", "ai-powered", "color-grading", "motion-tracking", "8k"]',
    '["Indonesia", "English", "Spanish", "Portuguese"]',
    '{
        "minimum": {
            "os": "Windows 10 64-bit (21H2 or later)",
            "processor": "Intel Core i5-9400 / AMD Ryzen 5 2600",
            "memory": "16 GB RAM",
            "graphics": "NVIDIA GTX 1650 4GB / AMD RX 570 4GB",
            "storage": "10 GB SSD",
            "additionalNotes": "Internet connection required for AI features"
        },
        "recommended": {
            "os": "Windows 11 64-bit",
            "processor": "Intel Core i7-12700 / AMD Ryzen 7 5800X",
            "memory": "32 GB RAM",
            "graphics": "NVIDIA RTX 3060 12GB / AMD RX 6700 XT 12GB",
            "storage": "10 GB NVMe SSD",
            "additionalNotes": "NVIDIA GPU recommended for optimal AI performance"
        }
    }'::jsonb
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    'secure-vault-plus',
    'SecureVault Plus',
    'Proteksi data enterprise-grade untuk PC Anda',
    'SecureVault Plus menyediakan enkripsi file military-grade, password manager terintegrasi, dan proteksi real-time terhadap malware. Dengan fitur secure cloud backup dan two-factor authentication, data sensitif Anda selalu terlindungi. Cocok untuk profesional dan bisnis kecil-menengah.',
    'software',
    'security',
    'CyberShield Solutions',
    'CyberShield Solutions',
    'published',
    FALSE,
    FALSE,
    CURRENT_TIMESTAMP,
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    '["encryption", "security", "password-manager", "malware-protection", "backup"]',
    '["Indonesia", "English", "German", "French"]',
    '{
        "minimum": {
            "os": "Windows 10 64-bit",
            "processor": "Intel Core i3-6100 / AMD FX-6300",
            "memory": "4 GB RAM",
            "graphics": "Integrated graphics",
            "storage": "2 GB SSD",
            "additionalNotes": "Internet connection required for cloud features"
        },
        "recommended": {
            "os": "Windows 11 64-bit",
            "processor": "Intel Core i5-8400 / AMD Ryzen 5 2600",
            "memory": "8 GB RAM",
            "graphics": "Integrated graphics",
            "storage": "5 GB SSD"
        }
    }'::jsonb
);

-- ============================================
-- RELEASES
-- ============================================

INSERT INTO releases (id, product_id, version, changelog, file_key, file_size, checksum_sha256, scan_status, download_count, is_latest, uploaded_at, published_at, uploaded_by) VALUES
(
    '880e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '1.0.5',
    '- Fixed ray-tracing memory leak\n- Improved NPC AI behavior\n- Added new side quests in District 7\n- Optimized loading times by 30%\n- Fixed controller vibration on Xbox',
    'games/cyber-odyssey-2077/v1.0.5/cyber-odyssey-2077-setup.zip',
    68719476736,
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    'clean',
    15420,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    '550e8400-e29b-41d4-a716-446655440000'
),
(
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '2.1.0',
    '- New faction: The Void Collective\n- Added 5 new ship classes\n- Reworked diplomacy system\n- Multiplayer beta now available\n- Balance adjustments for early game',
    'games/stellar-commander/v2.1.0/stellar-commander-setup.zip',
    37580963840,
    'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1',
    'clean',
    8930,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '14 days',
    CURRENT_TIMESTAMP - INTERVAL '14 days',
    '550e8400-e29b-41d4-a716-446655440000'
),
(
    '880e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    '1.2.3',
    - Added New Game+ mode
- New boss: Shadow Shogun
- Unlockable costumes
- Photo mode improvements
- Bug fixes and stability improvements',
    'games/shadow-blade-chronicles/v1.2.3/shadow-blade-setup.zip',
    26843545600,
    'c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2',
    'clean',
    22150,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    '550e8400-e29b-41d4-a716-446655440000'
),
(
    '880e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440000',
    '3.0.1',
    '- AI color grading v2.0\n- Native Apple Silicon support\n- Improved timeline performance\n- New transition effects pack\n- Bug fixes for 8K export',
    'software/glow-edit-pro/v3.0.1/glow-edit-pro-setup.zip',
    2147483648,
    'd4e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2c3',
    'clean',
    5670,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    '550e8400-e29b-41d4-a716-446655440000'
),
(
    '880e8400-e29b-41d4-a716-446655440004',
    '770e8400-e29b-41d4-a716-446655440001',
    '5.2.0',
    '- New ransomware protection module\n- Password breach monitoring\n- Dark web monitoring beta\n- UI refresh with dark mode\n- Performance improvements',
    'software/secure-vault-plus/v5.2.0/secure-vault-setup.zip',
    524288000,
    'e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2c3d4',
    'clean',
    12890,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '21 days',
    CURRENT_TIMESTAMP - INTERVAL '21 days',
    '550e8400-e29b-41d4-a716-446655440000'
);

-- ============================================
-- SETTINGS
-- ============================================

INSERT INTO settings (key, value, updated_by) VALUES
('site_name', 'GAMINGGLOW', '550e8400-e29b-41d4-a716-446655440000'),
('site_description', 'Portal download game dan software PC legal, cepat, dan aman', '550e8400-e29b-41d4-a716-446655440000'),
('maintenance_mode', 'false', '550e8400-e29b-41d4-a716-446655440000'),
('require_captcha', 'true', '550e8400-e29b-41d4-a716-446655440000'),
('max_upload_size', '10737418240', '550e8400-e29b-41d4-a716-446655440000'),
('download_expiry_minutes', '30', '550e8400-e29b-41d4-a716-446655440000'),
('email_notifications', 'false', '550e8400-e29b-41d4-a716-446655440000'),
('allowed_file_types', '["zip", "exe", "msi", "dmg", "pkg"]', '550e8400-e29b-41d4-a716-446655440000');

-- ============================================
-- UPDATE CATEGORY COUNTS
-- ============================================

UPDATE categories SET product_count = (
    SELECT COUNT(*) FROM products WHERE category = categories.slug AND status = 'published'
);
