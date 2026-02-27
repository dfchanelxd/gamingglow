// ============================================
// GAMINGGLOW - Type Definitions
// ============================================

// User & Authentication
export interface User {
  id: string;
  email: string;
  role: "superadmin" | "editor" | "moderator" | "uploader";
  tfaEnabled: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  disabled: boolean;
}

export interface AdminSession {
  id: string;
  adminId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}

// Products (Games & Software)
export type ProductType = "game" | "software";
export type ProductStatus = "draft" | "staging" | "published" | "archived";

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: ProductType;
  category: string;
  publisher: string;
  developer?: string;
  status: ProductStatus;
  featured: boolean;
  staffPick: boolean;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  // Relations
  releases?: Release[];
  images?: ProductImage[];
  tags?: string[];
  languages?: string[];
  systemRequirements?: SystemRequirements;
}

export interface Release {
  id: string;
  productId: string;
  version: string;
  changelog: string;
  fileKey: string;
  fileSize: number;
  checksumSha256: string;
  scanStatus: "pending" | "scanning" | "clean" | "infected" | "error";
  scanResult?: string;
  downloadCount: number;
  isLatest: boolean;
  uploadedAt: Date;
  publishedAt: Date | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  type: "cover" | "screenshot" | "thumbnail" | "banner";
  url: string;
  width: number;
  height: number;
  order: number;
}

export interface SystemRequirements {
  minimum: Requirements;
  recommended: Requirements;
}

export interface Requirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
  directX?: string;
  additionalNotes?: string;
}

// Categories & Tags
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  productCount: number;
}

// Downloads
export interface DownloadRequest {
  productSlug: string;
  version?: string;
  email?: string;
  captchaToken?: string;
}

export interface DownloadResponse {
  downloadUrl: string;
  expiresAt: Date;
  checksum: string;
  filename: string;
  fileSize: number;
}

export interface DownloadStat {
  id: string;
  productId: string;
  releaseId: string;
  timestamp: Date;
  ipHash: string;
  bytesTransferred: number;
  userAgent?: string;
}

// DMCA
export interface DMCAClaim {
  id: string;
  productId: string | null;
  claimantName: string;
  claimantEmail: string;
  claimantAddress: string;
  infringingMaterial: string;
  originalMaterial: string;
  goodFaithStatement: boolean;
  accuracyStatement: boolean;
  signature: string;
  evidenceLinks: string[];
  status: "pending" | "under_review" | "accepted" | "rejected" | "resolved";
  adminNotes?: string;
  actionTaken?: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
}

// Audit Logs
export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  downloadsToday: number;
  downloadsThisWeek: number;
  downloadsThisMonth: number;
  totalDownloads: number;
  totalProducts: number;
  pendingUploads: number;
  storageUsed: number;
  storageLimit: number;
  pendingDMCAClaims: number;
  recentDownloads: RecentDownload[];
  topProducts: TopProduct[];
}

export interface RecentDownload {
  productTitle: string;
  version: string;
  timestamp: Date;
  ipHash: string;
}

export interface TopProduct {
  id: string;
  title: string;
  slug: string;
  downloadCount: number;
  type: ProductType;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Upload
export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
}

// Moderation
export interface ModerationQueueItem {
  id: string;
  productId: string;
  productTitle: string;
  submittedBy: string;
  submittedAt: Date;
  reason: string;
  priority: "low" | "medium" | "high";
}

// Settings
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireCaptcha: boolean;
  maxUploadSize: number;
  allowedFileTypes: string[];
  downloadExpiryMinutes: number;
  emailNotifications: boolean;
}

// JSON-LD for SEO
export interface SoftwareApplicationSchema {
  "@context": string;
  "@type": "SoftwareApplication" | "VideoGame";
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  softwareVersion?: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    ratingCount: string;
  };
  image?: string;
  publisher?: string;
  datePublished?: string;
}
