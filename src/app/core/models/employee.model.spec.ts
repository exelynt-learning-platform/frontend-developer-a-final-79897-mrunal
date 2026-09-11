import {
  EmployeeDto,
  EmployeeFormData,
  mapEmployeeDtoToEmployee,
  mapEmployeeToDto
} from './employee.model';

describe('EmployeeModel Mappings', () => {
  describe('mapEmployeeToDto', () => {
    it('should map full employee form data and trim strings', () => {
      const input: EmployeeFormData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        mobile: '  9876543210  ',
        country: '  India  ',
        state: '  Maharashtra  ',
        district: '  Pune  '
      };

      const result = mapEmployeeToDto(input);

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        emailId: 'john@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune'
      });
    });

    it('should omit properties whose values are undefined in partial updates', () => {
      const partialInput: Partial<EmployeeFormData> = {
        name: 'Jane Doe',
        mobile: '9876543211'
      };

      const result = mapEmployeeToDto(partialInput);

      expect(result).toEqual({
        name: 'Jane Doe',
        mobile: '9876543211'
      });

      // Explicitly check that omitted properties are not keys on the returned object
      expect('email' in result).toBeFalse();
      expect('emailId' in result).toBeFalse();
      expect('country' in result).toBeFalse();
      expect('state' in result).toBeFalse();
      expect('district' in result).toBeFalse();
      expect(Object.keys(result)).toEqual(['name', 'mobile']);
    });

    it('should omit properties explicitly set to undefined', () => {
      const inputWithUndefined: Partial<EmployeeFormData> & Record<string, unknown> = {
        name: 'Bob Smith',
        email: undefined,
        mobile: '1234567890',
        country: undefined,
        avatar: undefined
      };

      const result = mapEmployeeToDto(inputWithUndefined);

      expect(result).toEqual({
        name: 'Bob Smith',
        mobile: '1234567890'
      });
      expect('email' in result).toBeFalse();
      expect('emailId' in result).toBeFalse();
      expect('country' in result).toBeFalse();
      expect('avatar' in result).toBeFalse();
    });

    it('should preserve valid falsy values such as empty strings, 0, false, and null', () => {
      const inputWithFalsy: Partial<EmployeeFormData> & Record<string, unknown> = {
        name: '',
        mobile: '0',
        country: '',
        count: 0,
        isActive: false,
        notes: null
      };

      const result = mapEmployeeToDto(inputWithFalsy);

      expect(result.name).toBe('');
      expect(result.mobile).toBe('0');
      expect(result.country).toBe('');
      expect((result as Record<string, unknown>)['count']).toBe(0);
      expect((result as Record<string, unknown>)['isActive']).toBe(false);
      expect((result as Record<string, unknown>)['notes']).toBeNull();
      expect('name' in result).toBeTrue();
      expect('mobile' in result).toBeTrue();
      expect('country' in result).toBeTrue();
    });

    it('should return empty object when input is empty object', () => {
      const result = mapEmployeeToDto({});
      expect(result).toEqual({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should return empty object when input is null or undefined', () => {
      expect(mapEmployeeToDto(null as unknown as Partial<EmployeeFormData>)).toEqual({});
      expect(mapEmployeeToDto(undefined as unknown as Partial<EmployeeFormData>)).toEqual({});
    });

    it('should set both email and emailId when email is provided', () => {
      const result = mapEmployeeToDto({ email: 'test@example.com' });
      expect(result.email).toBe('test@example.com');
      expect(result.emailId).toBe('test@example.com');
    });

    it('should preserve extra defined fields such as id, avatar, and createdAt', () => {
      const input = {
        id: '123',
        name: 'Alice',
        avatar: 'avatar.png',
        createdAt: '2026-01-01'
      } as Partial<EmployeeFormData> & Partial<EmployeeDto>;

      const result = mapEmployeeToDto(input);

      expect(result.id).toBe('123');
      expect(result.name).toBe('Alice');
      expect(result.avatar).toBe('avatar.png');
      expect(result.createdAt).toBe('2026-01-01');
    });

    it('should preserve numeric id without trimming', () => {
      const result = mapEmployeeToDto({ id: 123 } as unknown as Partial<EmployeeFormData>);
      expect(result.id).toBe(123);
    });

    it('should trim and preserve extra string properties', () => {
      const result = mapEmployeeToDto({ customField: '  custom  ' } as unknown as Partial<EmployeeFormData>);
      expect((result as Record<string, unknown>)['customField']).toBe('custom');
    });
  });

  describe('mapEmployeeDtoToEmployee', () => {
    it('should map DTO with email to Employee', () => {
      const dto: EmployeeDto = {
        id: '10',
        name: 'Alice',
        email: 'alice@test.com',
        mobile: '1234567890',
        country: 'USA',
        state: 'CA',
        district: 'SF',
        avatar: 'avatar.png',
        createdAt: '2026-01-01'
      };

      const employee = mapEmployeeDtoToEmployee(dto);

      expect(employee).toEqual({
        id: '10',
        name: 'Alice',
        email: 'alice@test.com',
        mobile: '1234567890',
        country: 'USA',
        state: 'CA',
        district: 'SF',
        avatar: 'avatar.png',
        createdAt: '2026-01-01'
      });
    });

    it('should fallback to emailId if email is absent', () => {
      const dto: EmployeeDto = {
        id: 20,
        name: 'Bob',
        emailId: 'bob@test.com',
        mobile: '9876543210',
        country: 'India',
        state: 'MH',
        district: 'Mumbai'
      };

      const employee = mapEmployeeDtoToEmployee(dto);

      expect(employee.id).toBe('20');
      expect(employee.email).toBe('bob@test.com');
    });

    it('should use empty defaults when optional DTO values are absent', () => {
      const employee = mapEmployeeDtoToEmployee({
        name: '',
        mobile: '',
        country: '',
        state: '',
        district: ''
      });

      expect(employee).toEqual({
        id: '',
        name: '',
        email: '',
        mobile: '',
        country: '',
        state: '',
        district: '',
        avatar: undefined,
        createdAt: undefined
      });
    });
  });
});
