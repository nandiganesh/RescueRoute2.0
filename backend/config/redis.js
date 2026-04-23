/**
 * Redis Config
 * In demo mode (no REDIS_URL), uses an in-memory mock.
 * In production, connects to Upstash Redis.
 */

const DEMO_MODE = !process.env.REDIS_URL;

if (DEMO_MODE) {
  console.log('⚠️  DEMO MODE: Using in-memory Redis mock (no Redis server)');

  // Simple in-memory key-value store that mimics Redis commands
  const store = new Map();
  const expiries = new Map();

  const mockRedis = {
    get: async (key) => store.get(key) || null,
    set: async (key, value) => { store.set(key, value); return 'OK'; },
    setnx: async (key, value) => {
      if (store.has(key)) return 0;
      store.set(key, value);
      return 1;
    },
    del: async (key) => { store.delete(key); expiries.delete(key); return 1; },
    expire: async (key, seconds) => {
      if (expiries.has(key)) clearTimeout(expiries.get(key));
      expiries.set(key, setTimeout(() => { store.delete(key); expiries.delete(key); }, seconds * 1000));
      return 1;
    },
    on: (event, cb) => {
      if (event === 'connect') setTimeout(cb, 0);
      // silently ignore other events
    },
    // BullMQ compatibility stubs
    duplicate: function() { return { ...mockRedis, duplicate: mockRedis.duplicate }; },
    status: 'ready',
    options: { maxRetriesPerRequest: null },
  };

  module.exports = mockRedis;
} else {
  const Redis = require('ioredis');
  const redisClient = new Redis(process.env.REDIS_URL);

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));

  module.exports = redisClient;
}
