import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyShifts } from './my-shifts';

describe('MyShifts', () => {
  let component: MyShifts;
  let fixture: ComponentFixture<MyShifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyShifts],
    }).compileComponents();

    fixture = TestBed.createComponent(MyShifts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
