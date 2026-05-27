const { createRedisClient } = require('../../../src/redisClient');
const { parseOrderEvent } = require('../../../src/utils/parseOrderEvent');

const CHANNEL = 'orders';

const stockTable = {
  keyboard: 100,
  mouse: 100,
  monitor: 50,
};

async function main() {
  const subscriber = await createRedisClient('inventory-subscriber-solution');

  console.log('[재고 서비스] orders channel 구독 시작');
  console.log('[재고 서비스] 주문 이벤트를 기다리는 중...');

  await subscriber.subscribe(CHANNEL, (message) => {
    const order = parseOrderEvent(message);
    if (!order) {
      return;
    }

    const productName = order.productName;
    const quantity = order.quantity;

    if (stockTable[productName] === undefined) {
      stockTable[productName] = 100;
    }

    if (stockTable[productName] < quantity) {
      console.warn(
        `[재고 서비스] ${productName} 재고 부족. 현재 재고: ${stockTable[productName]}, 요청 수량: ${quantity}`,
      );
      return;
    }

    stockTable[productName] -= quantity;

    console.log(`[재고 서비스] ${productName} 재고 ${quantity}개 차감`);
    console.log(`[재고 서비스] 현재 ${productName} 재고: ${stockTable[productName]}`);
  });
}

main().catch((err) => {
  console.error('[재고 서비스] 실행 실패:', err);
  process.exit(1);
});
