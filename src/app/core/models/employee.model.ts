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
  if (!employee) {
    return {};
  }

  const dto: Record<string, unknown> = { ...employee };

  if (employee.name !== undefined) {
    dto['name'] = typeof employee.name === 'string' ? employee.name.trim() : employee.name;
  }
  if (employee.email !== undefined) {
    const trimmedEmail = typeof employee.email === 'string' ? employee.email.trim() : employee.email;
    dto['email'] = trimmedEmail;
    dto['emailId'] = trimmedEmail;
  }
  if (employee.mobile !== undefined) {
    dto['mobile'] = typeof employee.mobile === 'string' ? employee.mobile.trim() : employee.mobile;
  }
  if (employee.country !== undefined) {
    dto['country'] = typeof employee.country === 'string' ? employee.country.trim() : employee.country;
  }
  if (employee.state !== undefined) {
    dto['state'] = typeof employee.state === 'string' ? employee.state.trim() : employee.state;
  }
  if (employee.district !== undefined) {
    dto['district'] = typeof employee.district === 'string' ? employee.district.trim() : employee.district;
  }

  return Object.fromEntries(
    Object.entries(dto).filter(([_, value]) => value !== undefined)
  ) as Partial<EmployeeDto>;
}

