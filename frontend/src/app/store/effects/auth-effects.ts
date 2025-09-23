import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../core/services/auth-service";
import { catchError, exhaustMap, map, of, take, tap } from "rxjs";
import { deactivateProfileAction, deactivateProfileFailure, deactivateProfileSuccess, loadProfileAction, loadProfileFailure, loadProfileSuccess, loginAction, loginFailure, loginSuccess, logoutAction, persistAuthToken, persistAuthTokenFailure, persistAuthTokenSuccess, registerAction, registerfailure, registerSuccess, updateProfileAction, updateProfileFailure, updateProfileSuccess } from "../actions/auth-actions";

@Injectable()
export class AuthEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);

  private service = inject(AuthService);

  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(loginAction),
    exhaustMap(
      action => this.service.loginUser(action.loginRequest).pipe(
        map(res => loginSuccess({ response: res })),
        catchError(error => of(loginFailure({ error })))
      )
    )
  ));

  loginUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    take(1),
    tap((res) => {
      localStorage.setItem("token", res.response.token)
      this.router.navigate(["/app/products"]);
    })
  ), { dispatch: false });

  registerUser$ = createEffect(() => this.actions$.pipe(
    ofType(registerAction),
    exhaustMap(action => this.service.registerUser(action.registerRequest).pipe(
      map(res => registerSuccess({ response: res })),
      catchError(error => of(registerfailure({ error })))
    ))
  ));
  loadUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(loadProfileAction),
    exhaustMap(action => this.service.getUserProfile().pipe(
      map(res => loadProfileSuccess({ response: res })),
      catchError(error => of(loadProfileFailure({ error })))
    ))
  ));
  updateUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(updateProfileAction),
    exhaustMap(action => this.service.updateUserProfile(action.updateProfileRequest).pipe(
      map(res => updateProfileSuccess({ response: res })),
      catchError(error => of(updateProfileFailure({ error })))
    ))
  ));
  deactivateUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(deactivateProfileAction),
    exhaustMap(action => this.service.deactivateUserProfile(action.userId).pipe(
      map(res => deactivateProfileSuccess()),
      catchError(error => of(deactivateProfileFailure({ error })))
    ))
  ));

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(logoutAction),
      tap(() => {
        this.service.logout();
        this.router.navigate(["/auth/login"])
      })
    ), { dispatch: false });

  persistentAuth$ = createEffect(() => this.actions$.pipe(
    ofType(persistAuthToken),
    exhaustMap(action => (this.service.getUserProfile().pipe(
      map(res => persistAuthTokenSuccess({ user: res, token: localStorage.getItem("token") || "" })),
      catchError(error => of(persistAuthTokenFailure({ error })))
    )))
  ))
}
