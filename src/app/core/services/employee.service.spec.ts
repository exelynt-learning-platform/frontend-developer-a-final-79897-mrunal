import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { environment } from '../../../environments/environment';
import { EmployeeDto, EmployeeFormData } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + environment.endpoints.employees;

  const mockEmployeeDtos: EmployeeDto[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru'
    },
    {
      id: '2',
      name: 'Bob Smith',
      emailId: 'bob@example.com',
      mobile: '9876543211',
      country: 'Singapore',
      state: 'Central',
      district: 'Downtown'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all employees and map DTOs correctly', () => {
    service.getEmployees().subscribe((employees) => {
      expect(employees.length).toBe(2);
      expect(employees[0].id).toBe('1');
      expect(employees[0].name).toBe('Alice Johnson');
      expect(employees[0].email).toBe('alice@example.com');
      // Verify emailId fallback mapping
      expect(employees[1].email).toBe('bob@example.com');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployeeDtos);
  });

  it('should fetch employee by ID', () => {
    service.getEmployeeById('1').subscribe((employee) => {
      expect(employee.id).toBe('1');
      expect(employee.name).toBe('Alice Johnson');
    });

    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployeeDtos[0]);
  });

  it('should create employee with POST request and mapped payload', () => {
    const newEmployee: EmployeeFormData = {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      mobile: '9876543212',
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai'
    };

    service.createEmployee(newEmployee).subscribe((created) => {
      expect(created.id).toBe('3');
      expect(created.name).toBe('Charlie Brown');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Charlie Brown');
    expect(req.request.body.email).toBe('charlie@example.com');
    req.flush({ ...newEmployee, id: '3' });
  });

  it('should update employee with PUT request', () => {
    const updateData: Partial<EmployeeFormData> = {
      name: 'Alice Cooper',
      mobile: '9998887776'
    };

    service.updateEmployee('1', updateData).subscribe((updated) => {
      expect(updated.name).toBe('Alice Cooper');
      expect(updated.mobile).toBe('9998887776');
    });

    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockEmployeeDtos[0], name: 'Alice Cooper', mobile: '9998887776' });
  });

  it('should delete employee with DELETE request and return id', () => {
    service.deleteEmployee('1').subscribe((id) => {
      expect(id).toBe('1');
    });

    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle HTTP error properly when server returns 500', () => {
    service.getEmployees().subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
