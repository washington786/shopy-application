import { createFeatureSelector, createSelector } from "@ngrx/store";
import { productsKey, ProductState } from "../reducers/product-reducer";

export const selectProductFeature = createFeatureSelector<ProductState>(productsKey);

export const selectProducts = createSelector(selectProductFeature, (state) => state.products);
export const selectCurrentProduct = createSelector(selectProductFeature, (state) => state.currentProduct);
export const selectProductLoading = createSelector(selectProductFeature, (state) => state.loading);
export const selectProductError = createSelector(selectProductFeature, (state) => state.error);
