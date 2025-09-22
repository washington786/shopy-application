import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions } from "@ngrx/effects";
import { OrderService } from "../../core/services/order-service";

@Injectable()
export class OrderEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);

  private service = inject(OrderService);
}
