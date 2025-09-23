import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header-component/header-component";
import { Store } from '@ngrx/store';
import { persistAuthToken } from './store/actions/auth-actions';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './store/selectors/auth-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  store = inject(Store);
  isAuthenticated$!: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(persistAuthToken());
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    console.log(this.isAuthenticated$);
  }

}
