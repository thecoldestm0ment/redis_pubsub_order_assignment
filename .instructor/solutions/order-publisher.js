const { createRedisClient } = require('../../src/redisClient');

const CHANNEL = 'orders';
const SAMPLE_PRODUCTS = [
  { productName: 'keyboard', quantity: 2 },
  { productName: 'mouse', quantity: 1 },
  { productName: 'monitor', quantity: 1 },
];

function createOrderEvent() {
  const selectedProduct =
    SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];

  return {
    orderId: `ORD-${Date.now()}`,
    productName: selectedProduct.productName,
    quantity: selectedProduct.quantity,
    orderedAt: new Date().toISOString(),
  };
}

async function main() {
  const publisher = await createRedisClient('publisher-solution');

  try {
    const orderEvent = createOrderEvent();
    const message = JSON.stringify(orderEvent);
    const subscriberCount = await publisher.publish(CHANNEL, message);

    console.log('[주문 Publisher] 주문 이벤트 발행 완료');
    console.log('[주문 Publisher] channel:', CHANNEL);
    console.log('[주문 Publisher] message:', message);
    console.log('[주문 Publisher] 메시지를 받은 subscriber 수:', subscriberCount);
  } finally {
    await publisher.quit();
  }
}

main().catch((err) => {
  console.error('[주문 Publisher] 실행 실패:', err);
  process.exit(1);
});
