import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

// ============================================
// S3/MinIO Client Configuration
// ============================================

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "gamingglow-files";

// ============================================
// Upload Functions
// ============================================

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  etag?: string;
}

export async function uploadFile(
  key: string,
  body: Buffer | Readable,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  const response = await s3Client.send(command);
  
  return {
    key,
    url: `https://${process.env.CLOUDFRONT_DOMAIN || BUCKET_NAME}.s3.amazonaws.com/${key}`,
    size: Buffer.isBuffer(body) ? body.length : 0,
    etag: response.ETag,
  };
}

export async function uploadProductImage(
  productId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  const key = `products/${productId}/images/${Date.now()}-${fileName}`;
  return uploadFile(key, buffer, contentType);
}

export async function uploadReleaseFile(
  productSlug: string,
  version: string,
  fileName: string,
  buffer: Buffer,
  contentType: string = "application/zip"
): Promise<UploadResult> {
  const key = `products/${productSlug}/releases/${version}/${fileName}`;
  return uploadFile(key, buffer, contentType, {
    "product-slug": productSlug,
    version,
    "upload-date": new Date().toISOString(),
  });
}

// ============================================
// Download & Presigned URLs
// ============================================

export interface PresignedUrlResult {
  url: string;
  expiresAt: Date;
}

export async function generatePresignedDownloadUrl(
  key: string,
  filename: string,
  expirySeconds: number = 1800 // 30 minutes default
): Promise<PresignedUrlResult> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expirySeconds,
  });

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expirySeconds);

  return { url, expiresAt };
}

export async function generatePresignedViewUrl(
  key: string,
  expirySeconds: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
}

// ============================================
// File Management
// ============================================

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export async function deleteProductFiles(productId: string): Promise<void> {
  // List all files under product prefix
  const listCommand = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: `products/${productId}/`,
  });

  const response = await s3Client.send(listCommand);
  
  if (response.Contents) {
    for (const object of response.Contents) {
      if (object.Key) {
        await deleteFile(object.Key);
      }
    }
  }
}

export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

export async function getFileSize(key: string): Promise<number> {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response.ContentLength || 0;
}

// ============================================
// Stream Download (for virus scanning)
// ============================================

export async function streamFile(key: string): Promise<Readable> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error("Empty response body");
  }

  return response.Body as Readable;
}

// ============================================
// CDN URL Generation
// ============================================

export function getCDNUrl(key: string): string {
  if (process.env.CLOUDFRONT_DOMAIN) {
    return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

// ============================================
// Local Storage (Development Fallback)
// ============================================

import * as fs from "fs/promises";
import * as path from "path";

const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || "./uploads";

export async function saveFileLocally(
  relativePath: string,
  buffer: Buffer
): Promise<string> {
  const fullPath = path.join(LOCAL_STORAGE_PATH, relativePath);
  const dir = path.dirname(fullPath);
  
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, buffer);
  
  return fullPath;
}

export async function readLocalFile(relativePath: string): Promise<Buffer> {
  const fullPath = path.join(LOCAL_STORAGE_PATH, relativePath);
  return fs.readFile(fullPath);
}

export async function deleteLocalFile(relativePath: string): Promise<void> {
  const fullPath = path.join(LOCAL_STORAGE_PATH, relativePath);
  await fs.unlink(fullPath);
}

// ============================================
// Checksum Utilities
// ============================================

import crypto from "crypto";

export function generateSHA256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function generateSHA256FromStream(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

export function verifyChecksum(buffer: Buffer, expectedChecksum: string): boolean {
  const actualChecksum = generateSHA256(buffer);
  return actualChecksum.toLowerCase() === expectedChecksum.toLowerCase();
}
