import { TestBed } from '@angular/core/testing';

import { IsSignedInGuardGuard } from './is-signed-in-guard.guard';

describe('IsSignedInGuardGuard', () => {
  let guard: IsSignedInGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsSignedInGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
