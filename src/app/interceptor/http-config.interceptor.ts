import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { finalize, of } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const requests: Map<string, HttpRequest<any>> = new Map();

export const httpConfigInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const requestKey: string = generateRequestKey(req);

  // If there is already an ongoing request with the same key, cancel the new one.
  if (requests.has(requestKey)) {
    alert('There is a duplication in requests.');
    return of();
  }

  // Add the request to the map
  requests.set(requestKey, req);

  // Clone the request to avoid modifying the original one
  let clonedRequest: HttpRequest<any>;
  if (authService.isLoggedIn) {
    clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.getToken}`),
    });
  } else {
    clonedRequest = req.clone();
  }

  return next(clonedRequest).pipe(
    finalize(() => {
      // Remove the request from the map once it completes
      requests.delete(requestKey);
    })
  );
};

// Generates a unique key for the request based on URL and params
const generateRequestKey = (req: HttpRequest<any>): string => {
  return `${req.method} ${req.urlWithParams} ${JSON.stringify(req.body)}`;
};
