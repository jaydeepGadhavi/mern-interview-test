import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = '/api';
  private http = inject(HttpClient);
  private spinnerService = inject(SpinnerService);
  private cookieService = inject(CookieService);

  /**
   * Directly triggers spinner show
   */
  show(): void {
    this.spinnerService.show();
  }

  /**
   * Directly triggers spinner hide
   */
  hide(): void {
    this.spinnerService.hide();
  }

  /**
   * Returns HttpHeaders containing default content headers and
   * the decrypted Authorization Bearer token from cookies when present.
   */
  getHeader(customHeaders?: Record<string, string>): HttpHeaders {
    let headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders || {})
    };

    const token = this.cookieService.get('token');
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headersConfig);
  }

  /**
   * Helper to normalize endpoint path to prepend baseUrl if needed.
   */
  private resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    if (cleanUrl.startsWith(this.baseUrl)) {
      return cleanUrl;
    }
    return `${this.baseUrl}${cleanUrl}`;
  }

  /**
   * Extracts clean error message from HttpErrorResponse.
   */
  formatError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error?.details && Array.isArray(error.error.details)) {
        return error.error.details.join(', ');
      }
      if (error.error?.message) {
        return error.error.message;
      }
      if (typeof error.error === 'string') {
        return error.error;
      }
      return error.message || 'Request failed';
    }
    return error?.message || 'An unexpected error occurred';
  }

  /**
   * GET request: shows spinner on start, hides on finalize.
   */
  get<T>(url: string, params?: Record<string, any>, customHeaders?: Record<string, string>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        const val = params[key];
        if (val !== undefined && val !== null && val !== '') {
          httpParams = httpParams.set(key, String(val));
        }
      }
    }

    this.show();
    return this.http.get<T>(this.resolveUrl(url), {
      headers: this.getHeader(customHeaders),
      params: httpParams
    }).pipe(
      finalize(() => this.hide()),
      catchError(err => throwError(() => this.formatError(err)))
    );
  }

  /**
   * POST request: shows spinner on start, hides on finalize.
   */
  post<T>(url: string, data?: any, customHeaders?: Record<string, string>): Observable<T> {
    this.show();
    return this.http.post<T>(this.resolveUrl(url), data, {
      headers: this.getHeader(customHeaders)
    }).pipe(
      finalize(() => this.hide()),
      catchError(err => throwError(() => this.formatError(err)))
    );
  }

  /**
   * PUT request: shows spinner on start, hides on finalize.
   */
  put<T>(url: string, data?: any, customHeaders?: Record<string, string>): Observable<T> {
    this.show();
    return this.http.put<T>(this.resolveUrl(url), data, {
      headers: this.getHeader(customHeaders)
    }).pipe(
      finalize(() => this.hide()),
      catchError(err => throwError(() => this.formatError(err)))
    );
  }

  /**
   * DELETE request: shows spinner on start, hides on finalize.
   */
  delete<T>(url: string, customHeaders?: Record<string, string>): Observable<T> {
    this.show();
    return this.http.delete<T>(this.resolveUrl(url), {
      headers: this.getHeader(customHeaders)
    }).pipe(
      finalize(() => this.hide()),
      catchError(err => throwError(() => this.formatError(err)))
    );
  }
}
