# GAMINGGLOW

Portal download game dan software PC legal, cepat, dan aman dengan estetika cyberpunk dark + neon.

![GAMINGGLOW](public/images/og-image.jpg)

## Fitur Utama

- **Download Legal**: Hanya konten dengan izin distribusi resmi
- **Keamanan Terjamin**: Semua file di-scan antivirus dan terverifikasi checksum SHA-256
- **Kecepatan CDN**: Server global untuk download cepat di mana saja
- **Resume Support**: Pause dan lanjutkan download kapan saja
- **Admin Dashboard**: Kelola produk, upload, dan moderasi dengan mudah
- **DMCA Compliance**: Sistem pelaporan dan penanganan pelanggaran hak cipta

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (dengan Supabase support)
- **Cache/Sessions**: Redis
- **Storage**: AWS S3 / MinIO dengan CloudFront CDN
- **Auth**: JWT dengan refresh token rotation, 2FA (TOTP)
- **Security**: Rate limiting, CAPTCHA, virus scanning (ClamAV)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- AWS S3 atau MinIO (untuk storage)

### Installation

1. Clone repository:
```bash
git clone https://github.com/yourusername/gamingglow.git
cd gamingglow
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` dengan konfigurasi Anda:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gamingglow

# Redis
REDIS_URL=redis://localhost:6379

# AWS S3 / MinIO
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=gamingglow-files
S3_ENDPOINT=https://s3.amazonaws.com

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
```

5. Setup database:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE gamingglow;"

# Run schema
psql -U postgres -d gamingglow -f src/lib/db/schema.sql

# Seed data (staging only!)
psql -U postgres -d gamingglow -f src/lib/db/seed.sql
```

6. Run development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Staging Credentials

**WARNING**: Change these before deploying to production!

- **Admin Email**: `admin@gamingglow.local`
- **Admin Password**: `Admin123!Staging`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project di Vercel
3. Add environment variables
4. Deploy!

```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

### Docker

```bash
# Build image
docker build -t gamingglow .

# Run container
docker run -p 3000:3000 --env-file .env.local gamingglow
```

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/products` | List products |
| GET | `/api/public/products/:slug` | Get product details |
| POST | `/api/generate-download` | Generate download URL |
| POST | `/api/report-dmca` | Submit DMCA claim |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| PUT | `/api/admin/login` | Verify 2FA |
| POST | `/api/admin/logout` | Logout |
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/products` | List products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products` | Update product |
| DELETE | `/api/admin/products?id=:id` | Delete product |
| POST | `/api/admin/2fa` | Setup/manage 2FA |
| GET | `/api/admin/logs` | Audit logs |

## Security Checklist

- [ ] Change default admin password
- [ ] Enable 2FA for superadmin
- [ ] Generate strong JWT secrets
- [ ] Configure S3 bucket policies
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Configure CAPTCHA
- [ ] Enable virus scanning (ClamAV)
- [ ] Setup backup schedule
- [ ] Configure Sentry for error tracking

## Directory Structure

```
gamingglow/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (public)/     # Public pages
│   │   ├── (admin)/      # Admin pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── public/       # Public UI components
│   │   └── admin/        # Admin UI components
│   ├── lib/              # Utilities
│   │   ├── db/           # Database
│   │   ├── auth/         # Authentication
│   │   ├── storage/      # S3/MinIO
│   │   └── redis/        # Redis client
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

[MIT](LICENSE)

## Support

- Email: support@gamingglow.local
- DMCA: dmca@gamingglow.local

---

Built with ❤️ by GAMINGGLOW Team
