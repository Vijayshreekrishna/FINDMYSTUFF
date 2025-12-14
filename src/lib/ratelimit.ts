import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (url && token) {
    redis = new Redis({ url, token });
} else {
    console.warn("UPSTASH credentials missing. Rate limiting disabled.");
}

// Dummy limiter if Redis is missing
const dummyLimiter = {
    limit: async () => ({ success: true, limit: 10, remaining: 10, reset: 0 }),
};

export const ratelimit = redis ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
}) : dummyLimiter;

export const claimRateLimit = redis ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(50, "1 d"), // Increased to 50 claims per day for testing
    analytics: true,
    prefix: "ratelimit:claims",
}) : dummyLimiter;
