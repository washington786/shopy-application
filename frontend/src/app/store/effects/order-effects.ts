import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { OrderService } from "../../core/services/order-service";
import { addOrderAction, AddOrderFailure, AddOrderSuccess, loadOrderByidAction, loadOrderByidFailure, loadOrderByidSuccess, loadOrdersAction, loadOrdersFailure, loadOrdersSuccess, updateOrderAction, updateOrderFailure, updateOrderSuccess } from "../actions/order-actions";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable()
export class OrderEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);

  private service = inject(OrderService);

  addOrder$ = createEffect(() => this.actions$.pipe(
    ofType(addOrderAction),
    exhaustMap(action => this.service.createOrder(action.request).pipe(
      map(res => AddOrderSuccess({ response: res })),
      catchError(error => of(AddOrderFailure(error)))
    ))
  ));

  loadOrders$ = createEffect(() => this.actions$.pipe(
    ofType(loadOrdersAction),
    exhaustMap(action => this.service.getAllOrders().pipe(
      map(res => loadOrdersSuccess({ response: res })),
      catchError(error => of(loadOrdersFailure(error)))
    ))
  ));

  loadOrderById$ = createEffect(() => this.actions$.pipe(
    ofType(loadOrderByidAction),
    exhaustMap(action => this.service.getOrderById(action.orderId).pipe(
      map(res => loadOrderByidSuccess({ response: res })),
      catchError(error => of(loadOrderByidFailure(error)))
    ))
  ));

  updateOrder$ = createEffect(() => this.actions$.pipe(
    ofType(updateOrderAction),
    exhaustMap(action => this.service.updateOrderStatus(action.request).pipe(
      map(res => updateOrderSuccess({ response: res })),
      catchError(error => of(updateOrderFailure(error)))
    ))
  ))
}
