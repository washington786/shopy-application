import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CartService } from "../../core/services/cart-service";
import { addToCartAction, addToCartFailure, addToCartSuccess, clearCartAction, clearCartFailure, clearCartSuccess, loadCartAction, loadCartFailure, loadCartSuccess, removeItemCartAction, removeItemCartFailure, removeItemCartSuccess, updateItemCartAction, updateItemCartFailure, updateItemCartSuccess } from "../actions/cart-actions";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  private service = inject(CartService);

  createCart$ = createEffect(() => this.actions$.pipe(
    ofType(addToCartAction),
    exhaustMap((action) => this.service.addToCart(action.payload).pipe(
      map(res => addToCartSuccess({ response: res })),
      catchError(error => of(addToCartFailure(error)))
    ))
  ));

  loadCartItems$ = createEffect(() => this.actions$.pipe(
    ofType(loadCartAction),
    exhaustMap(() => this.service.loadCartItems().pipe(
      map(res => loadCartSuccess({ response: res })),
      catchError(error => of(loadCartFailure(error)))
    ))
  ));

  removeCartItems$ = createEffect(() => this.actions$.pipe(
    ofType(removeItemCartAction),
    exhaustMap((action) => this.service.removeCartItem(action.cartItemId).pipe(
      map(() => removeItemCartSuccess()),
      catchError(error => of(removeItemCartFailure(error)))
    ))
  ));

  clearCartItems$ = createEffect(() => this.actions$.pipe(
    ofType(clearCartAction),
    exhaustMap(() => this.service.clearCart().pipe(
      map(() => clearCartSuccess()),
      catchError(error => of(clearCartFailure(error)))
    ))
  ));

  updateCart$ = createEffect(() => this.actions$.pipe(
    ofType(updateItemCartAction),
    exhaustMap((action) => this.service.updateCartItems(action.request.cartId!, action.request).pipe(
      map(res => updateItemCartSuccess({ response: res })),
      catchError(error => of(updateItemCartFailure(error)))
    ))
  ));

}
