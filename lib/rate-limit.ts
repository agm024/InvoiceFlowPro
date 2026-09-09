import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create a new ratelimiter, that allows 5 requests per 5 minutes by default
// Fallback to memory if Redis env vars are missing
let redisClient: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = Redis.fromEnv();
}

// In-memory fallback just in case
type RateLimitRecord = { count: number; resetAt: number; };
const fallbackCache = new Map<string, RateLimitRecord>();

export async function checkRateLimit(actionName: string, maxRequests: number = 5, windowMs: number = 300000) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const identifier = `${actionName}:${ip}`;

  if (redisClient) {
    // Math.floor(windowMs/1000) for seconds
    const windowSeconds = Math.floor(windowMs / 1000);
    const ratelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    });
    
    const { success, reset } = await ratelimit.limit(identifier);
    return {
      success,
      resetInSeconds: Math.ceil((reset - Date.now()) / 1000)
    };
  }

  // Fallback memory rate limiter
  const now = Date.now();
  let record = fallbackCache.get(identifier);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count += 1;
  fallbackCache.set(identifier, record);

  const success = record.count <= maxRequests;
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);

  return { success, resetInSeconds };
}

export async function clearRateLimit(actionName: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const identifier = `${actionName}:${ip}`;
  
  if (redisClient) {
    // Ratelimit doesn't have an easy reset per key without dropping standard Redis keys, 
    // so we just pass for now or could delete the key via Redis client.
    // We are no longer clearing on failure anyway.
    return;
  }
  fallbackCache.delete(identifier);
}
