import { createAction, props } from "@ngrx/store";
import { AuthResponse, LoginRequest, RegisterRequest, updateProfileRequest, UserDto } from "../../core/models/auth.model";

// login
export const loginAction = createAction('[Auth Page] Login', props<{ loginRequest: LoginRequest }>());
export const loginSuccess = createAction('[Auth Page] Login success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth page] Login Failure', props<{ error: string }>());

// register
export const registerAction = createAction('[Auth Page] Register', props<{ registerRequest: RegisterRequest }>())
export const registerSuccess = createAction('[Auth Page] Register success', props<{ response: AuthResponse }>())
export const registerfailure = createAction('[Auth Page] Register failure', props<{ error: string }>())

// profile

export const loadProfileAction = createAction('[Auth Page] profile')
export const loadProfileSuccess = createAction('[Auth Page] profile success', props<{ response: UserDto }>())
export const loadProfileFailure = createAction('[Auth Page] profile failure', props<{ error: string }>())

// update profile
export const updateProfileAction = createAction('[Auth Page] profile update', props<{ updateProfileRequest: updateProfileRequest }>())
export const updateProfileSuccess = createAction('[Auth Page] profile update success', props<{ response: UserDto }>())
export const updateProfileFailure = createAction('[Auth Page] profile update failure', props<{ error: string }>())

// deactivate profile
export const deactivateProfileAction = createAction('[Auth Page] profile remove', props<{ userId: string }>())
export const deactivateProfileSuccess = createAction('[Auth Page] profile remove success')
export const deactivateProfileFailure = createAction('[Auth Page] profile remove failure', props<{ error: string }>())

// logout
export const logoutAction = createAction('[Auth Page] logout');

// persistent auth
export const persistAuthToken = createAction('[Auth Page] persist user');
export const persistAuthTokenSuccess = createAction('[Auth Page] persist user', props<{ token: string, user: UserDto | null }>());
export const persistAuthTokenFailure = createAction('[Auth Page] persist user', props<{ error: string }>());
