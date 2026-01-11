import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { credentialsInterceptor } from './credentials.interceptor';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

describe('credentialsInterceptor', () => {

  it('should NOT add credentials for non API requests', () => {
    const req = new HttpRequest('GET', 'https://external.com/data');

    const next: HttpHandlerFn = jasmine
      .createSpy('next')
      .and.callFake((request) => of(request));

    credentialsInterceptor(req, next);

    const calledRequest = (next as jasmine.Spy).calls.mostRecent()
      .args[0] as HttpRequest<any>;

    expect(calledRequest.withCredentials).toBeFalse();
  });

  it('should add credentials for API requests', () => {
    const req = new HttpRequest(
      'GET',
      `${environment.apiUrl}/events`
    );

    const next: HttpHandlerFn = jasmine
      .createSpy('next')
      .and.callFake((request) => of(request));

    credentialsInterceptor(req, next);

    const calledRequest = (next as jasmine.Spy).calls.mostRecent()
      .args[0] as HttpRequest<any>;

    expect(calledRequest.withCredentials).toBeTrue();
  });
});
