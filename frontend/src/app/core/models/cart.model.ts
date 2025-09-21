export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}
