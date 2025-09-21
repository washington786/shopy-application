export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  productImageUrl: string | null;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  productImageUrl?: string;
  categoryId: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}
