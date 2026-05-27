const { createRedisClient } = require('../redisClient');
const { parseOrderEvent } = require('../utils/parseOrderEvent');
const { todo } = require('../utils/todo');

const CHANNEL = 'orders';

async function main() {
  const subscriber = await createRedisClient('notification-subscriber');

  console.log('[알림 서비스] orders channel 구독 시작');
  console.log('[알림 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, (message) => {
    const order = parseOrderEvent(message);
    if (!order) {
      return;
    }

    /**
     * TODO 1.
     * 주문번호와 상품명을 사용해 고객 알림 메시지를 만드시오.
     *
     * 출력 예:
     * [알림 서비스] ORD-001 주문이 접수되었습니다. 상품: keyboard
     */
    const notificationMessage = todo(1, '주문번호와 상품명을 사용해 고객 알림 메시지를 만드시오.');

    /**
     * TODO 2.
     * 알림 메시지를 출력하시오.
     */
    todo(2, '알림 메시지를 출력하시오.');
  });
}

main().catch((err) => {
  console.error('[알림 서비스] 실행 실패:', err);
  process.exit(1);
});
