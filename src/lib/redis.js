const Redis = require('ioredis');

// Connect to your local Redis server. BullMQ requires maxRetriesPerRequest to be null
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

redis.on('connect', () => {
    console.log('⚡ Connected to Redis Cache');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

module.exports = redis;