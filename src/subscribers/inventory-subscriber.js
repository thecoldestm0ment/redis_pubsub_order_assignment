const { closeRedisClient, createRedisClient } = require('../redisClient');
const { parseOrderEvent } = require('../utils/parseOrderEvent');
const { isTodoError, todo } = require('../utils/todo');

const CHANNEL = 'orders';

/**
 * 실제 DB 대신 메모리 객체로 재고를 표현한다.
 * 프로그램을 종료하면 이 값은 사라진다.
 */
const stockTable = {
  keyboard: 100,
  mouse: 100,
  monitor: 50,
};

async function main() {
  const subscriber = await createRedisClient('inventory-subscriber');

  console.log('[재고 서비스] orders channel 구독 시작');
  console.log('[재고 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, async (message) => {
    try {
      const order = parseOrderEvent(message);
      if (!order) {
        return;
      }

      /**
       * TODO 1.
       * 주문 이벤트에서 상품명과 수량을 꺼내시오.
       *
       * 예시:
       * const { productName, quantity } = order;
       */
      const { productName, quantity } = todo(
        1,
        '주문 이벤트에서 productName과 quantity를 꺼내시오.',
      );

      /**
       * TODO 2.
       * stockTable에서 해당 상품의 재고를 quantity만큼 차감하시오.
       *
       * 주의:
       * stockTable에 없는 상품이면 기본 재고를 100으로 설정한 뒤 차감해도 된다.
       */
      todo(2, 'stockTable에서 해당 상품의 재고를 차감하시오.');

      /**
       * TODO 3.
       * 재고 차감 결과를 로그로 출력하시오.
       *
       * 출력 예:
       * [재고 서비스] keyboard 재고 2개 차감
       * [재고 서비스] 현재 keyboard 재고: 98
       */
      todo(3, '재고 차감 결과를 로그로 출력하시오.');
    } catch (err) {
      if (isTodoError(err)) {
        console.error('[재고 서비스] TODO 미완성:', err.message);
        process.exitCode = 1;
        await closeRedisClient(subscriber);
        return;
      }

      console.error('[재고 서비스] 처리 실패:', err.message);
    }
  });
}

main().catch((err) => {
  console.error('[재고 서비스] 실행 실패:', err);
  process.exit(1);
});
