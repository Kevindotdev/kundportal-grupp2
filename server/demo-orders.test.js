/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const jsonServer = require('json-server');
const { DemoOrderError, createDemoOrder, getDemoBestSellers } = require('./demo-orders');
const middleware = require('./middleware');

function createDatabase(state, shouldFailWrite = false) {
  let currentState = structuredClone(state);
  return {
    getState: () => currentState,
    setState: (nextState) => {
      currentState = nextState;
      return currentState;
    },
    write: () => {
      if (shouldFailWrite) throw new Error('Disk write failed.');
    },
  };
}

function fixture() {
  return {
    products: [
      { id: 1, title: 'First product', price: 10, thumbnail: '/first.png', stock: 3 },
      { id: 2, title: 'Second product', price: 20, thumbnail: '/second.png', stock: 8 },
    ],
    categories: [],
  };
}

test('records a demo order and decrements stock in the same write', () => {
  const db = createDatabase(fixture());
  const result = createDemoOrder(db, {
    idempotencyKey: 'order-1',
    items: [{ productId: 1, quantity: 2 }],
  }, new Date('2026-10-08T12:00:00.000Z'));

  assert.equal(result.status, 201);
  assert.equal(result.order.createdAt, '2026-10-08T12:00:00.000Z');
  assert.deepEqual(result.order.items, [{
    productId: 1,
    title: 'First product',
    price: 10,
    thumbnail: '/first.png',
    quantity: 2,
  }]);
  assert.equal(db.getState().products[0].stock, 1);
  assert.equal(db.getState().demoOrders.length, 1);
});

test('rejects the full order without changing state when stock is insufficient', () => {
  const initialState = fixture();
  const db = createDatabase(initialState);

  assert.throws(
    () => createDemoOrder(db, {
      idempotencyKey: 'order-short',
      items: [
        { productId: 2, quantity: 2 },
        { productId: 1, quantity: 4 },
      ],
    }),
    (error) => error instanceof DemoOrderError && error.code === 'INSUFFICIENT_STOCK'
  );
  assert.deepEqual(db.getState(), initialState);
});

test('returns a repeated order without decrementing stock twice', () => {
  const db = createDatabase(fixture());
  const payload = { idempotencyKey: 'order-retry', items: [{ productId: 1, quantity: 2 }] };
  const firstResult = createDemoOrder(db, payload);
  const retryResult = createDemoOrder(db, payload);

  assert.equal(firstResult.status, 201);
  assert.equal(retryResult.status, 200);
  assert.deepEqual(retryResult.order, firstResult.order);
  assert.equal(db.getState().products[0].stock, 1);
  assert.equal(db.getState().demoOrders.length, 1);
});

test('rejects reusing an idempotency key for different items', () => {
  const db = createDatabase(fixture());
  createDemoOrder(db, { idempotencyKey: 'same-key', items: [{ productId: 1, quantity: 1 }] });

  assert.throws(
    () => createDemoOrder(db, {
      idempotencyKey: 'same-key',
      items: [{ productId: 1, quantity: 2 }],
    }),
    (error) => error instanceof DemoOrderError && error.code === 'IDEMPOTENCY_KEY_REUSED'
  );
  assert.equal(db.getState().products[0].stock, 2);
  assert.equal(db.getState().demoOrders.length, 1);
});

test('rolls back the in-memory state if persisting the order fails', () => {
  const initialState = fixture();
  const db = createDatabase(initialState, true);

  assert.throws(() => createDemoOrder(db, {
    idempotencyKey: 'failed-write',
    items: [{ productId: 1, quantity: 1 }],
  }));
  assert.deepEqual(db.getState(), initialState);
});

test('ranks demo units sold in the previous seven rolling days only', () => {
  const now = new Date('2026-10-08T12:00:00.000Z');
  const state = fixture();
  state.demoOrders = [
    { createdAt: '2026-10-07T12:00:00.000Z', items: [{ productId: 1, quantity: 3 }] },
    { createdAt: '2026-10-06T12:00:00.000Z', items: [{ productId: 2, quantity: 5 }] },
    { createdAt: '2026-10-01T11:59:59.999Z', items: [{ productId: 2, quantity: 20 }] },
    { createdAt: '2026-10-08T12:00:00.001Z', items: [{ productId: 2, quantity: 30 }] },
  ];

  assert.deepEqual(getDemoBestSellers(createDatabase(state), now), [
    { product: state.products[1], unitsSold: 5 },
    { product: state.products[0], unitsSold: 3 },
  ]);
});

test('does not oversell when concurrent orders race for the final units', async () => {
  const db = createDatabase(fixture());
  db.getState().products[0].stock = 1;

  const results = await Promise.allSettled([
    Promise.resolve().then(() => createDemoOrder(db, {
      idempotencyKey: 'race-1',
      items: [{ productId: 1, quantity: 1 }],
    })),
    Promise.resolve().then(() => createDemoOrder(db, {
      idempotencyKey: 'race-2',
      items: [{ productId: 1, quantity: 1 }],
    })),
  ]);

  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter((result) => (
    result.status === 'rejected' &&
    result.reason instanceof DemoOrderError &&
    result.reason.code === 'INSUFFICIENT_STOCK'
  )).length, 1);
  assert.equal(db.getState().products[0].stock, 0);
  assert.equal(db.getState().demoOrders.length, 1);
});

test('serves demo order creation and rankings through the mock API middleware', async (t) => {
  const databasePath = path.join(os.tmpdir(), `demo-orders-${randomUUID()}.json`);
  fs.writeFileSync(databasePath, JSON.stringify(fixture()));
  const router = jsonServer.router(databasePath);
  const app = jsonServer.create();
  app.db = router.db;
  app.use(jsonServer.bodyParser);
  app.use(middleware);
  app.use(router);
  const server = app.listen(0);
  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    fs.unlinkSync(databasePath);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const createResponse = await fetch(`${baseUrl}/demo-orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idempotencyKey: 'http-order',
      items: [{ productId: 1, quantity: 2 }],
    }),
  });
  const created = await createResponse.json();
  assert.equal(createResponse.status, 201);
  assert.equal(created.order.id, 'http-order');

  const rankingsResponse = await fetch(`${baseUrl}/demo-orders/best-sellers`);
  const rankings = await rankingsResponse.json();
  assert.equal(rankingsResponse.status, 200);
  assert.deepEqual(rankings.rankings.map((entry) => ({
    productId: entry.product.id,
    unitsSold: entry.unitsSold,
  })), [{ productId: 1, unitsSold: 2 }]);

  const savedState = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
  assert.equal(savedState.products[0].stock, 1);
  assert.equal(savedState.demoOrders.length, 1);

  const unrelatedPostResponse = await fetch(`${baseUrl}/unrelated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const unrelatedPost = await unrelatedPostResponse.json();
  assert.notEqual(unrelatedPostResponse.status, 400);
  assert.doesNotMatch(JSON.stringify(unrelatedPost), /Missing required fields/);
});
