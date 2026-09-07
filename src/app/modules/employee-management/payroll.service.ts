import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payroll } from '../../interfaces/payroll.interface';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private apiUrl = environment.payrollApiUrl;

  constructor(private http: HttpClient) {}

  getPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.apiUrl);
  }

  getPayrollById(id: string): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.apiUrl}/${id}`);
  }

  addPayroll(data: Payroll): Observable<Payroll> {
    return this.http.post<Payroll>(this.apiUrl, data);
  }

  updatePayroll(id: string, data: Payroll): Observable<Payroll> {
    return this.http.put<Payroll>(`${this.apiUrl}/${id}`, data);
  }

  deletePayroll(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
