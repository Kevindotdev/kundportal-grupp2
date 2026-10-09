import type { CartItem } from '@/lib/cart';

const API_URL = 'http://localhost:4000';

type DemoOrderItem = {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  items: DemoOrderItem[];
};

type DemoOrderResponse = {
  order?: DemoOrder;
  error?: string;
  code?: string;
};

export type PlaceDemoOrderResult =
  | { success: true; order: DemoOrder }
  | { success: false; message: string; code?: string; status?: number };

export default class DemoOrderService {
  static async placeOrder(
    idempotencyKey: string,
    items: Pick<CartItem, 'id' | 'quantity'>[]
  ): Promise<PlaceDemoOrderResult> {
    try {
      const response = await fetch(`${API_URL}/demo-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          items: items.map(({ id, quantity }) => ({ productId: id, quantity })),
        }),
      });
      const result = await response.json() as DemoOrderResponse;

      if (!response.ok || !result.order) {
        return {
          success: false,
          message: result.error ?? `The demo order could not be saved (HTTP ${response.status}).`,
          code: result.code,
          status: response.status,
        };
      }

      return { success: true, order: result.order };
    } catch {
      return {
        success: false,
        message: 'Could not connect to the order server. Your cart is still saved; please try again.',
      };
    }
  }
}
