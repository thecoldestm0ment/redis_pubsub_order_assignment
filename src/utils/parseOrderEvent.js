/**
 * Redis Pub/Sub으로 받은 문자열 메시지를 주문 이벤트 객체로 변환한다.
 * 잘못된 JSON이 들어오면 null을 반환한다.
 */
function parseOrderEvent(message) {
  try {
    const order = JSON.parse(message);

    if (!order.orderId || !order.productName || typeof order.quantity !== 'number') {
      console.error('[parseOrderEvent] 주문 이벤트 형식이 올바르지 않습니다:', order);
      return null;
    }

    return order;
  } catch (err) {
    console.error('[parseOrderEvent] JSON 파싱 실패:', message);
    return null;
  }
}

module.exports = {
  parseOrderEvent,
};
