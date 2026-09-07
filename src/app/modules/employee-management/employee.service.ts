import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEmployee } from '../../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.employeeApiUrl}/users`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.apiUrl);
  }

  getEmployeeById(id: string): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: IEmployee): Observable<IEmployee> {
    return this.http.put<IEmployee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
