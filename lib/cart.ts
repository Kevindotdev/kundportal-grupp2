export const CART_STORAGE_KEY = 'webshop-cart';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  stock?: number;
  thumbnail: string;
  quantity: number;
};

export function parseCart(value: string): CartItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Saved cart data must be a list.');
  }

  return parsed.map((item: unknown) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('id' in item) ||
      !('title' in item) ||
      !('price' in item) ||
      !('thumbnail' in item) ||
      !('quantity' in item) ||
      typeof item.id !== 'number' ||
      !Number.isSafeInteger(item.id) ||
      typeof item.title !== 'string' ||
      typeof item.price !== 'number' ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      ('discountPercentage' in item && (
        typeof item.discountPercentage !== 'number' ||
        !Number.isFinite(item.discountPercentage) ||
        item.discountPercentage < 0 ||
        item.discountPercentage > 100
      )) ||
      ('stock' in item && (
        typeof item.stock !== 'number' ||
        !Number.isSafeInteger(item.stock) ||
        item.stock < 0
      )) ||
      typeof item.thumbnail !== 'string' ||
      typeof item.quantity !== 'number' ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new Error('Saved cart contains invalid product data.');
    }

    return {
      id: item.id,
      title: item.title,
      price: item.price,
      ...('discountPercentage' in item ? { discountPercentage: item.discountPercentage as number } : {}),
      ...('stock' in item ? { stock: item.stock as number } : {}),
      thumbnail: item.thumbnail,
      quantity: item.quantity,
    };
  });
}
