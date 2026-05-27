const { createRedisClient } = require('./redisClient');

const CHANNEL = 'orders';

function createOrderEvent() {
  /**
   * TODO 1.
   * 아래 주문 이벤트 객체를 완성하시오.
   *
   * 조건:
   * - orderId: 주문번호
   * - productName: 상품명
   * - quantity: 수량
   * - orderedAt: 주문시각
   *
   * orderedAt은 new Date().toISOString()을 사용하면 된다.
   */
  const orderEvent = {
    orderId: 'ORD-001',
    productName: 'keyboard',
    quantity: 2,
    orderedAt: new Date().toISOString(),
  };

  return orderEvent;
}

async function main() {
  const publisher = await createRedisClient('publisher');

  const orderEvent = createOrderEvent();

  /**
   * TODO 2.
   * orderEvent 객체를 JSON 문자열로 변환하시오.
   *
   * 힌트:
   * JSON.stringify(...)
   */
  const message = JSON.stringify(orderEvent);

  /**
   * TODO 3.
   * Redis의 orders channel로 메시지를 publish하시오.
   *
   * 힌트:
   * await publisher.publish(CHANNEL, message)
   *
   * publish 결과로 반환되는 숫자는
   * 이 메시지를 받은 subscriber 수이다.
   */
  const subscriberCount = await publisher.publish(CHANNEL, message);

  /**
   * TODO 4.
   * 발행한 주문 이벤트와 subscriber 수를 출력하시오.
   */
  console.log('[주문 Publisher] 주문 이벤트 발행 완료');
  console.log('[주문 Publisher] channel:', CHANNEL);
  console.log('[주문 Publisher] message:', message);
  console.log('[주문 Publisher] 메시지를 받은 subscriber 수:', subscriberCount);

  await publisher.quit();
}

main().catch((err) => {
  console.error('[주문 Publisher] 실행 실패:', err);
  process.exit(1);
});
