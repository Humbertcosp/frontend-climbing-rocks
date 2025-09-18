// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Sólo añadimos el Authorization cuando la petición va a nuestra API
    const apiRoot = environment.apiUrl.replace(/\/api\/?$/, '');
    const isApi =
      req.url.startsWith(environment.apiUrl) || req.url.startsWith(apiRoot);

    return from(this.auth.getToken()).pipe(
      switchMap((token) => {
        // Evita credenciales por cookies: withCredentials a false siempre
        if (!token || !isApi) {
          return next.handle(req.clone({ withCredentials: false }));
        }

        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
          withCredentials: false,
        });
        return next.handle(cloned);
      })
    );
  }
}
