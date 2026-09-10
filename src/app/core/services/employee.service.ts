import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Employee,
  EmployeeDto,
  EmployeeFormData,
  mapEmployeeDtoToEmployee,
  mapEmployeeToDto
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + environment.endpoints.employees;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<EmployeeDto[]>(this.baseUrl).pipe(
      map((dtos) => dtos.map(mapEmployeeDtoToEmployee))
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<EmployeeDto>(url).pipe(
      map(mapEmployeeDtoToEmployee)
    );
  }

  createEmployee(employee: EmployeeFormData): Observable<Employee> {
    const payload = mapEmployeeToDto(employee);
    return this.http.post<EmployeeDto>(this.baseUrl, payload).pipe(
      map(mapEmployeeDtoToEmployee)
    );
  }

  updateEmployee(id: string, employee: Partial<EmployeeFormData>): Observable<Employee> {
    const url = `${this.baseUrl}/${id}`;
    const payload = mapEmployeeToDto(employee);
    return this.http.put<EmployeeDto>(url, payload).pipe(
      map(mapEmployeeDtoToEmployee)
    );
  }

  deleteEmployee(id: string): Observable<string> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<unknown>(url).pipe(
      map(() => id)
    );
  }
}
