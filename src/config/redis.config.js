// src/config/redis.config.js
const { Queue, Worker, QueueScheduler } = require('bullmq');
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = { Queue, Worker, QueueScheduler, redisClient };
