export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  avatar?: string;
  createdAt?: string;
}

export interface EmployeeDto {
  id?: string | number;
  name: string;
  email?: string;
  emailId?: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  avatar?: string;
  createdAt?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
}

export function mapEmployeeDtoToEmployee(dto: EmployeeDto): Employee {
  return {
    id: String(dto.id ?? ''),
    name: dto.name ? dto.name.trim() : '',
    email: (dto.email || dto.emailId || '').trim(),
    mobile: (dto.mobile || '').trim(),
    country: (dto.country || '').trim(),
    state: (dto.state || '').trim(),
    district: (dto.district || '').trim(),
    avatar: dto.avatar,
    createdAt: dto.createdAt
  };
}

export function mapEmployeeToDto(employee: Partial<EmployeeFormData>): Partial<EmployeeDto> {
  return {
    ...employee,
    name: employee.name ? employee.name.trim() : undefined,
    email: employee.email ? employee.email.trim() : undefined,
    emailId: employee.email ? employee.email.trim() : undefined,
    mobile: employee.mobile ? employee.mobile.trim() : undefined,
    country: employee.country ? employee.country.trim() : undefined,
    state: employee.state ? employee.state.trim() : undefined,
    district: employee.district ? employee.district.trim() : undefined
  };
}
