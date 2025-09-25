import { createAction, props } from "@ngrx/store";
import { CreateProductRequest, ProductDto, UpdateProductRequest } from "../../core/models/product.model";

// load
export const loadProducts = createAction('[Product page] load products');
export const loadProductsSuccess = createAction('[Product page] load products success', props<{ response: ProductDto[] }>());
export const loadProductsFailure = createAction('[Product page] load products Failure', props<{ error: string }>());

// load by id
export const loadProductById = createAction('[Product page] load product by id', props<{ productId: number }>());
export const loadProductByIdSuccess = createAction('[Product page] load product by id success', props<{ response: ProductDto }>());
export const loadProductByIdFailure = createAction('[Product page] load product by id Failure', props<{ error: string }>());

// update
export const updateProduct = createAction('[Product page] update product', props<{ productId: number, request: UpdateProductRequest }>());
export const updateProductSuccess = createAction('[Product page] update product success', props<{ response: ProductDto }>());
export const updateProductFailure = createAction('[Product page] update product Failure', props<{ error: string }>());

// remove
export const removeProduct = createAction('[Product page] remove product', props<{ productId: number }>());
export const removeProductSuccess = createAction('[Product page] remove product success');
export const removeProductFailure = createAction('[Product page] remove product Failure', props<{ error: string }>());

// create
export const createProduct = createAction('[Product page] create product', props<{ request: CreateProductRequest }>());
export const createProductSuccess = createAction('[Product page] create product success', props<{ response: ProductDto }>());
export const createProductFailure = createAction('[Product page] create product Failure', props<{ error: string }>());
