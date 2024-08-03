import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpoint: string = 'https://reqres.in/api/login';
  private http = inject(HttpClient);

  public loginReq(body: { email: string; password: string }): Observable<any> {
    return this.http.post(this.endpoint, body);
  }
}
