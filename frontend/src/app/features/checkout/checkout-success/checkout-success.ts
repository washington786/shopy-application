import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { DatePipe, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-checkout-success',
  imports: [LoadingSpinner, MatIconModule, DatePipe, NgFor, NgIf],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css'
})
export class CheckoutSuccess implements OnInit {
  orderId: string | null = null;
  isLoading = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  goToOrders() {
    this.router.navigate(['/app/orders']);
  }

  continueShopping() {
    this.router.navigate(['/app/products']);
  }
  get today(): Date {
    return new Date();
  }

  get deliveryDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }
}
