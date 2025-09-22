import { createReducer, on } from "@ngrx/store";
import { OrderDto } from "../../core/models/order.model";
import { addOrderAction, AddOrderFailure, AddOrderSuccess, loadOrderByidAction, loadOrderByidFailure, loadOrderByidSuccess, loadOrdersAction, loadOrdersFailure, loadOrdersSuccess, updateOrderAction, updateOrderFailure, updateOrderSuccess } from "../actions/order-actions";

export const orderKey: string = 'Orders';

export interface OrderState {
  loading: boolean;
  error: string | null;
  items: OrderDto[],
  currentOrder: OrderDto | null
}

const initialState: OrderState = {
  error: null,
  items: [],
  loading: false,
  currentOrder: null
}

export const orderReducer = createReducer(initialState,
  // load
  on(loadOrdersAction, (state) => ({ ...state, loading: true, error: null })),
  on(loadOrdersFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(loadOrdersSuccess, (state, { response }) => ({ ...state, loading: false, error: null, items: response })),

  // load by id
  on(loadOrderByidAction, (state) => ({ ...state, loading: true, error: null })),
  on(loadOrderByidFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(loadOrderByidSuccess, (state, { response }) => ({ ...state, loading: false, error: null, currentOrder: response })),

  // add
  on(addOrderAction, (state) => ({ ...state, loading: true, error: null })),
  on(AddOrderFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(AddOrderSuccess, (state, { response }) => ({ ...state, loading: false, error: null, items: [...state.items, response] })),

  // update
  on(updateOrderAction, (state) => ({ ...state, loading: true, error: null })),
  on(updateOrderFailure, (state, { error }) => ({ ...state, loading: false, error: error })),
  on(updateOrderSuccess, (state, { response }) => ({ ...state, loading: false, error: null, items: state.items.map(e => e.id == response.id ? response : e), currentOrder: state.currentOrder?.id == response.id ? response : state.currentOrder })),
);
