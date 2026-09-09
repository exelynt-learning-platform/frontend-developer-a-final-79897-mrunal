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

  const dto = Object.fromEntries(
    Object.entries(employee)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  ) as Record<string, unknown>;

  if (dto['email'] !== undefined) {
    dto['emailId'] = dto['email'];
  }

  return dto as Partial<EmployeeDto>;
}

