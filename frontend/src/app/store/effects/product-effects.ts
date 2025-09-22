import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions } from "@ngrx/effects";
import { ProductService } from "../../core/services/product-service";

@Injectable()
export class ProductEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);

  private service = inject(ProductService);
}
