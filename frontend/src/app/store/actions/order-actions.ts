import { createAction, props } from "@ngrx/store";
import { CreateOrderRequest, OrderDto, OrderItemDto, UpdateOrderStatus } from "../../core/models/order.model";

// add
export const addOrderAction = createAction("[Order Page] add order", props<{ request: CreateOrderRequest }>());
export const AddOrderSuccess = createAction("[Order Page] add order success", props<{ response: OrderDto }>());
export const AddOrderFailure = createAction("[Order Page] add order failure", props<{ error: string }>());

// load
export const loadOrdersAction = createAction("[Order Page] load order");
export const loadOrdersSuccess = createAction("[Order Page] load order success", props<{ response: OrderDto[] }>());
export const loadOrdersFailure = createAction("[Order Page] load order failure", props<{ error: string }>());

// load by id
export const loadOrderByidAction = createAction("[Order Page] load order by", props<{ orderId: number }>());
export const loadOrderByidSuccess = createAction("[Order Page] load order by id success", props<{ response: OrderDto }>());
export const loadOrderByidFailure = createAction("[Order Page] load order by id failure", props<{ error: string }>());

// update status
export const updateOrderAction = createAction("[Order Page] update order", props<{ request: UpdateOrderStatus }>());
export const updateOrderSuccess = createAction("[Order Page] update order success", props<{ response: OrderDto }>());
export const updateOrderFailure = createAction("[Order Page] update order failure", props<{ error: string }>());
