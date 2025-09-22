import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProductService } from "../../core/services/product-service";
import { catchError, exhaustMap, map, of } from "rxjs";
import { createProduct, createProductFailure, createProductSuccess, loadProductById, loadProductByIdFailure, loadProductByIdSuccess, loadProducts, loadProductsFailure, loadProductsSuccess, removeProduct, removeProductFailure, removeProductSuccess, updateProduct, updateProductFailure, updateProductSuccess } from "../actions/product-actions";

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);

  private service = inject(ProductService);

  loadAllProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    exhaustMap(() => this.service.getAllProducts().pipe(
      map(res => loadProductsSuccess({ response: res })),
      catchError(error => of(loadProductsFailure(error)))
    ))
  ));

  loadProductById$ = createEffect(() => this.actions$.pipe(
    ofType(loadProductById),
    exhaustMap(action => this.service.getProduct(action.productId).pipe(
      map(res => loadProductByIdSuccess({ response: res })),
      catchError(error => of(loadProductByIdFailure(error)))
    ))
  ));
  updateProduct$ = createEffect(() => this.actions$.pipe(
    ofType(updateProduct),
    exhaustMap(action => this.service.updateProductDetails(action.productId, action.request).pipe(
      map(res => updateProductSuccess({ response: res })),
      catchError(error => of(updateProductFailure(error)))
    ))
  ));

  removeProduct$ = createEffect(() => this.actions$.pipe(
    ofType(removeProduct),
    exhaustMap(action => this.service.removeProduct(action.productId).pipe(
      map(() => removeProductSuccess()),
      catchError(error => of(removeProductFailure(error)))
    ))
  ));

  createProduct$ = createEffect(() => this.actions$.pipe(
    ofType(createProduct),
    exhaustMap(action => this.service.createProduct(action.request).pipe(
      map(res => createProductSuccess({ response: res })),
      catchError(error => of(createProductFailure(error)))
    ))
  ));
}
