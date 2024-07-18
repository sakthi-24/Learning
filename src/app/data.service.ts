import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, switchMap, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient,
    private cookieService: CookieService) {
     }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        const accessToken = response.token.accessToken;
        const refreshToken = response.token.refreshToken;
        if (accessToken && refreshToken) {
          this.cookieService.set('accessToken', accessToken);
          this.cookieService.set('refreshToken', refreshToken);
        }
      })
    );
  }

  getMessage(): Observable<any>{
    return this.http.get(`${this.apiUrl}/message`);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('refreshToken');
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  logout(){
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('accessToken');
  }
  
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/verify`, { email, otp });
  }

  changePassword(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword`, { email, password });
  }

}
