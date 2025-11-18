import type { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Always send credentials (cookies) with requests to same origin or specified domains
  const withCredentials = req.url.includes('/api');
  
  if (withCredentials) {
    const authReq = req.clone({
      withCredentials: true,  // This ensures cookies are sent with the request
      headers: req.headers
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    });
    return next(authReq);
  }

  return next(req);
};