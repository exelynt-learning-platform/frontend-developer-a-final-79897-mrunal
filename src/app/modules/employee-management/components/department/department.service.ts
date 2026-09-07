import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IDepartment } from '../../../../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = `${environment.departmentApiUrl}/department`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.apiUrl);
  }

  getDepartmentById(id: string): Observable<IDepartment> {
    return this.http.get<IDepartment>(`${this.apiUrl}/${id}`);
  }

  addDepartment(department: IDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.apiUrl, department);
  }

  updateDepartment(id: string, department: IDepartment): Observable<IDepartment> {
    return this.http.put<IDepartment>(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}