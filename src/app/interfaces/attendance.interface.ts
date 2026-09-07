export interface Attendance {
  id?: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: string;
  remarks: string;
}
