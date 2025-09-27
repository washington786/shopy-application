import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsManement } from './order-details-manement';

describe('OrderDetailsManement', () => {
  let component: OrderDetailsManement;
  let fixture: ComponentFixture<OrderDetailsManement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsManement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsManement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
