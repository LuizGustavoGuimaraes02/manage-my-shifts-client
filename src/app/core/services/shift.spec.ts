import { TestBed } from '@angular/core/testing';
import { Shift } from './shift';

describe('Shift', () => {
  let service: Shift;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shift);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
