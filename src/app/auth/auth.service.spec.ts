import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
//Auth0 code
describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
