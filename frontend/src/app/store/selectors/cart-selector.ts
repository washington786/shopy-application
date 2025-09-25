import { createFeatureSelector, createSelector } from "@ngrx/store";
import { cartKey, CartState } from "../reducers/cart-reducer";

export const selectCartFeature = createFeatureSelector<CartState>(cartKey);

export const selectCartItems = createSelector(selectCartFeature, (state) => state.cartItems);

export const selectCartLoading = createSelector(selectCartFeature, (state) => state.loading);

export const selectCartError = createSelector(selectCartFeature, (state) => state.error);

// cart extras
export const selectCartTotalAmount = createSelector(selectCartFeature, (state) => state.cartItems.reduce((total, item) => total + item.productPrice, 0));
export const selectCartCount = createSelector(selectCartFeature, (state) => state.cartItems.reduce((count, item) => count + item.id, 0));
