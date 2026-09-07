import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { IEmployee } from '../../interfaces/employee.interface';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads employees from the configured API', () => {
    const employees: IEmployee[] = [];
    service.getEmployees().subscribe((result) => expect(result).toEqual(employees));

    const request = httpMock.expectOne(environment.employeeApiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(employees);
  });

  it('sends an update to the selected employee endpoint', () => {
    const employee = { id: '7' } as IEmployee;
    service.updateEmployee('7', employee).subscribe((result) => expect(result).toEqual(employee));

    const request = httpMock.expectOne(`${environment.employeeApiUrl}/7`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(employee);
    request.flush(employee);
  });
});
