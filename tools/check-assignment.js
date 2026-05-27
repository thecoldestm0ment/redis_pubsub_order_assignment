const assert = require('node:assert/strict');

const { parseOrderEvent } = require('../src/utils/parseOrderEvent');

function expectNull(input) {
  assert.equal(parseOrderEvent(input), null);
}

const validMessage = JSON.stringify({
  orderId: 'ORD-999',
  productName: 'keyboard',
  quantity: 2,
  orderedAt: '2026-05-28T10:00:00.000Z',
});

assert.deepEqual(parseOrderEvent(validMessage), {
  orderId: 'ORD-999',
  productName: 'keyboard',
  quantity: 2,
  orderedAt: '2026-05-28T10:00:00.000Z',
});

const originalConsoleError = console.error;
console.error = () => {};

try {
  expectNull('not-json');
  expectNull(
    JSON.stringify({
      orderId: '',
      productName: 'keyboard',
      quantity: 2,
      orderedAt: '2026-05-28T10:00:00.000Z',
    }),
  );
  expectNull(
    JSON.stringify({
      orderId: 'ORD-1000',
      productName: 'keyboard',
      quantity: 0,
      orderedAt: '2026-05-28T10:00:00.000Z',
    }),
  );
} finally {
  console.error = originalConsoleError;
}

console.log('Assignment sanity check passed: parseOrderEvent validation works.');
