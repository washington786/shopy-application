import { Component, inject, Input } from '@angular/core';
import { ProductDto } from '../../core/models/product.model';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: ProductDto;
  router = inject(Router);

  viewDetails() {
    this.router.navigate(['/products', this.product.id]);
  }
}
