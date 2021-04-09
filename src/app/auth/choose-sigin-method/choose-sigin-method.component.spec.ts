import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSiginMethodComponent } from './choose-sigin-method.component';

describe('ChooseSiginMethodComponent', () => {
  let component: ChooseSiginMethodComponent;
  let fixture: ComponentFixture<ChooseSiginMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseSiginMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSiginMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
