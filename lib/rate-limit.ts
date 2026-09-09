import { headers } from "next/headers";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// Global in-memory map for rate limiting. 
// NOTE: In Vercel serverless functions, this state might be reset on cold starts
// or not shared across multiple edge instances. For strict production rate-limiting, 
// a Redis store (e.g. Upstash) is highly recommended.
const rateLimitMap = new Map<string, RateLimitRecord>();

export async function checkRateLimit(actionName: string, limit: number, windowMs: number) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";
  
  const key = `${actionName}:${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, resetInSeconds: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count += 1;
  return { success: true };
}

export async function clearRateLimit(actionName: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";
  const key = `${actionName}:${ip}`;
  rateLimitMap.delete(key);
}
