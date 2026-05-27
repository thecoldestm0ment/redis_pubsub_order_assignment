const { createRedisClient } = require('../redisClient');
const { parseOrderEvent } = require('../utils/parseOrderEvent');

const CHANNEL = 'orders';

/**
 * 실제 DB 대신 메모리 배열로 배송 대기 목록을 표현한다.
 * 프로그램을 종료하면 이 값은 사라진다.
 */
const deliveryQueue = [];

async function main() {
  const subscriber = await createRedisClient('delivery-subscriber');

  console.log('[배송 서비스] orders channel 구독 시작');
  console.log('[배송 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, (message) => {
    const order = parseOrderEvent(message);
    if (!order) {
      return;
    }

    /**
     * TODO 1.
     * deliveryQueue에 주문 정보를 추가하시오.
     *
     * 힌트:
     * deliveryQueue.push(...)
     */
    deliveryQueue.push({
      orderId: order.orderId,
      productName: order.productName,
      quantity: order.quantity,
      status: 'READY',
      receivedAt: new Date().toISOString(),
    });

    /**
     * TODO 2.
     * 배송 등록 완료 로그를 출력하시오.
     *
     * 출력 예:
     * [배송 서비스] ORD-001 배송 등록 완료
     */
    console.log(`[배송 서비스] ${order.orderId} 배송 등록 완료`);

    /**
     * TODO 3.
     * 현재 배송 대기 수를 출력하시오.
     *
     * 출력 예:
     * [배송 서비스] 배송 대기 수: 1
     */
    console.log(`[배송 서비스] 배송 대기 수: ${deliveryQueue.length}`);
  });
}

main().catch((err) => {
  console.error('[배송 서비스] 실행 실패:', err);
  process.exit(1);
});
