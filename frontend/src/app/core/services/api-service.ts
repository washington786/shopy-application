import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}`, { headers: this.getHeaders() }).pipe(retry(1), catchError(error => this.handleError(error)));
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.getHeaders()
    }).pipe(catchError(error => this.handleError(error)));
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, { headers: this.getHeaders() }).pipe(catchError(error => this.handleError(error)));
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { headers: this.getHeaders() }).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`
    }

    console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
