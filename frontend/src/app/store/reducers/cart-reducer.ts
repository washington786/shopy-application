import { createReducer, on } from "@ngrx/store";
import { CartItemDto } from "../../core/models/cart.model";
import { addToCartAction, addToCartFailure, addToCartSuccess, clearCartAction, clearCartFailure, clearCartSuccess, loadCartAction, loadCartFailure, loadCartSuccess, removeItemCartAction, removeItemCartFailure, removeItemCartSuccess, updateItemCartAction, updateItemCartFailure, updateItemCartSuccess } from "../actions/cart-actions";

export const cartKey: string = 'cart';

export interface CartState {
  loading: boolean;
  error: string | null;
  cartItems: CartItemDto[],
}

const initialState: CartState = {
  cartItems: [],
  error: null,
  loading: false
}

export const cartReducer = createReducer(initialState,
  // load
  on(loadCartAction, (state) => ({ ...state, loading: true, error: null })),
  on(loadCartFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(loadCartSuccess, (state, { response }) => ({ ...state, loading: false, error: null, cartItems: response })),

  // add
  on(addToCartAction, (state) => ({ ...state, loading: true, error: null })),
  on(addToCartFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(addToCartSuccess, (state, { response }) => ({ ...state, loading: false, error: null, cartItems: [...state.cartItems, response] })),

  // update
  on(updateItemCartAction, (state) => ({ ...state, loading: true, error: null })),
  on(updateItemCartFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(updateItemCartSuccess, (state, { response }) => ({ ...state, loading: false, error: null, cartItems: [...state.cartItems, response] })),

  // clear
  on(clearCartAction, (state) => ({ ...state, loading: true, error: null })),
  on(clearCartFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(clearCartSuccess, (state) => ({ ...state, loading: false, error: null, cartItems: [] })),

  // remove
  on(removeItemCartAction, (state) => ({ ...state, loading: true, error: null })),
  on(removeItemCartFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(removeItemCartSuccess, (state) => ({ ...state, loading: false, error: null, cartItems: state.cartItems })),
);
