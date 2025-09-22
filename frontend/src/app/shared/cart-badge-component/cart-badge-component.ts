import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../store/selectors/cart-selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cart-badge-component',
  imports: [AsyncPipe],
  templateUrl: './cart-badge-component.html',
  styleUrl: './cart-badge-component.css'
})
export class CartBadgeComponent {
  store = inject(Store);

  cartCount$ = this.store.select(selectCartCount);
}
