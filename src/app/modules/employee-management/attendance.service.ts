import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Attendance } from '../../interfaces/attendance.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = environment.attendanceApiUrl;

  constructor(private http: HttpClient) {}

  getAttendance(): Observable<Attendance[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.mapToAttendance(item)))
    );
  }

  getAttendanceById(id: string): Observable<Attendance> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => this.mapToAttendance(item))
    );
  }

  private mapToAttendance(item: any): Attendance {
    return {
      id: item.id,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      department: item.departmentName || item.department, // API uses departmentName
      date: item.Date || item.date, // API uses Date
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      workingHours: item.workHour || item.workingHours, // API uses workHour
      status: item.status,
      remarks: item.remarks
    };
  }

  addAttendance(data: Attendance): Observable<Attendance> {
    const apiData = this.mapToApiFormat(data);
    return this.http.post<any>(this.apiUrl, apiData).pipe(
      map(item => this.mapToAttendance(item))
    );
  }

  updateAttendance(id: string, data: Attendance): Observable<Attendance> {
    const apiData = this.mapToApiFormat(data);
    return this.http.put<any>(`${this.apiUrl}/${id}`, apiData).pipe(
      map(item => this.mapToAttendance(item))
    );
  }

  private mapToApiFormat(data: Attendance): any {
    return {
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      departmentName: data.department,
      Date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      workHour: data.workingHours,
      status: data.status,
      remarks: data.remarks
    };
  }

  deleteAttendance(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
