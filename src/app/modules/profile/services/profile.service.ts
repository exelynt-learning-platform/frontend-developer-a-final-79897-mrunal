import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEmployee } from '../../../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.employeeApiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(id: string): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${this.apiUrl}/${id}`);
  }

}
