export interface Payroll {
  id?: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  allowance: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  status: string;
  remarks: string;
}
