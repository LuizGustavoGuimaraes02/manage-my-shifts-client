import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiftForm } from './shift-form';

describe('ShiftForm', () => {
  let component: ShiftForm;
  let fixture: ComponentFixture<ShiftForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
