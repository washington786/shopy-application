import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { CheckoutService } from '../../../core/services/checkout-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry, take } from 'rxjs';
@Component({
  selector: 'app-checkout-success',
  imports: [LoadingSpinner, MatIconModule, DatePipe, NgFor, NgIf],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css'
})
export class CheckoutSuccess implements OnInit {
  orderId: string | null = null;
  sessionId: string | null = null;
  isLoading = signal<boolean>(false);
  service = inject(CheckoutService);
  snackBar = inject(MatSnackBar);

  destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.isLoading.set(true);
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if ((!this.sessionId)) return;

    console.log(this.sessionId);


    const sub = this.service.ConfirmPayment(this.sessionId).pipe(retry(4)).subscribe({
      next: res => {
        console.log('response of order: ', res);

        this.isLoading.set(false);
        this.snackBar.open("Order created successfully", "Ok", { duration: 4000 })
      },
      error: error => {
        console.log('Error in order: ', error);
        this.snackBar.open("Failed payment.", "Ok", { duration: 4000 });
        this.isLoading.set(false);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());

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
