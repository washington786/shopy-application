import { createReducer, on } from "@ngrx/store";
import { ProductDto } from "../../core/models/product.model";
import { createProduct, createProductFailure, createProductSuccess, loadProductById, loadProductByIdFailure, loadProductByIdSuccess, loadProducts, loadProductsFailure, loadProductsSuccess, removeProduct, removeProductFailure, removeProductSuccess, updateProduct, updateProductFailure, updateProductSuccess } from "../actions/product-actions";

export const productsKey: string = "products";

export interface ProductState {
  products: ProductDto[],
  currentProduct: ProductDto | null,
  error: string | null,
  loading: boolean
}

const initialState: ProductState = {
  currentProduct: null,
  error: null,
  products: [],
  loading: false
}

export const productsReducer = createReducer(initialState,
  // create
  on(createProduct, (state) => ({ ...state, loading: true, error: null })),
  on(createProductFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(createProductSuccess, (state, { response }) => ({ ...state, loading: false, error: null, products: [...state.products, response] })),

  // load
  on(loadProducts, (state) => ({ ...state, loading: true, error: null })),
  on(loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(loadProductsSuccess, (state, { response }) => ({ ...state, loading: false, error: null, products: response })),

  // load by id
  on(loadProductById, (state) => ({ ...state, loading: true, error: null })),
  on(loadProductByIdFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(loadProductByIdSuccess, (state, { response }) => ({
    ...state, loading: false,
    error: null,
    products: state.products.map(p => p.id == response.id ? response : p),
    currentProduct: state.currentProduct?.id == response.id ? response : state.currentProduct
  })),

  // update
  on(updateProduct, (state) => ({ ...state, loading: true, error: null })),
  on(updateProductFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(updateProductSuccess, (state, { response }) => ({ ...state, loading: false, error: null, products: [...state.products, response] })),

  // remove
  on(removeProduct, (state) => ({ ...state, loading: true, error: null })),
  on(removeProductFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(removeProductSuccess, (state) => ({ ...state, loading: false, error: null })),
);
