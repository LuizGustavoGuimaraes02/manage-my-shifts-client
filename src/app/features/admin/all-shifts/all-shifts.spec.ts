import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllShifts } from './all-shifts';

describe('AllShifts', () => {
  let component: AllShifts;
  let fixture: ComponentFixture<AllShifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllShifts],
    }).compileComponents();

    fixture = TestBed.createComponent(AllShifts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
