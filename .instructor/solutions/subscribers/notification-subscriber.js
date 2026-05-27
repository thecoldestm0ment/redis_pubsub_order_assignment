const { createRedisClient } = require('../../../src/redisClient');
const { parseOrderEvent } = require('../../../src/utils/parseOrderEvent');

const CHANNEL = 'orders';

async function main() {
  const subscriber = await createRedisClient('notification-subscriber-solution');

  console.log('[알림 서비스] orders channel 구독 시작');
  console.log('[알림 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, (message) => {
    try {
      const order = parseOrderEvent(message);
      if (!order) {
        return;
      }

      const notificationMessage =
        `[알림 서비스] ${order.orderId} 주문이 접수되었습니다. 상품: ${order.productName}`;

      console.log(notificationMessage);
    } catch (err) {
      console.error('[알림 서비스] 처리 실패:', err.message);
      process.exit(1);
    }
  });
}

main().catch((err) => {
  console.error('[알림 서비스] 실행 실패:', err);
  process.exit(1);
});
