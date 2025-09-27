export interface OrderItemDto {
  productId: number;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  items: OrderItemDto[];
  paymentId: number | null;
}

export interface CreateOrderRequest {
  // TODO:adding shipping address, etc..
}

export interface UpdateOrderStatus {
  status: string,
  orderId: number,
  updatedBy: string,
  notes?: string
}
