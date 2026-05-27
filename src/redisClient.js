const { createClient } = require('redis');

/**
 * Redis client를 생성하고 연결하는 함수
 *
 * 기본 Redis 주소:
 * redis://localhost:6379
 *
 * 필요하면 환경변수 REDIS_URL로 변경할 수 있다.
 * 예:
 * REDIS_URL=redis://localhost:6379 npm run test:redis
 */
async function createRedisClient(clientName) {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  const client = createClient({
    url: redisUrl,
  });

  client.on('error', (err) => {
    console.error(`[${clientName}] Redis Client Error:`, err.message);
  });

  await client.connect();
  console.log(`[${clientName}] Redis 연결 성공: ${redisUrl}`);

  return client;
}

async function closeRedisClient(client) {
  if (!client) {
    return;
  }

  if (typeof client.close === 'function') {
    await client.close();
    return;
  }

  if (typeof client.quit === 'function') {
    await client.quit();
    return;
  }

  if (typeof client.destroy === 'function') {
    client.destroy();
  }
}

module.exports = {
  closeRedisClient,
  createRedisClient,
};
