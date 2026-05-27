const { createRedisClient } = require('../../../src/redisClient');
const { parseOrderEvent } = require('../../../src/utils/parseOrderEvent');

const CHANNEL = 'orders';

const deliveryQueue = [];

async function main() {
  const subscriber = await createRedisClient('delivery-subscriber-solution');

  console.log('[배송 서비스] orders channel 구독 시작');
  console.log('[배송 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, (message) => {
    try {
      const order = parseOrderEvent(message);
      if (!order) {
        return;
      }

      deliveryQueue.push({
        orderId: order.orderId,
        productName: order.productName,
        quantity: order.quantity,
        status: 'READY',
        receivedAt: new Date().toISOString(),
      });

      console.log(`[배송 서비스] ${order.orderId} 배송 등록 완료`);
      console.log(`[배송 서비스] 배송 대기 수: ${deliveryQueue.length}`);
    } catch (err) {
      console.error('[배송 서비스] 처리 실패:', err.message);
    }
  });
}

main().catch((err) => {
  console.error('[배송 서비스] 실행 실패:', err);
  process.exit(1);
});
