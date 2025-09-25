import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authKey, AuthState } from "../reducers/auth-reducer";

export const selectAuthFeature = createFeatureSelector<AuthState>(authKey);

export const selectAuthUser = createSelector(selectAuthFeature, (state) => state.user);
export const selectAuthLoading = createSelector(selectAuthFeature, (state) => state.loading);
export const selectAuthToken = createSelector(selectAuthFeature, (state) => state.token);
export const selectAuthError = createSelector(selectAuthFeature, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectAuthFeature, (state) => state.isAuthenticated);
export const selectAuthUserRoles = createSelector(selectAuthFeature, (state) => state.user?.roles);
