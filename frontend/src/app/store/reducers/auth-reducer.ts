import { createReducer, on } from "@ngrx/store";
import { UserDto } from "../../core/models/auth.model";
import { deactivateProfileAction, deactivateProfileFailure, deactivateProfileSuccess, loadProfileAction, loadProfileFailure, loadProfileSuccess, loginAction, loginFailure, loginSuccess, logoutAction, registerAction, registerfailure, registerSuccess, updateProfileAction, updateProfileFailure, updateProfileSuccess } from "../actions/auth-actions";

export const authKey: string = 'auth';

export interface AuthState {
  loading: boolean,
  error: string | null,
  user: UserDto | null,
  token: string | null
}


const initialState: AuthState = {
  error: null,
  loading: false,
  token: null,
  user: null
};

export const authReducer = createReducer(initialState,
  // login
  on(loginAction, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { response }) => ({ ...state, loading: false, error: null, user: response.userDto, token: response.token })),
  on(loginFailure, (state, { error }) => ({ ...state, loading: false, error: error })),

  // register
  on(registerAction, (state) => ({ ...state, error: null, loading: true })),
  on(registerSuccess, (state, { response }) => ({ ...state, error: null, loading: false, token: response.token, user: response.userDto })),
  on(registerfailure, (state, { error }) => ({ ...state, error: error, loading: false })),

  // profile
  on(loadProfileAction, (state) => ({ ...state, error: null, loading: true })),
  on(loadProfileFailure, (state, { error }) => ({ ...state, error: error, loading: false })),
  on(loadProfileSuccess, (state, { response }) => ({ ...state, error: null, loading: false, user: response })),

  // update
  on(updateProfileAction, (state) => ({ ...state, error: null, loading: true })),
  on(updateProfileFailure, (state, { error }) => ({ ...state, error: error, loading: false })),
  on(updateProfileSuccess, (state, { response }) => ({ ...state, error: null, loading: false, user: response })),

  // deactivate account
  on(deactivateProfileAction, (state) => ({ ...state, error: null, loading: true })),
  on(deactivateProfileFailure, (state, { error }) => ({ ...state, error: error, loading: false })),
  on(deactivateProfileSuccess, (state) => ({ ...state, error: null, loading: false })),

  // logout
  on(logoutAction, () => ({ ...initialState }))
)
