import Redis from "ioredis";

// Redis client configuration
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("connect", () => {
  console.log("Redis connected");
});

// ============================================
// Rate Limiting
// ============================================

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  totalLimit: number;
}

export async function checkRateLimit(
  key: string,
  limit: number = 100,
  windowSeconds: number = 900 // 15 minutes
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
  const redisKey = `ratelimit:${key}:${windowStart}`;
  
  const pipeline = redis.pipeline();
  pipeline.incr(redisKey);
  pipeline.expire(redisKey, windowSeconds);
  
  const results = await pipeline.exec();
  const current = (results?.[0]?.[1] as number) || 0;
  
  const resetAt = new Date((windowStart + windowSeconds) * 1000);
  const remaining = Math.max(0, limit - current);
  
  return {
    allowed: current <= limit,
    remaining,
    resetAt,
    totalLimit: limit,
  };
}

export async function checkDownloadRateLimit(
  ipHash: string,
  productId?: string
): Promise<RateLimitResult> {
  const key = productId 
    ? `download:${ipHash}:${productId}` 
    : `download:${ipHash}`;
  
  // Stricter limits for downloads: 10 per hour per product, 50 per hour total
  const limit = productId ? 10 : 50;
  const windowSeconds = 3600; // 1 hour
  
  return checkRateLimit(key, limit, windowSeconds);
}

// ============================================
// Caching
// ============================================

export async function getCache<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  
  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, serialized);
  } else {
    await redis.set(key, serialized);
  }
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// ============================================
// Session Store (alternative to DB sessions)
// ============================================

export async function storeSession(
  sessionId: string,
  data: Record<string, any>,
  ttlSeconds: number = 86400 // 24 hours
): Promise<void> {
  await redis.setex(
    `session:${sessionId}`,
    ttlSeconds,
    JSON.stringify(data)
  );
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  const data = await redis.get(`session:${sessionId}`);
  if (!data) return null;
  return JSON.parse(data) as T;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}

// ============================================
// Download Token Management
// ============================================

export async function createDownloadToken(
  token: string,
  data: {
    productId: string;
    releaseId: string;
    ipHash: string;
  },
  expirySeconds: number = 1800 // 30 minutes
): Promise<void> {
  await redis.setex(
    `dl_token:${token}`,
    expirySeconds,
    JSON.stringify(data)
  );
}

export async function validateDownloadToken(
  token: string
): Promise<{ productId: string; releaseId: string; ipHash: string } | null> {
  const data = await redis.get(`dl_token:${token}`);
  if (!data) return null;
  
  // Delete token after use (one-time use)
  await redis.del(`dl_token:${token}`);
  
  return JSON.parse(data);
}

// ============================================
// CAPTCHA Verification Cache
// ============================================

export async function storeCaptchaToken(
  token: string,
  verified: boolean = true,
  ttlSeconds: number = 300 // 5 minutes
): Promise<void> {
  await redis.setex(`captcha:${token}`, ttlSeconds, verified ? "1" : "0");
}

export async function isCaptchaVerified(token: string): Promise<boolean> {
  const result = await redis.get(`captcha:${token}`);
  return result === "1";
}

// ============================================
// Statistics & Analytics
// ============================================

export async function incrementDownloadCounter(
  productId: string,
  releaseId: string
): Promise<void> {
  const now = new Date();
  const day = now.toISOString().split("T")[0];
  const hour = `${day}:${now.getHours()}`;
  
  const pipeline = redis.pipeline();
  
  // Daily counter
  pipeline.hincrby(`stats:downloads:daily:${day}`, productId, 1);
  pipeline.expire(`stats:downloads:daily:${day}`, 86400 * 30); // Keep 30 days
  
  // Hourly counter
  pipeline.hincrby(`stats:downloads:hourly:${hour}`, productId, 1);
  pipeline.expire(`stats:downloads:hourly:${hour}`, 3600 * 24); // Keep 24 hours
  
  // Total counter
  pipeline.incr(`stats:downloads:total:${productId}`);
  pipeline.incr(`stats:downloads:release:${releaseId}`);
  
  await pipeline.exec();
}

export async function getDownloadStats(
  productId: string,
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const stats: { date: string; count: number }[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toISOString().split("T")[0];
    
    const count = await redis.hget(`stats:downloads:daily:${day}`, productId);
    stats.push({
      date: day,
      count: parseInt(count || "0"),
    });
  }
  
  return stats.reverse();
}

// ============================================
// Health Check
// ============================================

export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Graceful Shutdown
// ============================================

export async function closeRedis(): Promise<void> {
  await redis.quit();
}

export { redis };
