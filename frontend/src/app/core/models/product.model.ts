export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  ImageUrls?: string[];
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
  ImageUrls?: string[];
  categoryId: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}
