import { HttpInterceptorFn } from '@angular/common/http';

export const jwtAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
