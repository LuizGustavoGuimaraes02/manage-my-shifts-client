import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllWorkers } from './all-workers';

describe('AllWorkers', () => {
  let component: AllWorkers;
  let fixture: ComponentFixture<AllWorkers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWorkers],
    }).compileComponents();

    fixture = TestBed.createComponent(AllWorkers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
