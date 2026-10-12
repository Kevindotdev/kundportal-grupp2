const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

class DemoOrderError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function getRequestedItems(payload) {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.idempotencyKey !== 'string' ||
    payload.idempotencyKey.trim() === '' ||
    payload.idempotencyKey.length > 100 ||
    !Array.isArray(payload.items) ||
    payload.items.length === 0 ||
    payload.items.length > 100
  ) {
    throw new DemoOrderError(400, 'The demo order is invalid.', 'INVALID_ORDER');
  }

  const seenProductIds = new Set();
  return payload.items.map((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !Number.isSafeInteger(item.productId) ||
      item.productId < 1 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      seenProductIds.has(item.productId)
    ) {
      throw new DemoOrderError(400, 'The demo order contains invalid items.', 'INVALID_ORDER');
    }
    seenProductIds.add(item.productId);
    return { productId: item.productId, quantity: item.quantity };
  });
}

function sameItems(first, second) {
  if (first.length !== second.length) return false;
  const normalized = (items) => items
    .map(({ productId, quantity }) => ({ productId, quantity }))
    .sort((a, b) => a.productId - b.productId);
  return JSON.stringify(normalized(first)) === JSON.stringify(normalized(second));
}

function createDemoOrder(db, payload, now = new Date()) {
  const requestedItems = getRequestedItems(payload);
  const state = db.getState();
  const demoOrders = Array.isArray(state.demoOrders) ? state.demoOrders : [];
  const existingOrder = demoOrders.find((order) => order.id === payload.idempotencyKey);

  if (existingOrder) {
    if (!sameItems(existingOrder.items, requestedItems)) {
      throw new DemoOrderError(
        409,
        'This order identifier was already used for a different order.',
        'IDEMPOTENCY_KEY_REUSED'
      );
    }
    return { status: 200, order: existingOrder };
  }

  const products = Array.isArray(state.products) ? state.products : [];
  const orderItems = requestedItems.map(({ productId, quantity }) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      throw new DemoOrderError(404, 'A product in your order could not be found.', 'PRODUCT_NOT_FOUND');
    }
    const stock = product.stock;
    if (!Number.isSafeInteger(stock) || stock < 0 || stock < quantity) {
      throw new DemoOrderError(
        409,
        `${product.title} does not have enough stock for this order.`,
        'INSUFFICIENT_STOCK'
      );
    }

    return {
      productId,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity,
    };
  });

  const order = {
    id: payload.idempotencyKey,
    createdAt: now.toISOString(),
    items: orderItems,
  };
  const requestedQuantities = new Map(
    requestedItems.map(({ productId, quantity }) => [productId, quantity])
  );
  const nextState = {
    ...state,
    products: products.map((product) => (
      requestedQuantities.has(product.id)
        ? { ...product, stock: product.stock - requestedQuantities.get(product.id) }
        : product
    )),
    demoOrders: [...demoOrders, order],
  };

  db.setState(nextState);
  try {
    db.write();
  } catch (error) {
    db.setState(state);
    throw error;
  }

  return { status: 201, order };
}

function getDemoBestSellers(db, now = new Date()) {
  const state = db.getState();
  const products = Array.isArray(state.products) ? state.products : [];
  const demoOrders = Array.isArray(state.demoOrders) ? state.demoOrders : [];
  const nowInMs = now.getTime();
  const cutoff = nowInMs - SEVEN_DAYS_IN_MS;
  const unitsByProduct = new Map();

  for (const order of demoOrders) {
    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt) || createdAt < cutoff || createdAt > nowInMs) continue;
    for (const item of order.items) {
      unitsByProduct.set(
        item.productId,
        (unitsByProduct.get(item.productId) ?? 0) + item.quantity
      );
    }
  }

  return [...unitsByProduct.entries()]
    .map(([productId, unitsSold]) => ({
      product: products.find((product) => product.id === productId),
      unitsSold,
    }))
    .filter((result) => result.product !== undefined)
    .sort((a, b) => b.unitsSold - a.unitsSold || a.product.id - b.product.id);
}

module.exports = { DemoOrderError, createDemoOrder, getDemoBestSellers };
