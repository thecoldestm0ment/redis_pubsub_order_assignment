const { createRedisClient } = require('./redisClient');

async function main() {
  const client = await createRedisClient('test');

  await client.set('test:message', 'hello-redis');
  const value = await client.get('test:message');

  console.log('SET/GET 테스트 결과:', value);

  await client.quit();
  console.log('테스트 완료');
}

main().catch((err) => {
  console.error('테스트 실패:', err);
  process.exit(1);
});
