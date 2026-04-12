import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

function createRedis() {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }
  return new Redis(url, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
  });
}

export const redis = globalForRedis.redis ?? createRedis();

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis;
}
