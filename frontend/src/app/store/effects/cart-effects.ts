import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect } from "@ngrx/effects";
import { CartService } from "../../core/services/cart-service";

@Injectable()
export class CartEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);

  private service = inject(CartService);

  // createCart$ = createEffect()
}
