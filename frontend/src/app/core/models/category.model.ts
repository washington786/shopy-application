export interface CategoryDto {
  id: number;
  name: string;
  description: string | null;
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: number;
}
