import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST request to login endpoint', () => {
    const credentials = {
      email: 'test@test.com',
      password: 'password'
    };

    const mockResponse: ApiResponse<null> = {
      message: 'Login successful',
      data: null
    };

    service.login(credentials).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockResponse);
  });

  it('should send POST request to register endpoint', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
      firstname: 'John',
      lastname: 'Doe'
    };

    const mockResponse: ApiResponse<null> = {
      message: 'Register successful',
      data: null
    };

    service.register(payload as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockResponse);
  });

});
