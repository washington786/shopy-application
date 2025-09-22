import { Component, inject, Input } from '@angular/core';
import { ProductDto } from '../../core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [],
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
