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

export function mapEmployeeToDto(
  employee: Partial<EmployeeFormData & EmployeeDto>
): Partial<EmployeeDto> {
  if (!employee) {
    return {};
  }

  const dto: Partial<EmployeeDto> = {};

  if (employee.id !== undefined) {
    dto.id = typeof employee.id === 'string' ? employee.id.trim() : employee.id;
  }
  if (employee.name !== undefined) {
    dto.name = employee.name.trim();
  }
  if (employee.email !== undefined) {
    const email = employee.email.trim();
    dto.email = email;
    dto.emailId = email;
  }
  if (employee.mobile !== undefined) {
    dto.mobile = employee.mobile.trim();
  }
  if (employee.country !== undefined) {
    dto.country = employee.country.trim();
  }
  if (employee.state !== undefined) {
    dto.state = employee.state.trim();
  }
  if (employee.district !== undefined) {
    dto.district = employee.district.trim();
  }
  if (employee.avatar !== undefined) {
    dto.avatar = employee.avatar.trim();
  }
  if (employee.createdAt !== undefined) {
    dto.createdAt = employee.createdAt.trim();
  }

  for (const [key, value] of Object.entries(employee)) {
    if (value !== undefined && !(key in dto)) {
      Object.assign(dto, { [key]: typeof value === 'string' ? value.trim() : value });
    }
  }

  return dto;
}

