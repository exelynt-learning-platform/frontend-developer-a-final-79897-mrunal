export interface IEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  position: string;
  hireDate: string;
  salary: number;
  status: string;

gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  employmentType?: 'Full Time' | 'Part Time' | 'Contract' | 'Intern';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  pincode?: string;
  notes?: string;
  profileImage?: string; // base64 data URL preview / upload payload
}
 