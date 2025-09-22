import { createAction, props } from "@ngrx/store";
import { AddToCartRequest, CartItemDto, UpdateCartRequest } from "../../core/models/cart.model";

// Load
export const loadCartAction = createAction("[Cart Page] Load")
export const loadCartSuccess = createAction("[Cart Page] Load Success", props<{ response: CartItemDto[] }>())
export const loadCartFailure = createAction("[Cart Page] Load Failure", props<{ error: string }>())

// Add
export const addToCartAction = createAction("[Cart Page] ADD", props<{ payload: AddToCartRequest }>())
export const addToCartSuccess = createAction("[Cart Page] ADD Success", props<{ response: CartItemDto }>())
export const addToCartFailure = createAction("[Cart Page] ADD Failure", props<{ error: string }>())

// remove cart item
export const removeItemCartAction = createAction("[Cart Page] Remove", props<{ cartItemId: number }>())
export const removeItemCartSuccess = createAction("[Cart Page] Remove Success")
export const removeItemCartFailure = createAction("[Cart Page] Remove Failure", props<{ error: string }>())

// Update
export const updateItemCartAction = createAction("[Cart Page] Update", props<{ payload: UpdateCartRequest }>())
export const updateItemCartSuccess = createAction("[Cart Page] Update Success", props<{ response: CartItemDto }>())
export const updateItemCartFailure = createAction("[Cart Page] Update Failure", props<{ error: string }>())

// Clear
export const clearCartAction = createAction("[Cart Page] Clear")
export const clearCartSuccess = createAction("[Cart Page] Clear Success")
export const clearCartFailure = createAction("[Cart Page] Clear Failure", props<{ error: string }>())
