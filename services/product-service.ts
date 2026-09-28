import type { ApiResponse, ApiSuccessResponse, Product, ProductDeleteResponse, ProductsResponse } from '@/app/types';
import { errorResponse } from '@/utils/error-response';

const API_URL = 'http://localhost:4000';
const defaultLimit = '6';

export default class ProductService {
  // GET: Products
  static async getProducts(currentPage: number, categoryParams: string, stockParams: string, queryParams: string): Promise<ApiResponse<ProductsResponse>> {
    try {
      const stockFilters: Record<string, string> = {
        inStock: '10',
        lowStock: '1',
        outofStock: '0',
      };

      const searchParams = new URLSearchParams({
        _page: String(currentPage),
        _limit: defaultLimit,
        _sort: 'id',
        _order: 'desc',
        _expand: 'category',
      });

      if (categoryParams) {
        searchParams.set('categoryId', categoryParams);
      }

      if (stockParams === 'inStock') {
        searchParams.set('stock_gte', stockFilters.inStock);
      } else if (stockParams === 'lowStock') {
        searchParams.set('stock_gte', stockFilters.lowStock);
        searchParams.set('stock_lte', '10');
      } else if (stockParams === 'outofStock') {
        searchParams.set('stock_lte', stockFilters.outofStock);
      }

      if (queryParams) {
        const escapedQuery = queryParams.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchParams.set('title_like', `^${escapedQuery}$`);
      }

      const response = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
        method: 'GET',
      });

      const result = await response.json();

      return {
        success: true,
        data: result,
      } satisfies ApiSuccessResponse<ProductsResponse>;
    } catch (error) {
      return errorResponse('Kunde inte ansluta till servern.');
    }
  }

  //DELETE: Product
  static async deleteProduct(productId: number): Promise<ProductDeleteResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      return {
        success: true,
        message: 'Remove successful product',
      } satisfies ProductDeleteResponse;
    } catch (error) {
      return errorResponse('Kunde inte ansluta till servern.');
    }
  }

    //PATCH/EDIT: Product
  static async updateProduct(productId: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        return errorResponse('Produkten kunde inte uppdateras');
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        message: 'Product updated successfully',
      } satisfies ApiSuccessResponse<Product>;
    } catch {
      return errorResponse('Kunde inte ansluta till servern.');
    }
  }

  //POST/CREATE: Product
  static async createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        return errorResponse('Produkten kunde inte skapas');
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        message: 'Product created successfully',
      } satisfies ApiSuccessResponse<Product>;
    } catch {
      return errorResponse('Kunde inte ansluta till servern.');
    }
  }
}