import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILeave } from '../../interfaces/leave.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = environment.leaveApiUrl;

  constructor(private http: HttpClient) {}

  getLeaves(): Observable<ILeave[]> {
    return this.http.get<ILeave[]>(this.apiUrl);
  }

  getLeaveById(id: string): Observable<ILeave> {
    return this.http.get<ILeave>(`${this.apiUrl}/${id}`);
  }

  createLeave(leave: ILeave): Observable<ILeave> {
    return this.http.post<ILeave>(this.apiUrl, leave);
  }

  updateLeave(id: string, leave: ILeave): Observable<ILeave> {
    return this.http.put<ILeave>(`${this.apiUrl}/${id}`, leave);
  }

  deleteLeave(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
