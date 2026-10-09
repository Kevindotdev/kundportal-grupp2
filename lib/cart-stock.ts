export type CartStockError = 'out-of-stock' | 'stock-limit' | 'stock-unavailable';

export function isCartStockError(result: string): result is CartStockError {
  return result === 'out-of-stock' || result === 'stock-limit' || result === 'stock-unavailable';
}

export function checkCartStock(stock: number | undefined, quantity: number, currentQuantity = 0): CartStockError | null {
  if (stock === undefined) return quantity > currentQuantity ? 'stock-unavailable' : null;
  if (!Number.isSafeInteger(stock) || stock < 0) return 'stock-unavailable';
  if (stock === 0 && quantity > 0) return 'out-of-stock';
  if (quantity > stock) return 'stock-limit';
  return null;
}

export function cartStockMessage(error: CartStockError, stock?: number): string {
  if (error === 'out-of-stock') return 'Out of stock.';
  if (error === 'stock-unavailable') return 'Stock information is unavailable.';
  return stock === undefined ? 'Maximum stock limit reached.' : `Maximum available: ${stock}.`;
}
