import { createFeatureSelector, createSelector } from "@ngrx/store";
import { orderKey, OrderState } from "../reducers/order-reducer";


export const selectOrderFeature = createFeatureSelector<OrderState>(orderKey);

export const selectOrderItems = createSelector(selectOrderFeature, (state) => state.items);
export const selectCurrentOrderItem = createSelector(selectOrderFeature, (state) => state.currentOrder);
export const selectOrderItemById = (orderId: number) => createSelector(selectOrderFeature, (state) => state.items.find(i => i.id === orderId));
export const selectOrderLoading = createSelector(selectOrderFeature, (state) => state.loading);
export const selectOrderError = createSelector(selectOrderFeature, (state) => state.error);
